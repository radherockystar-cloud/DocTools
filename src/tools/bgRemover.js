// Uses @imgly/background-removal — a real, high-quality, fully client-side AI
// background removal model (runs in-browser via WASM/ONNX). No photo ever
// leaves the device; only the (public, one-time-cached) AI model files are
// fetched from a CDN the first time the tool is used.
//
// Install once in your project:  npm install @imgly/background-removal

import { createDropzone } from '../components/Dropzone.js';

const TEMPLATES = [
  { id: 'transparent', label: 'Transparent', type: 'transparent' },
  { id: 'white', label: 'White', type: 'color', value: '#ffffff' },
  { id: 'studio', label: 'Studio Grey', type: 'gradient', stops: ['#e2e8f0', '#94a3b8'] },
  { id: 'sky', label: 'Sky Blue', type: 'gradient', stops: ['#60a5fa', '#1d4ed8'] },
  { id: 'sunset', label: 'Sunset', type: 'gradient', stops: ['#fb923c', '#ec4899'] },
  { id: 'corporate', label: 'Corporate Navy', type: 'gradient', stops: ['#1e293b', '#0f172a'] },
  { id: 'nature', label: 'Nature Green', type: 'gradient', stops: ['#4ade80', '#15803d'] },
  { id: 'royal', label: 'Royal Purple', type: 'gradient', stops: ['#a78bfa', '#6d28d9'] },
  { id: 'festive', label: 'Festive Gold', type: 'gradient', stops: ['#f43f5e', '#f59e0b'] },
  { id: 'passport-blue', label: 'Passport Blue', type: 'color', value: '#2563eb' },
  { id: 'passport-red', label: 'Passport Red', type: 'color', value: '#dc2626' },
  { id: 'pastel', label: 'Soft Pastel', type: 'gradient', stops: ['#fbcfe8', '#c7d2fe'] }
];

