// Generates one real, static HTML page per tool, plus public/sitemap.xml.
// Runs automatically before `npm run dev` and `npm run build` (see package.json).
//
// To change a tool page:
//   - page text  -> edit content/<slug>.html
//   - title/meta -> edit the TOOLS list below
// Do NOT edit the generated <slug>.html files in the project root by hand.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://freedoctools.online';
const ADSENSE_CLIENT = 'ca-pub-2559829612823624';

// Only tools listed here get a static page. Add the next tool here when its file is updated.
const TOOLS = [
  {
    slug: 'bg-remover',
    name: 'Background Remover',
    blurb: 'Remove the background from a photo with an in-browser AI model, then keep it transparent or pick a new one.',
    title: 'Free Background Remover – Remove Image Background Online | FreeDocTools',
    description:
      'Remove the background from a photo for free. Keep it transparent or switch to white, passport blue or a studio colour. Runs in your browser, no signup.',
    h1: 'Free Background Remover',
    intro:
      'Upload a photo and an AI model running in your browser cuts out the subject. Then keep it transparent or choose a new background. Your photo is not uploaded.',
  },
  {
    slug: 'image-compress',
    name: 'Compress Image',
    blurb: 'Reduce a photo to an exact size such as 20KB, 50KB or 100KB for forms and portals.',
    title: 'Compress Image to 20KB, 50KB, 100KB – Free Online | FreeDocTools',
    description:
      'Compress a JPG or PNG photo to an exact size like 20KB, 50KB or 100KB for exam and job forms. Free, no signup, and your photo never leaves your device.',
    h1: 'Compress Image to Exact KB Size',
    intro:
      'Pick a target size, upload your photo and get a sharp JPG that fits the form limit. Everything runs in your browser, so your photo is never uploaded.',
  },
  {
    slug: 'text-extractor',
    name: 'Extract Text (OCR)',
    blurb: 'Turn a photo or screenshot of printed text into editable text in English, Hindi and 18 other languages.',
    title: 'Image to Text Converter (OCR) – English, Hindi & More | FreeDocTools',
    description:
      'Extract text from a photo, scan or screenshot for free. OCR supports English, Hindi and 18 other languages and runs in your browser, with no signup.',
    h1: 'Image to Text Converter (OCR)',
    intro:
      'Choose the language of the text, upload an image and copy the extracted text. The image is processed in your browser and is not uploaded.',
  },
];

// Pages written from content/pages/<slug>.html. {{TOOLS_LIST}} inside them becomes a list of tool links.
const PAGES = [
  {
    slug: 'about',
    name: 'About Us',
    title: 'About FreeDocTools – Free Image & PDF Tools in Your Browser',
    description:
      'FreeDocTools offers free image and PDF tools that run in your browser. Learn who builds it, how it works and how it is paid for.',
    h1: 'About FreeDocTools',
  },
  {
    slug: 'privacy-policy',
    name: 'Privacy Policy',
    title: 'Privacy Policy | FreeDocTools',
    description:
      'How FreeDocTools handles your files, analytics, cookies and Google AdSense advertising. Your files are processed in your browser and are not uploaded.',
    h1: 'Privacy Policy',
  },
  {
    slug: 'terms',
    name: 'Terms & Conditions',
    title: 'Terms and Conditions | FreeDocTools',
    description: 'The terms for using the free tools and content on FreeDocTools.',
    h1: 'Terms and Conditions',
  },
  {
    slug: 'security',
    name: 'Security',
    title: 'Security and Data Handling | FreeDocTools',
    description:
      'What runs in your browser, what is downloaded, and what you can do to keep your documents safe when using FreeDocTools.',
    h1: 'Security and Data Handling',
  },
  {
    slug: 'contact',
    name: 'Contact',
    title: 'Contact FreeDocTools – Help and Feedback',
    description: 'Get help with a tool, report a bug or send feedback to the FreeDocTools team.',
    h1: 'Contact and Help',
  },
];

