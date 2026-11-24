// Build step 3 of 3: write the fully rendered pages.
//
// The site is a React app, so without this the HTML that search engines and
// link-preview bots download has an empty <div id="root">. Here we render the
// app at build time (using the SSR bundle from `vite build --ssr`) for each
// language, inject the HTML, the services list and the FAQPage structured data,
// and write:
//   dist/index.html     Arabic page (/)
//   dist/en/index.html  English page (/en/)
// The browser still mounts the app normally with createRoot (src/main.tsx).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SITE = 'https://www.kahlotdental.com';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const htmlPath = path.join(distDir, 'index.html');
const ssrDir = path.join(root, 'dist-ssr');

const ssrEntry = fs.readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!ssrEntry) throw new Error('prerender: SSR bundle not found in dist-ssr/');

const { render, SERVICES_LIST, FAQ_LIST, SERVICE_PAGES, translate } = await import(
  pathToFileURL(path.join(ssrDir, ssrEntry)).href
);

const template = fs.readFileSync(htmlPath, 'utf8');
for (const marker of ['<div id="root"></div>', '__SERVICES_JSON__', '</head>']) {
  if (!template.includes(marker)) throw new Error(`prerender: ${marker} missing in dist/index.html`);
}

const hreflang = [
  `<link rel="alternate" hreflang="ar" href="${SITE}/" />`,
  `<link rel="alternate" hreflang="en" href="${SITE}/en/" />`,
  `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
].join('\n  ');

function buildPage(lang) {
  const t = (s) => translate(lang, s);
  let html = template;

  html = html.replace('<div id="root"></div>', `<div id="root">${render(lang)}</div>`);

  const services = SERVICES_LIST.map((s) => ({
    '@type': 'MedicalProcedure',
    name: t(s.title),
    description: t(s.subtitle),
  }));
  html = html.replace('__SERVICES_JSON__', JSON.stringify(services));

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: FAQ_LIST.map((f) => ({
      '@type': 'Question',
      name: t(f.question),
      acceptedAnswer: { '@type': 'Answer', text: t(f.answer) },
    })),
  };
  html = html.replace(
    '</head>',
    `  ${hreflang}\n  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n</head>`
  );

  if (lang === 'en') html = toEnglishHead(html);
  return html;
}

const escAttr = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// One Arabic landing page per service at /services/<slug>/. Own title,
// description, canonical and social cards, plus FAQPage and BreadcrumbList
// structured data built from src/data/servicePages.ts.
function buildServicePage(p) {
  const url = `${SITE}/services/${p.slug}/`;
  let html = template;
  html = html.replace('<div id="root"></div>', `<div id="root">${render('ar', p.slug)}</div>`);
  const services = SERVICES_LIST.map((s) => ({ '@type': 'MedicalProcedure', name: s.title, description: s.subtitle }));
  html = html.replace('__SERVICES_JSON__', JSON.stringify(services));

  const set = (re, value) => {
    if (!re.test(html)) throw new Error(`prerender(${p.slug}): head tag not found: ${re}`);
    html = html.replace(re, (m, before) => `${before}${escAttr(value)}"`);
  };
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escAttr(p.metaTitle)}</title>`);
  set(/(<meta name="description"\s+content=")[^"]*"/, p.metaDescription);
  set(/(<link rel="canonical" href=")[^"]*"/, url);
  set(/(<meta property="og:url" content=")[^"]*"/, url);
  set(/(<meta property="og:title" content=")[^"]*"/, p.metaTitle);
  set(/(<meta property="og:description"\s+content=")[^"]*"/, p.metaDescription);
  set(/(<meta name="twitter:title" content=")[^"]*"/, p.metaTitle);
  set(/(<meta name="twitter:description"\s+content=")[^"]*"/, p.metaDescription);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'ar',
    mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const crumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'عيادة الكحلوت للأسنان', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: p.h1, item: url },
    ],
  };
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n  <script type="application/ld+json">${JSON.stringify(crumbsLd)}</script>\n</head>`
  );
  return html;
}