export function renderBgRemover(container, onBack) {
  let originalFile = null;
  let originalImg = null;
  let processedCanvas = null; // subject with transparent bg, ready to composite
  let selectedBg = { type: 'transparent' };
  let customBgImg = null;

  renderUploadView();

  function renderUploadView() {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8 w-full">
        <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">← Back to All Tools</button>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div class="flex items-center gap-4 mb-2">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center text-2xl shadow-md">🖼️</div>
            <div>
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">AI Background Remover</h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Erase any background automatically, then keep it transparent or drop in a new one.</p>
            </div>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3 mb-5">Upload a photo, click "Remove Background," and the AI model detects the subject and cuts it out — no manual selecting or erasing needed. Runs entirely in your browser.</p>

          <div id="dropzone-area"></div>
        </div>

        <article class="mt-12 mb-8 space-y-5 text-slate-700 dark:text-slate-300">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">Photo Editing Guide</span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How AI Background Removal Actually Works</h2>
          </div>
          <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>Removing the background from a photo used to mean opening a heavy editor and manually tracing around the subject with a lasso or pen tool — a slow, fiddly process even for someone experienced with photo editing. This tool replaces that entire workflow with a single click. An AI model trained specifically to recognize the boundary between a subject and its surroundings scans the image, works out exactly which pixels belong to the person or object in front, and makes everything else transparent.</p>

            <h3 class="text-base font-black text-slate-900 dark:text-white pt-2">Why AI Beats Simple Color-Based Removal</h3>
            <p>Older, simpler background removers work by deleting pixels of a specific color — usually white or green — which only works if your photo happens to have a flat, plain backdrop to begin with. A real photo taken at home, outdoors, or in an office rarely has that. The AI model used here doesn't look at color at all; it recognizes shapes, edges, and the general concept of "a person" or "an object" the same way a human eye instantly separates a subject from its surroundings, regardless of how busy or uneven the background is.</p>

            <h3 class="text-base font-black text-slate-900 dark:text-white pt-2">Two Ways to Finish Your Photo</h3>
            <p>Once the background is removed, you have two options. Download it immediately as a transparent PNG — perfect for logos, product listings, or pasting into another design. Or tap Choose Template to drop in a new backdrop: pick from a set of solid colors, gradients, and passport-style backgrounds, or upload any photo of your own from your gallery to use as the new background instead.</p>

            <h3 class="text-base font-black text-slate-900 dark:text-white pt-2">Common Uses</h3>
            <p>This kind of clean cutout is useful far beyond passport photos. Sellers use it to place products on a plain white or branded background for online listings. Job seekers use it to create a professional-looking profile photo without needing a studio backdrop. Designers use it to quickly source ready-to-use subject cutouts for posters, thumbnails, and social media graphics — all without ever leaving the browser or waiting on a queue for a server to process the image.</p>

            <h3 class="text-base font-black text-slate-900 dark:text-white pt-2">Getting the Cleanest Cutout</h3>
            <p>Results are sharpest when the subject is clearly in focus and reasonably separated from the background in the original shot — for example, avoid photos where hair or clothing blends into a similarly colored wall. Good, even lighting also helps the model draw a cleaner edge around fine details like hair strands or fingers.</p>
          </div>
        </article>
      </div>
    `;

    container.querySelector('#btn-back').addEventListener('click', onBack);

    const dropzone = createDropzone({
      accept: 'image/jpeg,image/png,image/webp,image/jpg',
      onFilesSelected: (file) => {
        originalFile = file;
        const img = new Image();
        img.onload = () => {
          originalImg = img;
          renderWorkspaceView();
        };
        img.src = URL.createObjectURL(file);
      }
    });
    container.querySelector('#dropzone-area').appendChild(dropzone);
  }

  function renderWorkspaceView() {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8 w-full">
        <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">← Back to All Tools</button>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center" style="background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;">
            <canvas id="preview-canvas" class="max-h-96 w-auto rounded-xl shadow-md"></canvas>
          </div>

          <div id="status-area" class="mt-5"></div>
        </div>
      </div>
    `;

    container.querySelector('#btn-back').addEventListener('click', onBack);

    const canvas = container.querySelector('#preview-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = originalImg.width;
    canvas.height = originalImg.height;
    ctx.drawImage(originalImg, 0, 0);

    const statusArea = container.querySelector('#status-area');
    statusArea.innerHTML = `
      <button id="btn-remove-bg" class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2">
        ✨ Remove Background Now
      </button>
    `;

    container.querySelector('#btn-remove-bg').addEventListener('click', async () => {
      statusArea.innerHTML = `
        <div class="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-bold text-center" id="progress-text">
          Loading AI model... this can take a few seconds the first time.
        </div>
      `;
      const progressText = container.querySelector('#progress-text');

      try {
        const { removeBackground } = await import('@imgly/background-removal');
        const resultBlob = await removeBackground(originalFile, {
          progress: (key, current, total) => {
            if (progressText) {
              progressText.textContent = `Processing... ${Math.round((current / total) * 100)}%`;
            }
          }
        });

        const resultImg = new Image();
        resultImg.onload = () => {
          const tempC = document.createElement('canvas');
          tempC.width = originalImg.width;
          tempC.height = originalImg.height;
          tempC.getContext('2d').drawImage(resultImg, 0, 0, tempC.width, tempC.height);
          processedCanvas = tempC;

          redraw(canvas, ctx);
          renderPostRemovalControls();
        };
        resultImg.src = URL.createObjectURL(resultBlob);

      } catch (err) {
        statusArea.innerHTML = `<div class="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-bold">Error: ${err.message}</div>`;
      }
    });

    function renderPostRemovalControls() {
      statusArea.innerHTML = `
        <div class="grid grid-cols-2 gap-3">
          <button id="btn-download" class="py-3.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all">
            📥 Download
          </button>
          <button id="btn-template" class="py-3.5 px-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-sm rounded-xl shadow-lg hover:opacity-90 transition-all">
            🎨 Template
          </button>
        </div>
      `;

      container.querySelector('#btn-download').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'background-removed.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });

      container.querySelector('#btn-template').addEventListener('click', () => {
        renderTemplateGalleryView(canvas, ctx);
      });
    }
  }

  function redraw(canvas, ctx) {
    canvas.width = originalImg.width;
    canvas.height = originalImg.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (customBgImg) {
      ctx.drawImage(customBgImg, 0, 0, canvas.width, canvas.height);
    } else if (selectedBg.type === 'color') {
      ctx.fillStyle = selectedBg.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (selectedBg.type === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, selectedBg.stops[0]);
      grad.addColorStop(1, selectedBg.stops[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // 'transparent' → leave cleared

    if (processedCanvas) {
      ctx.drawImage(processedCanvas, 0, 0);
    }
  }

  // "New page" — full template gallery + gallery-upload option
  function renderTemplateGalleryView(previewCanvas, previewCtx) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8 w-full">
        <button id="btn-back-to-photo" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">← Back to Photo</button>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">Choose a Background</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Pick a template below, or upload your own photo from the gallery.</p>

          <div class="grid grid-cols-3 sm:grid-cols-4 gap-3" id="template-grid"></div>

          <div class="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Or Upload Custom Background from Gallery</label>
            <input type="file" id="bg-gallery-input" accept="image/*" class="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer" />
          </div>
        </div>
      </div>
    `;

    const grid = container.querySelector('#template-grid');
    TEMPLATES.forEach(tpl => {
      const swatch = document.createElement('button');
      swatch.className = 'group flex flex-col items-center gap-1.5';
      let bgStyle = '';
      if (tpl.type === 'transparent') {
        bgStyle = `background-image: linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%); background-size: 12px 12px; background-position: 0 0, 0 6px, 6px -6px, -6px 0px;`;
      } else if (tpl.type === 'color') {
        bgStyle = `background-color: ${tpl.value};`;
      } else if (tpl.type === 'gradient') {
        bgStyle = `background-image: linear-gradient(135deg, ${tpl.stops[0]}, ${tpl.stops[1]});`;
      }
      swatch.innerHTML = `
        <div class="w-full aspect-square rounded-2xl border-2 border-slate-200 dark:border-slate-700 group-hover:border-rose-500 transition-all" style="${bgStyle}"></div>
        <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">${tpl.label}</span>
      `;
      swatch.addEventListener('click', () => {
        customBgImg = null;
        selectedBg = tpl.type === 'color' ? { type: 'color', value: tpl.value }
          : tpl.type === 'gradient' ? { type: 'gradient', stops: tpl.stops }
          : { type: 'transparent' };
        redraw(previewCanvas, previewCtx);
        goBackToWorkspaceControls();
      });
      grid.appendChild(swatch);
    });

    container.querySelector('#bg-gallery-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        customBgImg = img;
        redraw(previewCanvas, previewCtx);
        goBackToWorkspaceControls();
      };
      img.src = URL.createObjectURL(file);
    });

    container.querySelector('#btn-back-to-photo').addEventListener('click', () => {
      goBackToWorkspaceControls();
    });

    function goBackToWorkspaceControls() {
      renderWorkspaceViewFromExisting();
    }
  }

  function renderWorkspaceViewFromExisting() {
    // Re-render the workspace but skip straight to the composited result view
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8 w-full">
        <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">← Back to All Tools</button>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center" style="background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;">
            <canvas id="preview-canvas" class="max-h-96 w-auto rounded-xl shadow-md"></canvas>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-5">
            <button id="btn-download" class="py-3.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all">
              📥 Download
            </button>
            <button id="btn-template" class="py-3.5 px-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-sm rounded-xl shadow-lg hover:opacity-90 transition-all">
              🎨 Template
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-back').addEventListener('click', onBack);

    const canvas = container.querySelector('#preview-canvas');
    const ctx = canvas.getContext('2d');
    redraw(canvas, ctx);

    container.querySelector('#btn-download').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'background-removed.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });

    container.querySelector('#btn-template').addEventListener('click', () => {
      renderTemplateGalleryView(canvas, ctx);
    });
  }
}
