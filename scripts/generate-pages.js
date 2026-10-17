// Generates every public page of the site as real, static HTML:
//   index.html (home), one page per tool, the info pages (about, privacy...), 404.html
// plus public/sitemap.xml.  Runs automatically before `npm run dev` and `npm run build`.
//
// To change text:  edit the file in content/ (tool text: content/<slug>.html,
// info pages: content/pages/<slug>.html, home text: content/pages/home.html).
// To change titles / descriptions / the tool list: edit the lists below.
// Do NOT edit the generated .html files in the project root by hand.

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
    title: 'Remove Image Background Free – Online | FreeDocTools',
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
    title: 'Compress Image to 20KB, 50KB, 100KB Free | FreeDocTools',
    description:
      'Compress a JPG or PNG photo to an exact size like 20KB, 50KB or 100KB for exam and job forms. Free, no signup, and your photo never leaves your device.',
    h1: 'Compress Image to Exact KB Size',
    intro:
      'Pick a target size, upload your photo and get a sharp JPG that fits the form limit. Everything runs in your browser, so your photo is never uploaded.',
  },
  {
    slug: 'image-resize',
    name: 'Resize Image',
    blurb: 'Crop and resize a photo to exact pixels, such as 350 x 450 for a passport photo or 300 x 120 for a signature.',
    title: 'Resize Photo to Exact Pixel Size – Free Online | FreeDocTools',
    description:
      'Resize a photo or signature to exact pixels such as 350x450 or 200x230. Crops to the right shape first so faces are not stretched. Free, runs in your browser.',
    h1: 'Resize Photo to Exact Pixel Size',
    intro:
      'Choose a preset or type your own width and height. The photo is cropped to the right shape and then resized, all in your browser.',
  },
  {
    slug: 'image-convert',
    name: 'Convert Image Format',
    blurb: 'Convert images between JPG, PNG and WEBP.',
    title: 'Free Image Converter: JPG, PNG, WEBP | FreeDocTools',
    description:
      'Convert an image between JPG, PNG and WEBP for free. Pick the format a form or app needs. Runs in your browser and your image is not uploaded.',
    h1: 'Convert Image to JPG, PNG or WEBP',
    intro:
      'Upload an image, choose the format you need and download the converted file. Everything happens in your browser.',
  },
  {
    slug: 'pdf-compress',
    name: 'Compress PDF',
    blurb: 'Make a PDF smaller with three levels, from a light clean-up to the smallest file.',
    title: 'Compress PDF Online – Reduce PDF File Size Free | FreeDocTools',
    description:
      'Reduce the size of a PDF with three levels. Works in your browser, no upload and no signup. Learn what each level does before you choose.',
    h1: 'Compress PDF Online',
    intro:
      'Choose a level, press the button and compare the new size with the original. Your PDF is processed in your browser and is not uploaded.',
  },
  {
    slug: 'pdf-merge',
    name: 'Merge PDFs',
    blurb: 'Combine several PDF files into one, in the order you choose.',
    title: 'Merge PDF Files Online – Combine PDFs Free | FreeDocTools',
    description:
      'Combine two or more PDF files into one document and set the order yourself. Free, no signup, and your files stay in your browser.',
    h1: 'Merge PDF Files',
    intro:
      'Add your PDFs, arrange them in the order you need and download one combined file. Your files are not uploaded.',
  },
  {
    slug: 'images-to-pdf',
    name: 'Images to PDF',
    blurb: 'Turn photos and scans into one A4 PDF, one image per page.',
    title: 'Images to PDF Converter – JPG, PNG to PDF | FreeDocTools',
    description:
      'Turn JPG, PNG or WEBP photos into one A4 PDF. Photos keep their shape, you set the page order, and nothing is uploaded. Free and no signup.',
    h1: 'Convert Images to PDF',
    intro:
      'Add your photos, put them in order and create one PDF. Each photo becomes a page and stays in proportion.',
  },
  {
    slug: 'pdf-splitter',
    name: 'Extract PDF Pages',
    blurb: 'Pick pages or ranges such as 1-3, 5 and save them as a new PDF.',
    title: 'Split PDF & Extract Pages Online – Free | FreeDocTools',
    description:
      'Extract the pages you need from a PDF, for example 1-3, 5, and save them as a new file. Free, no signup, and your PDF stays in your browser.',
    h1: 'Split PDF and Extract Pages',
    intro:
      'Upload a PDF, type the pages you want and download a new PDF with just those pages. Nothing is uploaded.',
  },
  {
    slug: 'text-extractor',
    name: 'Extract Text (OCR)',
    blurb: 'Turn a photo or screenshot of printed text into editable text in English, Hindi and 18 other languages.',
    title: 'Image to Text (OCR) in English & Hindi | FreeDocTools',
    description:
      'Extract text from a photo, scan or screenshot for free. OCR supports English, Hindi and 18 other languages and runs in your browser, with no signup.',
    h1: 'Image to Text Converter (OCR)',
    intro:
      'Choose the language of the text, upload an image and copy the extracted text. The image is processed in your browser and is not uploaded.',
  },
];


