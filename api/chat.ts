/**
 * POST /api/chat: the website chat bot.
 *
 * Body: { lang: 'ar' | 'en', page: string, messages: [{ role: 'user' | 'bot', text }] }
 * Reply: { reply: string, source: 'ai' | 'quick' }
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   GEMINI_API_KEY     free key from Google AI Studio. Without it the bot uses quick answers only.
 *   GEMINI_MODELS      optional, models tried in order, default "gemini-flash-latest,gemini-flash-lite-latest".
 *   QUESTIONS_SHEET_URL optional, Google Apps Script web app URL; every question is logged there
 *                       (see docs/chatbot-questions-sheet.gs).
 */
// ".js" is required: the site is an ES module package, and Node needs the
// file extension at runtime (Vercel compiles _knowledge.ts to _knowledge.js).
import { quickAnswer, systemPrompt } from './_knowledge.js';

type Role = 'user' | 'bot';
interface Msg { role: Role; text: string }

const MAX_TEXT = 500;
const MAX_TURNS = 8;

// Best-effort limit per visitor while a server instance stays warm.
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 10;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// Free-tier models are tried in order; when one is busy (503), over quota (429)
// or slow, the next one gets the question. Override with GEMINI_MODELS="a,b".
const MODELS = (process.env.GEMINI_MODELS || process.env.GEMINI_MODEL || 'gemini-flash-latest,gemini-flash-lite-latest')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

async function askGemini(key: string, lang: 'ar' | 'en', messages: Msg[]): Promise<string | null> {
  for (const model of MODELS) {
    const reply = await askModel(key, model, lang, messages);
    if (reply) return reply;
  }
  return null;
}

async function askModel(key: string, model: string, lang: 'ar' | 'en', messages: Msg[], noThinking = true): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9_000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(lang) }] },
        contents: messages.map((m) => ({ role: m.role === 'bot' ? 'model' : 'user', parts: [{ text: m.text }] })),
        // thinkingBudget 0: short factual replies need no "thinking", which would
        // otherwise eat the output budget and cut replies off mid-sentence.
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          ...(noThinking ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        },
      }),
    });
    if (!res.ok) {
      const errText = (await res.text()).slice(0, 300);
      console.error('gemini error', model, res.status, errText);
      // Some models refuse thinkingBudget 0 (often as a bare "invalid argument");
      // ask them again without it.
      if (res.status === 400 && noThinking) {
        clearTimeout(timer);
        return askModel(key, model, lang, messages, false);
      }
      return null;
    }
    const data = (await res.json()) as {
      candidates?: { finishReason?: string; content?: { parts?: { text?: string; thought?: boolean }[] } }[];
    };
    const cand = data.candidates?.[0];
    const text = cand?.content?.parts?.filter((p) => !p.thought).map((p) => p.text ?? '').join('').trim();
    // A reply cut off by the token limit reads badly; use a ready answer instead.
    if (cand?.finishReason && cand.finishReason !== 'STOP') {
      console.error('gemini finish', model, cand.finishReason);
      return null;
    }
    return text || null;
  } catch (err) {
    console.error('gemini failed', model, String(err));
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function logQuestion(row: Record<string, string>): Promise<void> {
  console.log('chat_question', JSON.stringify(row));
  const sheet = process.env.QUESTIONS_SHEET_URL;
  if (!sheet) return;
  try {
    await fetch(sheet, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row),
    });
  } catch (err) {
    console.error('sheet log failed', String(err));
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: { lang?: string; page?: string; messages?: Msg[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad json' }, 400);
  }

  const lang: 'ar' | 'en' = body.lang === 'en' ? 'en' : 'ar';
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'bot') && typeof m.text === 'string')
    .map((m) => ({ role: m.role, text: m.text.slice(0, MAX_TEXT) }))
    .slice(-MAX_TURNS);
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user' || !last.text.trim()) return json({ error: 'no question' }, 400);
  // Gemini needs the conversation to start with the visitor.
  while (messages.length && messages[0].role !== 'user') messages.shift();

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  const key = process.env.GEMINI_API_KEY;

  let reply: string | null = null;
  let source: 'ai' | 'quick' = 'quick';
  if (key && !tooMany(ip)) {
    reply = await askGemini(key, lang, messages);
    if (reply) source = 'ai';
  }
  if (!reply) reply = quickAnswer(last.text, lang);

  await logQuestion({
    time: new Date().toISOString(),
    lang,
    page: String(body.page ?? '').slice(0, 120),
    question: last.text,
    answer: reply,
    source,
  });

  return json({ reply, source });
}
