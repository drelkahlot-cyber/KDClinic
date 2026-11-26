import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import type { Lang } from '../i18n';

/**
 * Floating chat bot (bottom corner of every page). Talks to /api/chat.
 * Mounted from main.tsx in the browser only, so it is not part of the
 * prerendered HTML and does not touch the page content Google indexes.
 */

interface Msg { role: 'user' | 'bot'; text: string }

const TEXT = {
  ar: {
    open: 'اسأل العيادة',
    title: 'مساعد عيادة الكحلوت',
    subtitle: 'بيرد على طول على أسئلتك',
    hello: 'أهلًا بيك 👋 أنا مساعد عيادة الكحلوت للأسنان. اسألني عن المواعيد أو العنوان أو التأمين أو الخدمات.',
    chips: ['مواعيدكم إمتى؟', 'العيادة فين؟', 'بتقبلوا تأمين ونقابات؟', 'عايز أحجز'],
    placeholder: 'اكتب سؤالك...',
    send: 'إرسال',
    close: 'قفل',
    wa: 'كمّل على واتساب',
    waText: 'أهلًا، كنت بسأل في شات الموقع وعايز أكمل هنا',
    note: 'ردود آلية للمعلومات العامة، مش تشخيص طبي. الأسئلة بتتحفظ عشان نحسّن الخدمة، فما تكتبش بيانات شخصية.',
    error: `حصلت مشكلة. ابعتلنا على واتساب ${CLINIC_INFO.phoneWhatsapp}.`,
    typing: 'بيكتب...',
  },
  en: {
    open: 'Ask the clinic',
    title: 'Elkahlot Clinic Assistant',
    subtitle: 'Instant answers to your questions',
    hello: "Hi 👋 I'm the assistant of Elkahlot Dental Clinic. Ask me about our hours, location, insurance or services.",
    chips: ['What are your hours?', 'Where is the clinic?', 'Do you accept insurance?', 'I want to book'],
    placeholder: 'Type your question...',
    send: 'Send',
    close: 'Close',
    wa: 'Continue on WhatsApp',
    waText: 'Hi, I was asking on the website chat and would like to continue here',
    note: 'Automatic replies for general information, not medical advice. Questions are saved to improve our service, so please don\'t share personal details.',
    error: `Something went wrong. Please message us on WhatsApp ${CLINIC_INFO.phoneWhatsapp}.`,
    typing: 'Typing...',
  },
} as const;

const URL_RE = /(https?:\/\/[^\s]+)/g;

function Linkified({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="underline break-all">
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function ChatWidget({ lang }: { lang: Lang }) {
  const t = TEXT[lang];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: 'bot', text: t.hello }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: 'user', text: q.slice(0, 500) }];
    setMessages(next);
    setInput('');
    setBusy(true);
    window.gtag?.('event', 'chat_question', { page_path: window.location.pathname });
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // The greeting is not sent; the conversation starts with the visitor.
        body: JSON.stringify({ lang, page: window.location.pathname, messages: next.slice(1) }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages([...next, { role: 'bot', text: data.reply || t.error }]);
    } catch {
      setMessages([...next, { role: 'bot', text: t.error }]);
    } finally {
      setBusy(false);
    }
  }

  const waUrl = `https://wa.me/${CLINIC_INFO.phoneWhatsappIntl}?text=${encodeURIComponent(t.waText)}`;
  const asked = messages.some((m) => m.role === 'user');

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} className="kdc-chat">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-50 end-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 flex items-center gap-2 rounded-full bg-[var(--brand)] text-[var(--brand-ink)] ps-4 pe-5 py-3 font-extrabold text-sm shadow-2xl hover:bg-[var(--brand-hover)] transition-colors"
          aria-label={t.open}
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span>{t.open}</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={t.title}
          className="fixed z-50 inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:inset-x-auto md:end-6 md:bottom-6 md:w-[380px] h-[min(560px,calc(100dvh-7.5rem))] md:h-[min(600px,calc(100dvh-3rem))] flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[var(--brand)] text-[var(--brand-ink)]">
            <div className="min-w-0">
              <p className="font-extrabold text-sm truncate">{t.title}</p>
              <p className="text-xs opacity-80 truncate">{t.subtitle}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="p-1.5 rounded-lg hover:bg-white/15">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-[var(--bg)]">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <p
                  className={
                    'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ' +
                    (m.role === 'user'
                      ? 'bg-[var(--brand)] text-[var(--brand-ink)]'
                      : 'bg-[var(--surface)] border border-[var(--line)]')
                  }
                >
                  <Linkified text={m.text} />
                </p>
              </div>
            ))}
            {busy && <p className="text-xs text-[var(--muted)] px-1">{t.typing}</p>}
            {!asked && (
              <div className="flex flex-wrap gap-2 pt-1">
                {t.chips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => ask(c)}
                    className="rounded-full border border-[var(--brand)] text-[var(--brand)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--brand)] hover:text-[var(--brand-ink)] transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[var(--line)] bg-[var(--surface)] px-3 pt-2 pb-3 space-y-2">
            {asked && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--wa)] hover:bg-[var(--wa-hover)] text-white py-2 text-xs font-extrabold"
              >
                <MessageCircle className="w-4 h-4" />
                {t.wa}
              </a>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder={t.placeholder}
                className="flex-1 min-w-0 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-base md:text-sm outline-none focus:border-[var(--brand)]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t.send}
                className="shrink-0 rounded-xl bg-[var(--brand)] text-[var(--brand-ink)] p-2.5 disabled:opacity-40"
              >
                <Send className={'w-5 h-5' + (lang === 'ar' ? ' -scale-x-100' : '')} />
              </button>
            </form>
            <p className="text-[10px] leading-snug text-[var(--muted)]">{t.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
