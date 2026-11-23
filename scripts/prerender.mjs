// Build step 3 of 3: put the fully rendered page into dist/index.html.
//
// The site is a React app, so without this the HTML that search engines and
// link-preview bots download has an empty <div id="root">. Here we render the
// app once at build time (using the SSR bundle from `vite build --ssr`) and
// inject the HTML, the services list and the FAQPage structured data.
// The browser still mounts the app normally with createRoot (src/main.tsx).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'dist', 'index.html');
const ssrDir = path.join(root, 'dist-ssr');

const ssrEntry = fs
  .readdirSync(ssrDir)
  .find((f) => /^entry-server\.(m?js)$/.test(f));
if (!ssrEntry) throw new Error('prerender: SSR bundle not found in dist-ssr/');

const { render, SERVICES_LIST, FAQ_LIST } = await import(
  pathToFileURL(path.join(ssrDir, ssrEntry)).href
);

let html = fs.readFileSync(htmlPath, 'utf8');

const appHtml = render();
if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

const services = SERVICES_LIST.map((s) => ({
  '@type': 'MedicalProcedure',
  name: s.title,
  description: s.subtitle,
}));
if (!html.includes('__SERVICES_JSON__')) {
  throw new Error('prerender: __SERVICES_JSON__ placeholder missing');
}
html = html.replace('__SERVICES_JSON__', JSON.stringify(services));

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_LIST.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};
html = html.replace(
  '</head>',
  `  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n</head>`
);

fs.writeFileSync(htmlPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: injected ${appHtml.length} chars of HTML into dist/index.html`);