// Pages that already exist as hand-written files in the project root.
const HAND_WRITTEN = [['/how-to-use', 'How to Use']];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const STYLE = `
  .article { color: #334155; font-size: 1rem; line-height: 1.75; }
  .article h2 { color: #0f172a; font-size: 1.6rem; font-weight: 900; margin: 2.2rem 0 .8rem; line-height: 1.25; }
  .article h3 { color: #0f172a; font-size: 1.15rem; font-weight: 800; margin: 1.4rem 0 .5rem; }
  .article p { margin: .75rem 0; }
  .article ul { list-style: disc; padding-left: 1.4rem; margin: .75rem 0; }
  .article ol { list-style: decimal; padding-left: 1.4rem; margin: .75rem 0; }
  .article li { margin: .35rem 0; }
  .article a { color: #e11d48; font-weight: 700; text-decoration: underline; }
  .article details { border: 1px solid #e2e8f0; border-radius: 1rem; padding: .75rem 1rem; margin: .6rem 0; }
  .article summary { cursor: pointer; font-weight: 800; color: #0f172a; }
  html.dark .article { color: #cbd5e1; }
  html.dark .article h2, html.dark .article h3, html.dark .article summary { color: #ffffff; }
  html.dark .article details { border-color: #334155; }
`;

const ALL_PAGE_LINKS = [['/about', 'About Us'], ...HAND_WRITTEN, ['/privacy-policy', 'Privacy Policy'], ['/terms', 'Terms & Conditions'], ['/security', 'Security'], ['/contact', 'Contact']];

function header() {
  return `
    <header class="sticky top-0 z-40 border-b border-rose-200/60 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <a href="/" class="flex items-center gap-2.5 text-xl font-black text-slate-900 dark:text-white">
          <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-lg text-white">⚡</span>
          <span>Free<span class="text-rose-600">DocTools</span></span>
        </a>
        <nav class="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300" aria-label="Main">
          <a href="/" class="hover:text-rose-600">All Tools</a>
          <a href="/about" class="hidden hover:text-rose-600 sm:inline">About</a>
          <a href="/contact" class="hidden hover:text-rose-600 sm:inline">Contact</a>
          <button id="theme-toggle" type="button" aria-label="Toggle dark mode" class="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-white text-lg dark:border-slate-700 dark:bg-slate-800">🌓</button>
        </nav>
      </div>
    </header>`;
}

function footer() {
  const toolLinks = TOOLS.map((t) => `<li><a href="/${t.slug}" class="hover:text-rose-600">${esc(t.name)}</a></li>`).join('');
  const pageLinks = ALL_PAGE_LINKS.map(([href, label]) => `<li><a href="${href}" class="hover:text-rose-600">${esc(label)}</a></li>`).join('');
  return `
    <footer class="mt-12 border-t border-rose-100 bg-white/80 py-10 dark:border-slate-800 dark:bg-slate-900/80">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:grid-cols-3">
        <div>
          <p class="text-base font-black text-slate-900 dark:text-white">FreeDocTools</p>
          <p class="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">Free image and PDF tools that run in your browser. Your files are not uploaded.</p>
        </div>
        <div>
          <p class="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Tools</p>
          <ul class="space-y-1.5">${toolLinks}<li><a href="/" class="hover:text-rose-600">All tools</a></li></ul>
        </div>
        <div>
          <p class="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Company</p>
          <ul class="space-y-1.5">${pageLinks}</ul>
        </div>
      </div>
      <p class="mt-8 text-center text-xs text-slate-400">© ${new Date().getFullYear()} FreeDocTools. All rights reserved.</p>
    </footer>`;
}

