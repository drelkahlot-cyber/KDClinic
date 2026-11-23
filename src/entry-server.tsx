import { renderToString } from 'react-dom/server';
import App from './App';
import { CLINIC_INFO, SERVICES_LIST, FAQ_LIST } from './data/clinicData';

/**
 * Build-time render of the whole page to static HTML.
 * scripts/prerender.mjs injects the result into dist/index.html so search
 * engines and link-preview bots see the real content without running JS.
 */
export function render(): string {
  return renderToString(<App />);
}

export { CLINIC_INFO, SERVICES_LIST, FAQ_LIST };