// Guides: articles in content/guides/<slug>.html. `tools` are shown at the end of each guide.
const GUIDES = [
  {
    slug: 'reduce-photo-size-to-20kb',
    name: 'Reduce Photo Size to 20KB, 50KB or 100KB',
    title: 'How to Reduce Photo Size to 20KB, 50KB or 100KB | FreeDocTools',
    description:
      'Step-by-step guide to bringing a photo or signature under a KB limit for online forms without making it blurry.',
    h1: 'How to Reduce Photo Size to 20KB, 50KB or 100KB',
    blurb: 'Why phone photos are so large, and how to shrink one to a form limit without ruining it.',
    tools: ['image-resize', 'image-compress'],
  },
  {
    slug: 'photo-signature-checklist-online-forms',
    name: 'Photo and Signature Checklist for Online Forms',
    title: 'Photo & Signature Checklist for Online Forms | FreeDocTools',
    description:
      'A practical checklist for preparing your photo, signature and documents so online form uploads are not rejected.',
    h1: 'Photo and Signature Checklist for Online Application Forms',
    blurb: 'What to check before you upload: format, size, pixels, background, file names and common rejection reasons.',
    tools: ['image-resize', 'image-compress', 'images-to-pdf', 'pdf-merge'],
  },
  {
    slug: 'jpg-vs-png-vs-webp',
    name: 'JPG vs PNG vs WEBP',
    title: 'JPG vs PNG vs WEBP: Which Image Format to Use | FreeDocTools',
    description:
      'The differences between JPG, PNG and WEBP in plain language, and which one to choose for photos, screenshots and online forms.',
    h1: 'JPG vs PNG vs WEBP: Which Image Format Should You Use?',
    blurb: 'Plain-language comparison of the three formats, with advice for online forms.',
    tools: ['image-convert', 'image-compress'],
  },
  {
    slug: 'merge-pdf-for-application',
    name: 'Merge PDFs for an Application',
    title: 'How to Merge PDFs for an Application Form | FreeDocTools',
    description:
      'How to combine documents into one PDF in the right order and keep it under the size limit, with a final checklist.',
    h1: 'How to Merge PDF Files for an Application',
    blurb: 'Turn photos into PDFs, merge them in order, drop extra pages and keep the file under the limit.',
    tools: ['images-to-pdf', 'pdf-merge', 'pdf-splitter', 'pdf-compress'],
  },
  {
    slug: 'passport-style-photo-at-home',
    name: 'Passport-Style Photo at Home',
    title: 'How to Make a Passport-Style Photo at Home | FreeDocTools',
    description:
      'Take a clean photo with a phone, fix the background, and crop and size it for an online form, using free tools.',
    h1: 'How to Make a Passport-Style Photo at Home',
    blurb: 'Light, background, pose, then background change, resize and compress for an upload.',
    tools: ['bg-remover', 'image-resize', 'image-compress', 'image-convert'],
  },
  {
    slug: 'scan-documents-with-phone',
    name: 'Scan Documents with Your Phone',
    title: 'How to Scan Documents with Your Phone | FreeDocTools',
    description:
      'Tips for clear phone scans that stay readable at a small file size, and how to turn them into one PDF.',
    h1: 'How to Scan Documents with Your Phone',
    blurb: 'Light, angle and settings for readable scans, then combine pages and reduce the size.',
    tools: ['images-to-pdf', 'pdf-splitter', 'pdf-compress', 'text-extractor'],
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
    slug: 'how-to-use',
    name: 'How to Use',
    title: 'How to Use FreeDocTools – Step-by-Step Guide',
    description:
      'Step-by-step guide to preparing photos, signatures and PDFs for online applications with the free tools on FreeDocTools.',
    h1: 'How to Use FreeDocTools',
  },
  {
    slug: 'guides',
    name: 'Guides',
    title: 'Guides for Photos, Signatures & PDFs | FreeDocTools',
    description:
      'Plain-language guides on preparing photos, signatures and PDFs for online forms: sizes, formats, scanning and common mistakes.',
    h1: 'Guides',
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
    description:
      'Terms for using FreeDocTools: your files, acceptable use, no guarantee that a portal will accept a file, and limits of liability.',
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
const HAND_WRITTEN = [];

// Look of the tool cards on the home page.
const HOME_META = {
  'bg-remover': { icon: '🖼️', badge: 'STUDIO', grad: ['#f43f5e', '#be185d'] },
  'image-compress': { icon: '🗜️', badge: 'POPULAR', grad: ['#ff4b72', '#e11d48'] },
  'image-resize': { icon: '📐', badge: 'UTILITY', grad: ['#f43f5e', '#ec4899'] },
  'image-convert': { icon: '🔄', badge: 'FAST', grad: ['#db2777', '#c026d3'] },
  'pdf-compress': { icon: '📑', badge: 'PDF', grad: ['#e11d48', '#9f1239'] },
  'pdf-merge': { icon: '📎', badge: 'PDF', grad: ['#fb7185', '#e11d48'] },
  'images-to-pdf': { icon: '📄', badge: 'CONVERT', grad: ['#ec4899', '#be185d'] },
  'pdf-splitter': { icon: '✂️', badge: 'PDF', grad: ['#f43f5e', '#b91c1c'] },
  'text-extractor': { icon: '📝', badge: 'OCR', grad: ['#ff4b72', '#e11d48'] },
};

const ALL_PAGE_LINKS = [
  ['/about', 'About Us'],
  ['/how-to-use', 'How to Use'],
  ['/guides', 'Guides'],
  ['/privacy-policy', 'Privacy Policy'],
  ['/terms', 'Terms & Conditions'],
  ['/security', 'Security'],
  ['/contact', 'Contact'],
];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const STYLE = `
  html:not(.dark) body { background: radial-gradient(circle at 15% 10%, #ffe4e6 0%, transparent 45%), radial-gradient(circle at 85% 20%, #fce7f3 0%, transparent 45%), #fffafa; color: #0f172a; }
  html.dark body { background: radial-gradient(circle at 50% 0%, #1a1122 0%, #0b0f19 100%); color: #f8fafc; }
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

// ---------- shared pieces ----------

function header({ search = false } = {}) {
  const searchRow = search
    ? `
      <div class="mx-auto max-w-6xl px-4 pb-3">
        <div class="relative">
          <label for="tool-search" class="sr-only">Search tools</label>
          <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
          <input id="tool-search" type="search" autocomplete="off" placeholder="Search tools..." class="w-full rounded-2xl border border-rose-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
        </div>
      </div>`
    : '';
  return `
    <header class="sticky top-0 z-40 border-b border-rose-200/60 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <a href="/" class="flex items-center gap-2.5 text-xl font-black text-slate-900 dark:text-white">
          <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-lg text-white">⚡</span>
          <span>Free<span class="text-rose-600">DocTools</span></span>
        </a>
        <nav class="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300" aria-label="Main">
          <a href="/" class="mr-2 hidden hover:text-rose-600 sm:inline">All Tools</a>
          <button id="theme-toggle" type="button" aria-label="Toggle dark mode" class="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-white text-lg dark:border-slate-700 dark:bg-slate-800">🌓</button>
          <button id="menu-open" type="button" aria-label="Open menu" aria-haspopup="dialog" class="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-white text-lg dark:border-slate-700 dark:bg-slate-800">☰</button>
        </nav>
      </div>${searchRow}
    </header>`;
}

function linkList(items, cls) {
  return items.map(([href, label]) => `<li><a href="${href}" class="${cls}">${esc(label)}</a></li>`).join('');
}

// Slide-in menu. Opening it adds "#menu" to the address, so the Back button
// returns to the open menu (handled in src/site.js).
function drawer() {
  const link = 'block py-1.5 text-lg font-bold text-slate-800 hover:text-rose-600 dark:text-slate-100 dark:hover:text-rose-400';
  const tools = TOOLS.map((t) => [`/${t.slug}`, t.name]);
  return `
    <div id="menu-overlay" class="fixed inset-0 z-50 hidden">
      <div id="menu-backdrop" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <aside id="menu-panel" role="dialog" aria-label="Menu" class="absolute right-0 top-0 h-full w-80 max-w-[85vw] translate-x-full overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-slate-900">
        <div class="mb-5 flex items-center justify-between">
          <p class="text-2xl font-black text-slate-900 dark:text-white">Menu</p>
          <button id="menu-close" type="button" aria-label="Close menu" class="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-lg text-rose-600 dark:bg-slate-800 dark:text-rose-400">✕</button>
        </div>
        <nav aria-label="Site menu">
          <p class="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Tools</p>
          <ul>
            <li><a href="/" class="${link}">All tools (Home)</a></li>
            ${linkList(tools, link)}
          </ul>
          <p class="mb-2 mt-7 text-xs font-black uppercase tracking-wider text-slate-400">Company</p>
          <ul>${linkList(ALL_PAGE_LINKS, link)}</ul>
        </nav>
        <div class="mt-9 border-t border-rose-100 pt-6 text-center dark:border-slate-800">
          <p class="mb-3 text-xs font-black uppercase tracking-widest text-rose-500">Developer</p>
          <div class="flex items-center justify-center gap-3">
            <a href="https://instagram.com/rocky_star474" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-lg dark:bg-slate-800">📷</a>
            <a href="https://wa.me/917877880925" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" class="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-lg dark:bg-slate-800">💬</a>
            <a href="mailto:radherockystar@gmail.com" aria-label="Email" class="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-lg dark:bg-slate-800">✉️</a>
          </div>
          <p class="mt-4 text-xs text-slate-400">Developed by <span class="font-bold text-rose-600 dark:text-rose-400">Rocky Star 474</span></p>
        </div>
      </aside>
    </div>`;
}

function footer() {
  const cls = 'hover:text-rose-600';
  const tools = TOOLS.map((t) => [`/${t.slug}`, t.name]);
  return `
    <footer class="mt-12 border-t border-rose-100 bg-white/80 py-10 dark:border-slate-800 dark:bg-slate-900/80">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:grid-cols-3">
        <div>
          <p class="text-base font-black text-slate-900 dark:text-white">FreeDocTools</p>
          <p class="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">Free image and PDF tools that run in your browser. Your files are not uploaded.</p>
        </div>
        <div>
          <p class="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Tools</p>
          <ul class="space-y-1.5">${linkList(tools, cls)}<li><a href="/" class="${cls}">All tools</a></li></ul>
        </div>
        <div>
          <p class="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Company</p>
          <ul class="space-y-1.5">${linkList(ALL_PAGE_LINKS, cls)}</ul>
        </div>
      </div>
      <p class="mt-8 text-center text-xs text-slate-400">© ${new Date().getFullYear()} FreeDocTools. All rights reserved.</p>
    </footer>`;
}

// The full HTML document. `main` is the page-specific content, `script` an optional extra module script.
function shell({ title, description, path, main, script = '', robots = 'index, follow', headerSearch = false }) {
  const url = `${SITE}${path}`;
  return `<!DOCTYPE html>
<!-- AUTO-GENERATED by scripts/generate-pages.js. Edit the files in content/ or the script, not this file. -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeDocTools" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
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
    ${header({ search: headerSearch })}
    ${drawer()}

${main}

    ${footer()}

    <script type="module" src="/src/site.js"></script>
    ${script}
  </body>
</html>
`;
}

function readFragment(relPath) {
  const p = resolve(ROOT, relPath);
  if (!existsSync(p)) throw new Error(`Missing content file: ${relPath} (a page must not be published without real text)`);
  return readFileSync(p, 'utf8');
}

// ---------- page types ----------

function toolPage(tool) {
  const article = readFragment(`content/${tool.slug}.html`);
  const others = TOOLS.filter((t) => t.slug !== tool.slug);
  const related = `<section class="mt-12"><h2 class="mb-3 text-xl font-black text-slate-900 dark:text-white">More free tools</h2><ul class="grid gap-2 sm:grid-cols-2">${others
    .map((t) => `<li><a class="font-bold text-rose-600 underline" href="/${t.slug}">${esc(t.name)}</a></li>`)
    .join('')}</ul></section>`;

  const main = `    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <nav class="mb-4 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
        <a href="/" class="hover:text-rose-600">Home</a> › <span>${esc(tool.name)}</span>
      </nav>

      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">${esc(tool.h1)}</h1>
      <p class="mb-6 mt-2 text-base font-medium text-slate-600 dark:text-slate-300">${esc(tool.intro)}</p>

      <section id="tool-root" data-tool="${tool.slug}" aria-label="${esc(tool.name)} tool">
        <noscript><p>Please enable JavaScript to use this tool.</p></noscript>
      </section>

      <article class="article mt-12">
${article}
      </article>
      ${related}
    </main>`;

  return shell({
    title: tool.title,
    description: tool.description,
    path: `/${tool.slug}`,
    main,
    script: '<script type="module" src="/src/tool-page.js"></script>',
  });
}

function staticPage(page) {
  const toolsList = `<ul>${TOOLS.map((t) => `<li><a href="/${t.slug}">${esc(t.name)}</a>: ${esc(t.blurb)}</li>`).join('')}</ul>`;
  const guidesList = `<ul>${GUIDES.map((g) => `<li><a href="/${g.slug}">${esc(g.name)}</a>: ${esc(g.blurb)}</li>`).join('')}</ul>`;
  const article = readFragment(`content/pages/${page.slug}.html`)
    .replace('{{TOOLS_LIST}}', toolsList)
    .replace('{{GUIDES_LIST}}', guidesList);

  const main = `    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <nav class="mb-4 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
        <a href="/" class="hover:text-rose-600">Home</a> › <span>${esc(page.name)}</span>
      </nav>
      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">${esc(page.h1)}</h1>
      <article class="article mt-6">
${article}
      </article>
    </main>`;

  return shell({ title: page.title, description: page.description, path: `/${page.slug}`, main });
}

function guidePage(guide) {
  const article = readFragment(`content/guides/${guide.slug}.html`);
  const toolLinks = guide.tools
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean)
    .map((t) => `<li><a class="font-bold text-rose-600 underline" href="/${t.slug}">${esc(t.name)}</a>: ${esc(t.blurb)}</li>`)
    .join('');
  const moreGuides = GUIDES.filter((g) => g.slug !== guide.slug)
    .map((g) => `<li><a class="font-bold text-rose-600 underline" href="/${g.slug}">${esc(g.name)}</a></li>`)
    .join('');

  const main = `    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <nav class="mb-4 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
        <a href="/" class="hover:text-rose-600">Home</a> › <a href="/guides" class="hover:text-rose-600">Guides</a> › <span>${esc(guide.name)}</span>
      </nav>
      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">${esc(guide.h1)}</h1>
      <article class="article mt-6">
${article}
      </article>
      <section class="mt-10 rounded-3xl border border-rose-100 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/70">
        <h2 class="mb-3 text-lg font-black text-slate-900 dark:text-white">Free tools for this guide</h2>
        <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300">${toolLinks}</ul>
      </section>
      <section class="mt-8">
        <h2 class="mb-3 text-lg font-black text-slate-900 dark:text-white">More guides</h2>
        <ul class="space-y-1.5 text-sm">${moreGuides}</ul>
      </section>
    </main>`;

  return shell({ title: guide.title, description: guide.description, path: `/${guide.slug}`, main });
}

function homePage() {
  const article = readFragment('content/pages/home.html');
  const cards = TOOLS.map((t) => {
    const m = HOME_META[t.slug] || { icon: '🛠️', badge: 'TOOL', grad: ['#f43f5e', '#be185d'] };
    return `
        <a href="/${t.slug}" data-tool-card data-search="${esc((t.name + ' ' + t.blurb).toLowerCase())}" class="group flex flex-col justify-between rounded-3xl border border-rose-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 sm:p-6 hover:border-rose-400 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/70">
          <div>
            <div class="mb-4 flex items-center justify-between">
              <span class="flex h-12 w-12 items-center justify-center rounded-2xl text-xl sm:h-14 sm:w-14 sm:text-2xl text-white transition-transform group-hover:scale-110" style="background: linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]}); box-shadow: 0 12px 26px -6px ${m.grad[0]}88;">${m.icon}</span>
              <span class="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">${m.badge}</span>
            </div>
            <h2 class="mb-1.5 text-lg font-black tracking-tight text-slate-900 group-hover:text-rose-600 dark:text-white">${esc(t.name)}</h2>
            <p class="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">${esc(t.blurb)}</p>
          </div>
          <div class="mt-4 flex items-center justify-between border-t border-rose-100 pt-3 text-xs font-extrabold text-rose-600 dark:border-slate-700 dark:text-rose-400">
            <span>Use tool</span><span class="text-base transition-transform group-hover:translate-x-1">→</span>
          </div>
        </a>`;
  }).join('');

  const trust = [
    ['🔒', 'Files stay on your device', 'Photos and PDFs are processed in your browser. They are not uploaded to our servers.'],
    ['⚡', 'Free, no signup', 'Open a tool, choose a setting and download. No account and no software to install.'],
    ['📱', 'Made for online forms', 'Presets for common photo and signature sizes, plus clear notes on each tool page about limits.'],
  ]
    .map(
      ([icon, h, p]) => `
        <div class="rounded-3xl border border-rose-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <div class="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl dark:bg-slate-700">${icon}</div>
          <h3 class="text-base font-black text-slate-900 dark:text-white">${h}</h3>
          <p class="mt-1.5 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">${p}</p>
        </div>`
    )
    .join('');

  const main = `    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
      <section class="mx-auto mb-8 max-w-2xl text-center">
        <p class="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-black text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-300">
          <span class="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Free · Private · Runs in your browser
        </p>
        <h1 class="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Free Image &amp; PDF Tools <span class="bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 bg-clip-text text-transparent">for Online Forms</span>
        </h1>
        <p class="mx-auto mt-3.5 max-w-xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          Compress photos to an exact size, resize to exact pixels, remove backgrounds, merge and shrink PDFs, and copy text from images. No signup, and your files are not uploaded.
        </p>
      </section>

      <section id="tools-grid" aria-label="All tools" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${cards}
      </section>
      <p id="no-tools" class="mt-8 hidden text-center text-sm font-bold text-slate-500">No tool matches your search.</p>

      <section class="mt-14 grid grid-cols-1 gap-5 border-t border-rose-200/60 pt-12 dark:border-slate-800 md:grid-cols-3">${trust}
      </section>

      <section class="mt-14" aria-label="Guides">
        <div class="mb-4 flex items-end justify-between">
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Guides</h2>
          <a href="/guides" class="text-sm font-bold text-rose-600">All guides →</a>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">${GUIDES.map(
          (g) => `
          <a href="/${g.slug}" class="rounded-2xl border border-rose-100 bg-white p-5 transition hover:border-rose-400 dark:border-slate-700 dark:bg-slate-800/70">
            <h3 class="text-base font-black text-slate-900 dark:text-white">${esc(g.name)}</h3>
            <p class="mt-1.5 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">${esc(g.blurb)}</p>
          </a>`
        ).join('')}
        </div>
      </section>

      <article class="article mx-auto mt-14 max-w-3xl">
