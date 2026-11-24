import { createContext, useCallback, useContext } from 'react';
import { EN } from './i18n-en';

/**
 * Two-language support. The Arabic text in the components is the source; the
 * English page (/en/) looks each string up in src/i18n-en.ts. A string with no
 * English entry falls back to Arabic, and the build fails on it
 * (scripts/prerender.mjs checks the English page for Arabic text).
 */
export type Lang = 'ar' | 'en';

const LangContext = createContext<Lang>('ar');

export const LangProvider = LangContext.Provider;

export function useLang(): Lang {
  return useContext(LangContext);
}

export function translate(lang: Lang, text: string): string {
  if (lang === 'ar') return text;
  return EN[text] ?? text;
}

export function useT(): (text: string) => string {
  const lang = useLang();
  return useCallback((text: string) => translate(lang, text), [lang]);
}

/** Path of the page in the other language, used by the language switch. */
export function otherLangHref(lang: Lang): string {
  return lang === 'ar' ? '/en/' : '/';
}

/** Detects the page language from the URL in the browser. */
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ar';
}
