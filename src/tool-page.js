import { inject } from '@vercel/analytics';
inject();

// One entry per tool page. Add a line here when a new tool page is added
// to scripts/generate-pages.js.
const LOADERS = {
  'bg-remover': () => import('./tools/bgRemover.js').then((m) => m.renderBgRemover),
  'image-compress': () => import('./tools/imageCompress.js').then((m) => m.renderImageCompress),
  'text-extractor': () => import('./tools/textExtractor.js').then((m) => m.renderTextExtractor),
};

const root = document.getElementById('tool-root');
const load = root && LOADERS[root.dataset.tool];

if (load) {
  load()
    .then((render) => render(root, () => { window.location.href = '/'; }))
    .catch((err) => {
      console.error(err);
      root.innerHTML = '<p>This tool could not be loaded. Please refresh the page.</p>';
    });
}