${article}
      </article>
    </main>`;

  return shell({
    title: 'FreeDocTools – Free Image & PDF Tools for Online Forms',
    description:
      'Compress photos to exact KB, resize to exact pixels, remove backgrounds, merge and compress PDFs, and extract text. Free, no signup, files stay in your browser.',
    path: '/',
    main,
    headerSearch: true,
  });
}

function notFoundPage() {
  const main = `    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center">
      <p class="text-6xl font-black text-rose-600">404</p>
      <h1 class="mt-3 text-3xl font-black text-slate-900 dark:text-white">Page not found</h1>
      <p class="mt-3 text-slate-600 dark:text-slate-300">The page you opened does not exist or has moved. Try one of the tools below.</p>
      <ul class="mt-6 flex flex-wrap justify-center gap-3">${TOOLS.map(
        (t) => `<li><a href="/${t.slug}" class="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-600 hover:border-rose-400 dark:border-slate-700 dark:bg-slate-800">${esc(t.name)}</a></li>`
      ).join('')}</ul>
      <p class="mt-8"><a href="/" class="font-bold text-rose-600 underline">Go to the home page</a></p>
    </main>`;
  return shell({ title: 'Page not found | FreeDocTools', description: 'This page could not be found.', path: '/404', main, robots: 'noindex, follow' });
}

function sitemap() {
  const urls = ['/', ...TOOLS.map((t) => `/${t.slug}`), ...ALL_PAGE_LINKS.map(([href]) => href), ...GUIDES.map((g) => `/${g.slug}`)];
  const body = urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ---------- write everything ----------

writeFileSync(resolve(ROOT, 'index.html'), homePage());
writeFileSync(resolve(ROOT, '404.html'), notFoundPage());
for (const tool of TOOLS) writeFileSync(resolve(ROOT, `${tool.slug}.html`), toolPage(tool));
for (const page of PAGES) writeFileSync(resolve(ROOT, `${page.slug}.html`), staticPage(page));
for (const guide of GUIDES) writeFileSync(resolve(ROOT, `${guide.slug}.html`), guidePage(guide));
writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), sitemap());
console.log(`Generated home, 404, ${TOOLS.length} tool page(s), ${GUIDES.length} guide(s), ${PAGES.length} info page(s) and public/sitemap.xml`);
