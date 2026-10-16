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

export function renderBgRemover(container) {
  let originalFile = null;
  let originalImg = null;
  let processedCanvas = null; // subject with transparent bg, ready to composite
  let selectedBg = { type: 'transparent' };
  let customBgImg = null;
  let objectUrls = [];

  const CHECKER_STYLE = 'background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;';
  const CARD = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm';

  // The page title, intro and article live in the static HTML page (content/bg-remover.html).
  // This file only draws the tool itself.
  renderUploadView();

  function trackUrl(blobOrFile) {
    const url = URL.createObjectURL(blobOrFile);
    objectUrls.push(url);
    return url;
  }

  function releaseUrls() {
    objectUrls.forEach((u) => URL.revokeObjectURL(u));
    objectUrls = [];
  }

  function resetAll() {
    releaseUrls();
    originalFile = null;
    originalImg = null;
    processedCanvas = null;
    selectedBg = { type: 'transparent' };
    customBgImg = null;
    renderUploadView();
  }

  function loadImage(fileOrBlob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('This image could not be opened. Try a JPG, PNG or WEBP file.'));
      img.src = trackUrl(fileOrBlob);
    });
  }

  function downloadCanvas(canvas) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'background-removed.png';
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  }

  function renderUploadView() {
    container.innerHTML = `
      <div class="${CARD}">
        <div id="dropzone-area"></div>
      </div>
    `;

    const dropzone = createDropzone({
      accept: 'image/jpeg,image/png,image/webp,image/jpg',
      onFilesSelected: async (file) => {
        try {
          originalFile = file;
          originalImg = await loadImage(file);
          renderWorkspaceView();
        } catch (err) {
          alert(err.message);
        }
      }
    });
    container.querySelector('#dropzone-area').appendChild(dropzone);
  }

  function workspaceShell(controlsHtml) {
    return `
      <div class="${CARD}">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center" style="${CHECKER_STYLE}">
          <canvas id="preview-canvas" class="max-h-96 max-w-full w-auto rounded-xl shadow-md"></canvas>
        </div>
        <div id="status-area" class="mt-5">${controlsHtml}</div>
        <button id="btn-new-photo" type="button" class="mt-4 w-full text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 transition-colors">Choose another photo</button>
      </div>
    `;
  }

  function renderWorkspaceView() {
    container.innerHTML = workspaceShell('');
    container.querySelector('#btn-new-photo').addEventListener('click', resetAll);

    const canvas = container.querySelector('#preview-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = originalImg.width;
    canvas.height = originalImg.height;
    ctx.drawImage(originalImg, 0, 0);

    const statusArea = container.querySelector('#status-area');
    showRemoveButton();

    function showRemoveButton(errorMessage) {
      statusArea.innerHTML = `
        ${errorMessage ? `<div class="mb-3 p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-bold" id="error-box"></div>` : ''}
        <button id="btn-remove-bg" type="button" class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2">
          ✨ Remove Background Now
        </button>
      `;
      if (errorMessage) statusArea.querySelector('#error-box').textContent = `Error: ${errorMessage}`;
      statusArea.querySelector('#btn-remove-bg').addEventListener('click', runRemoval);
    }

    async function runRemoval() {
      statusArea.innerHTML = `
        <div class="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-bold text-center" id="progress-text">
          Loading AI model... this can take a while the first time.
        </div>
      `;
      const progressText = statusArea.querySelector('#progress-text');

      try {
        const { removeBackground } = await import('@imgly/background-removal');
        const resultBlob = await removeBackground(originalFile, {
          progress: (key, current, total) => {
            if (progressText && total > 0) {
              progressText.textContent = `Processing... ${Math.min(100, Math.round((current / total) * 100))}%`;
            }
          }
        });

        const resultImg = await loadImage(resultBlob);
        const tempC = document.createElement('canvas');
        tempC.width = originalImg.width;
        tempC.height = originalImg.height;
        tempC.getContext('2d').drawImage(resultImg, 0, 0, tempC.width, tempC.height);
        processedCanvas = tempC;

        redraw(canvas, ctx);
        renderPostRemovalControls();
      } catch (err) {
        showRemoveButton((err && err.message) || 'Something went wrong. Please try again.');
      }
    }

    function renderPostRemovalControls() {
      statusArea.innerHTML = postRemovalButtons();
      wirePostRemovalButtons(statusArea, canvas, ctx);
    }
  }

  function postRemovalButtons() {
    return `
      <div class="grid grid-cols-2 gap-3">
        <button id="btn-download" type="button" class="py-3.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all">
          📥 Download
        </button>
        <button id="btn-template" type="button" class="py-3.5 px-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-sm rounded-xl shadow-lg hover:opacity-90 transition-all">
          🎨 Template
        </button>
      </div>
    `;
  }

  function wirePostRemovalButtons(scope, canvas, ctx) {
    scope.querySelector('#btn-download').addEventListener('click', () => downloadCanvas(canvas));
    scope.querySelector('#btn-template').addEventListener('click', () => renderTemplateGalleryView(canvas, ctx));
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
    // 'transparent' -> leave cleared

    if (processedCanvas) {
      ctx.drawImage(processedCanvas, 0, 0);
    }
  }

  function renderTemplateGalleryView(previewCanvas, previewCtx) {
    container.innerHTML = `
      <div class="${CARD}">
        <button id="btn-back-to-photo" type="button" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-5 transition-colors">← Back to Photo</button>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">Choose a Background</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Pick a template below, or upload your own photo from the gallery.</p>

        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3" id="template-grid"></div>

        <div class="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <label for="bg-gallery-input" class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Or Upload Custom Background from Gallery</label>
          <input type="file" id="bg-gallery-input" accept="image/*" class="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer" />
        </div>
      </div>
    `;

    const grid = container.querySelector('#template-grid');
    TEMPLATES.forEach((tpl) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'group flex flex-col items-center gap-1.5';
      let bgStyle = '';
      if (tpl.type === 'transparent') {
        bgStyle = 'background-image: linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%); background-size: 12px 12px; background-position: 0 0, 0 6px, 6px -6px, -6px 0px;';
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
        renderWorkspaceViewFromExisting();
      });
      grid.appendChild(swatch);
    });

    container.querySelector('#bg-gallery-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        customBgImg = await loadImage(file);
        renderWorkspaceViewFromExisting();
      } catch (err) {
        alert(err.message);
      }
    });

    container.querySelector('#btn-back-to-photo').addEventListener('click', renderWorkspaceViewFromExisting);
  }

  function renderWorkspaceViewFromExisting() {
    container.innerHTML = workspaceShell(postRemovalButtons());
    container.querySelector('#btn-new-photo').addEventListener('click', resetAll);

    const canvas = container.querySelector('#preview-canvas');
    const ctx = canvas.getContext('2d');
    redraw(canvas, ctx);
    wirePostRemovalButtons(container, canvas, ctx);
  }
}
