/**
 * POST /api/chat: the website chat bot.
 *
 * Body: { lang: 'ar' | 'en', page: string, messages: [{ role: 'user' | 'bot', text }] }
 * Reply: { reply: string, source: 'ai' | 'quick' }
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   GEMINI_API_KEY     free key from Google AI Studio. Without it the bot uses quick answers only.
 *   GEMINI_MODEL       optional, default "gemini-flash-latest".
 *   QUESTIONS_SHEET_URL optional, Google Apps Script web app URL; every question is logged there
 *                       (see docs/chatbot-questions-sheet.gs).
 */
import { quickAnswer, systemPrompt } from './_knowledge';

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

async function askGemini(key: string, lang: 'ar' | 'en', messages: Msg[]): Promise<string | null> {
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(lang) }] },
        contents: messages.map((m) => ({ role: m.role === 'bot' ? 'model' : 'user', parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
      }),
    });
    if (!res.ok) {
      console.error('gemini error', res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();
    return text || null;
  } catch (err) {
    console.error('gemini failed', String(err));
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