// Swap the Arabic <head> (title, description, social cards, canonical) for
// English and make the document left-to-right.
function toEnglishHead(html) {
  const title =
    'El Kahlot Dental Clinic, Gesr El Suez, Cairo | Dr. Abdelrahman El Kahlot - Dental Implants & Cosmetic Dentistry';
  const desc =
    'El Kahlot Dental Clinic (KDC) in Gesr El Suez, Cairo, next to Haykestep Metro. Dr. Abdelrahman El Kahlot, specialist in oral surgery, dental implants and cosmetic dentistry (Hollywood smile, zirconia, veneers), root canal treatment, orthodontics and children\'s dentistry. All major medical insurance accepted.';
  const replaceAttr = (re, value) => {
    if (!re.test(html)) throw new Error(`prerender(en): head tag not found: ${re}`);
    html = html.replace(re, (m, before) => `${before}${value}"`);
  };
  html = html.replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  replaceAttr(/(<meta name="description"\s+content=")[^"]*"/, desc);
  replaceAttr(/(<meta name="keywords"\s+content=")[^"]*"/,
    'dentist Cairo, dental clinic Gesr El Suez, dental implants Cairo, Hollywood smile Egypt, cosmetic dentist Cairo, root canal Cairo, El Kahlot Dental Clinic, KDC Dental');
  replaceAttr(/(<link rel="canonical" href=")[^"]*"/, `${SITE}/en/`);
  replaceAttr(/(<meta property="og:url" content=")[^"]*"/, `${SITE}/en/`);
  replaceAttr(/(<meta property="og:locale" content=")[^"]*"/, 'en_US');
  replaceAttr(/(<meta property="og:title" content=")[^"]*"/, 'El Kahlot Dental Clinic | Dr. Abdelrahman El Kahlot - KDC');
  replaceAttr(/(<meta property="og:description"\s+content=")[^"]*"/, desc);
  replaceAttr(/(<meta name="twitter:title" content=")[^"]*"/, 'El Kahlot Dental Clinic | Dr. Abdelrahman El Kahlot - KDC');
  replaceAttr(/(<meta name="twitter:description"\s+content=")[^"]*"/, desc);
  return html;
}

const arHtml = buildPage('ar');
const enHtml = buildPage('en');

// Guard: every visible string on the English page must be translated. Arabic
// is allowed only in the language switch ("عربي") and in data that stays
// Arabic on purpose (structured-data address, WhatsApp default message URL).
const enBody = enHtml.split('<div id="root">')[1].split('</body>')[0]
  .replace(/<script[\s\S]*?<\/script>/g, '')
  // Patient reviews are quoted in their original Arabic on purpose.
  .replace(/<blockquote[^>]*lang="ar"[\s\S]*?<\/blockquote>/g, '')
  .replace(/href="[^"]*"/g, '');
const leftovers = [...new Set(enBody.match(/[^<>"]*[؀-ۿ][^<>"]*/g) || [])]
  .map((s) => s.trim())
  .filter((s) => s && s !== 'عربي' && s !== 'عرض الصفحة بالعربية');
if (leftovers.length) {
  throw new Error(`prerender(en): untranslated Arabic text, add it to src/i18n-en.ts:\n- ${leftovers.join('\n- ')}`);
}

fs.writeFileSync(htmlPath, arHtml);
fs.mkdirSync(path.join(distDir, 'en'), { recursive: true });
fs.writeFileSync(path.join(distDir, 'en', 'index.html'), enHtml);
for (const p of SERVICE_PAGES) {
  const dir = path.join(distDir, 'services', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildServicePage(p));
}
console.log(`prerender: wrote ${SERVICE_PAGES.length} service pages under dist/services/`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log('prerender: wrote dist/index.html (ar) and dist/en/index.html (en)');
