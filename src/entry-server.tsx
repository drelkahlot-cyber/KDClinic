import { renderToString } from 'react-dom/server';
import App from './App';
import { CLINIC_INFO, SERVICES_LIST, FAQ_LIST } from './data/clinicData';
import { translate, type Lang } from './i18n';

/**
 * Build-time render of the whole page to static HTML, once per language.
 * scripts/prerender.mjs injects the result into dist/index.html (Arabic) and
 * dist/en/index.html (English) so search engines and link-preview bots see the
 * real content without running JS.
 */
export function render(lang: Lang, servicePage?: string): string {
  return renderToString(<App lang={lang} servicePage={servicePage} />);
}

export { CLINIC_INFO, SERVICES_LIST, FAQ_LIST, translate };
export { SERVICE_PAGES, LANDING_PAGES } from './data/servicePages';