function toolPage(tool) {
  const isStatic = Boolean(tool.__static);
  let article = tool.__article;
  if (!isStatic) {
    const fragmentPath = resolve(ROOT, 'content', `${tool.slug}.html`);
    if (!existsSync(fragmentPath)) {
      throw new Error(`Missing content file: content/${tool.slug}.html (a tool page must not be published without real text)`);
    }
    article = readFileSync(fragmentPath, 'utf8');
  }
  const url = `${SITE}/${tool.slug}`;
  const others = isStatic ? [] : TOOLS.filter((t) => t.slug !== tool.slug);
  const related = others.length
    ? `<section class="mt-12"><h2 class="mb-3 text-xl font-black text-slate-900 dark:text-white">More free tools</h2><ul class="grid gap-2 sm:grid-cols-2">${others
        .map((t) => `<li><a class="font-bold text-rose-600 underline" href="/${t.slug}">${esc(t.name)}</a></li>`)
        .join('')}</ul></section>`
    : '';

  return `<!DOCTYPE html>
<!-- AUTO-GENERATED by scripts/generate-pages.js. Edit the file in content/ or the script, not this file. -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(tool.title)}</title>
    <meta name="description" content="${esc(tool.description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeDocTools" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(tool.title)}" />
    <meta property="og:description" content="${esc(tool.description)}" />
    <meta property="og:image" content="${SITE}/icon-512.png" />
    <meta name="twitter:card" content="summary" />

    <link rel="icon" type="image/png" href="/icon-192.png" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#ffffff" />

    <script>try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}</script>

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { darkMode: 'class', theme: { extend: { fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] } } } }</script>
    <style>${STYLE}</style>
  </head>
  <body class="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    ${header()}

    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <nav class="mb-4 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
        <a href="/" class="hover:text-rose-600">Home</a> › <span>${esc(tool.name)}</span>
      </nav>

      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">${esc(tool.h1)}</h1>
      ${isStatic ? '' : `<p class="mb-6 mt-2 text-base font-medium text-slate-600 dark:text-slate-300">${esc(tool.intro)}</p>

      <section id="tool-root" data-tool="${tool.slug}" aria-label="${esc(tool.name)} tool">
        <noscript><p>Please enable JavaScript to use this tool.</p></noscript>
      </section>`}

      <article class="article ${isStatic ? 'mt-6' : 'mt-12'}">
${article}
      </article>
      ${related}
    </main>

    ${footer()}

    <script>document.getElementById('theme-toggle').addEventListener('click',function(){var d=document.documentElement.classList.toggle('dark');try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}});</script>
    ${isStatic ? '' : '<script type="module" src="/src/tool-page.js"></script>'}
  </body>
</html>
`;
}


function staticPage(page) {
  const fragmentPath = resolve(ROOT, 'content', 'pages', `${page.slug}.html`);
  if (!existsSync(fragmentPath)) throw new Error(`Missing content file: content/pages/${page.slug}.html`);
  const toolsList = `<ul>${TOOLS.map((t) => `<li><a href="/${t.slug}">${esc(t.name)}</a>: ${esc(t.blurb)}</li>`).join('')}</ul>`;
  const article = readFileSync(fragmentPath, 'utf8').replace('{{TOOLS_LIST}}', toolsList);
  const url = `${SITE}/${page.slug}`;
  const html = toolPage({ ...page, intro: '', name: page.name, __static: true, __article: article, __url: url });
  return html;
}

function sitemap() {
  const urls = ['/', ...TOOLS.map((t) => `/${t.slug}`), ...ALL_PAGE_LINKS.map(([href]) => href)];
  const body = urls.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

for (const tool of TOOLS) {
  writeFileSync(resolve(ROOT, `${tool.slug}.html`), toolPage(tool));
}
for (const page of PAGES) {
  writeFileSync(resolve(ROOT, `${page.slug}.html`), staticPage(page));
}
writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), sitemap());
console.log(`Generated ${TOOLS.length} tool page(s), ${PAGES.length} info page(s) and public/sitemap.xml`);
