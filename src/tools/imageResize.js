import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';
import { escapeHtml, loadImage } from '../utils/dom.js';

export function renderImageResize(container) {
  // The page title, intro and article live in the static HTML page (content/image-resize.html).
  // This file only draws the tool itself.
  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div id="dropzone-area"></div>
      <div id="action-area" class="hidden mt-6 space-y-6"></div>
    </div>
  `;

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  const dropzone = createDropzone({
    accept: 'image/*',
    onFilesSelected: (file) => handleFile(file)
  });
  dropzoneArea.appendChild(dropzone);

  let currentFile = null;
  let imgObj = null;
  let lastResultUrl = null;

  async function handleFile(file) {
    currentFile = file;
    const previewUrl = await readFileAsDataURL(file);

    try {
      imgObj = await loadImage(previewUrl);
    } catch (err) {
      alert(err.message);
      return;
    }

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
        <img src="${previewUrl}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm dark:border-slate-700" />
        <div class="overflow-hidden">
          <p class="font-semibold text-slate-800 text-sm truncate dark:text-slate-200">${escapeHtml(file.name)}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Original Dimensions: <span class="font-bold text-indigo-700">${imgObj.naturalWidth} × ${imgObj.naturalHeight} px</span></p>
        </div>
      </div>

      <!-- Document Presets -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300">Select Document / Form Preset</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button type="button" data-w="350" data-h="450" class="preset-card text-left p-3 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 hover:border-indigo-600 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🛂 Passport Photo</span>
            <span class="block text-[11px] text-indigo-600 font-semibold mt-0.5">350 × 450 px (7:9)</span>
          </button>

          <button type="button" data-w="300" data-h="120" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">✍️ Signature</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">300 × 120 px (5:2)</span>
          </button>

          <button type="button" data-w="200" data-h="230" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🏛️ Exam Photo</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">200 × 230 px</span>
          </button>

          <button type="button" data-w="1080" data-h="1080" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🔲 Square (1:1)</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">1080 × 1080 px</span>
          </button>

          <button type="button" data-w="1920" data-h="1080" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🖥️ Full HD (16:9)</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">1920 × 1080 px</span>
          </button>

          <button type="button" data-w="custom" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">✏️ Custom Size</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">Enter custom px</span>
          </button>
        </div>
      </div>

      <!-- Dimensions and Framing -->
      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 dark:bg-slate-800/60 dark:border-slate-800">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1 dark:text-slate-300">Target Width (px)</label>
            <input type="number" id="input-w" value="350" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1 dark:text-slate-300">Target Height (px)</label>
            <input type="number" id="input-h" value="450" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" />
          </div>
        </div>

        <!-- Clarity Mode / Multiplier -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2 dark:text-slate-300">Clarity & Resolution Mode</label>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <label class="flex items-center gap-2 p-3 bg-white border-2 border-indigo-600 rounded-xl cursor-pointer clarity-opt dark:bg-slate-900">
              <input type="radio" name="clarityMode" value="1" checked class="accent-indigo-600" />
              <div>
                <span class="font-bold text-slate-800 block dark:text-slate-200">Exact Size (1x)</span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400">Use this for forms with a fixed pixel size</span>
              </div>
            </label>
            <label class="flex items-center gap-2 p-3 bg-white border-2 border-slate-200 rounded-xl cursor-pointer clarity-opt hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-800">
              <input type="radio" name="clarityMode" value="2" class="accent-indigo-600" />
              <div>
                <span class="font-bold text-slate-800 block dark:text-slate-200">Double Size (2x)</span>
                <span class="text-[10px] text-indigo-600 font-semibold">2x pixels, for printing or sharp viewing</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <button id="btn-crop-resize" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Crop & Resize
      </button>

      <div id="crop-preview-output" class="hidden"></div>
    `;

    const inputW = actionArea.querySelector('#input-w');
    const inputH = actionArea.querySelector('#input-h');
    const presetCards = actionArea.querySelectorAll('.preset-card');
    const clarityOpts = actionArea.querySelectorAll('.clarity-opt');
    const btnCropResize = actionArea.querySelector('#btn-crop-resize');
    const cropPreviewOutput = actionArea.querySelector('#crop-preview-output');

    clarityOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        clarityOpts.forEach(o => {
          o.classList.remove('border-indigo-600');
          o.classList.add('border-slate-200');
        });
        opt.classList.add('border-indigo-600');
        opt.classList.remove('border-slate-200');
      });
    });

    presetCards.forEach(card => {
      card.addEventListener('click', () => {
        presetCards.forEach(c => {
          c.classList.remove('border-indigo-600', 'bg-indigo-50/50');
          c.classList.add('border-slate-200', 'bg-white');
          const sub = c.querySelector('span:last-child');
          if (sub) {
            sub.classList.remove('text-indigo-600');
            sub.classList.add('text-slate-500');
          }
        });

        card.classList.add('border-indigo-600', 'bg-indigo-50/50');
        card.classList.remove('border-slate-200', 'bg-white');
        const activeSub = card.querySelector('span:last-child');
        if (activeSub) {
          activeSub.classList.add('text-indigo-600');
          activeSub.classList.remove('text-slate-500');
        }

        const w = card.getAttribute('data-w');
        const h = card.getAttribute('data-h');
        if (w !== 'custom') {
          inputW.value = w;
          inputH.value = h;
        }
      });
    });

    btnCropResize.addEventListener('click', async () => {
      const baseW = parseInt(inputW.value, 10);
      const baseH = parseInt(inputH.value, 10);
      const multiplier = parseInt(actionArea.querySelector('input[name="clarityMode"]:checked').value, 10);

      if (!baseW || !baseH || baseW <= 0 || baseH <= 0) {
        alert('Please enter valid width and height in pixels.');
        return;
      }

      const targetW = baseW * multiplier;
      const targetH = baseH * multiplier;

      if (targetW > 8000 || targetH > 8000) {
        alert('The maximum size is 8000 pixels on each side. Please enter smaller values.');
        return;
      }

      btnCropResize.disabled = true;
      btnCropResize.innerHTML = 'Resizing...';

      const srcW = imgObj.naturalWidth;
      const srcH = imgObj.naturalHeight;
      const srcRatio = srcW / srcH;
      const targetRatio = targetW / targetH;

      let cropW, cropH, cropX, cropY;

      if (srcRatio > targetRatio) {
        cropH = srcH;
        cropW = srcH * targetRatio;
        cropX = (srcW - cropW) / 2;
        cropY = 0;
      } else {
        cropW = srcW;
        cropH = srcW / targetRatio;
        cropX = 0;
        cropY = (srcH - cropH) * 0.22;
      }

      const finalCanvas = multiStepScale(imgObj, cropX, cropY, cropW, cropH, targetW, targetH);
      applySharpen(finalCanvas);

      finalCanvas.toBlob((blob) => {
        if (!blob) {
          alert('The image could not be created. Try a smaller size.');
          btnCropResize.disabled = false;
          btnCropResize.innerHTML = '⚡ Crop & Resize';
          return;
        }
        if (lastResultUrl) URL.revokeObjectURL(lastResultUrl);
        const resizedUrl = URL.createObjectURL(blob);
        lastResultUrl = resizedUrl;

        cropPreviewOutput.classList.remove('hidden');
        cropPreviewOutput.innerHTML = `
          <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4 dark:bg-slate-800/60 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Result</p>
              <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 dark:bg-indigo-950/40">
                ${targetW} × ${targetH} px (${formatBytes(blob.size)})
              </span>
            </div>
            <div class="flex justify-center bg-white p-3 rounded-xl border border-slate-200 max-h-80 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              <img src="${resizedUrl}" class="max-h-72 object-contain rounded-lg shadow-sm" />
            </div>
            <button id="btn-download-crop" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download Photo (${targetW}×${targetH}px)
            </button>
          </div>
        `;

        cropPreviewOutput.querySelector('#btn-download-crop').addEventListener('click', () => {
          const nameParts = currentFile.name.split('.');
          nameParts.pop();
          downloadFile(blob, `${nameParts.join('.')}_${targetW}x${targetH}_sharp.jpg`);
        });

        btnCropResize.disabled = false;
        btnCropResize.innerHTML = '⚡ Crop & Resize';
      }, 'image/jpeg', 0.98);
    });
  }
}

function multiStepScale(img, sx, sy, sw, sh, dw, dh) {
  let curW = sw;
  let curH = sh;
  let curCanvas = document.createElement('canvas');
  curCanvas.width = curW;
  curCanvas.height = curH;
  let curCtx = curCanvas.getContext('2d');
  curCtx.drawImage(img, sx, sy, sw, sh, 0, 0, curW, curH);

  while (curW / 2 > dw && curH / 2 > dh) {
    curW = Math.round(curW / 2);
    curH = Math.round(curH / 2);
    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = curW;
    nextCanvas.height = curH;
    const nextCtx = nextCanvas.getContext('2d');
    nextCtx.imageSmoothingEnabled = true;
    nextCtx.imageSmoothingQuality = 'high';
    nextCtx.drawImage(curCanvas, 0, 0, curW, curH);
    curCanvas = nextCanvas;
    curCtx = nextCtx;
  }

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = dw;
  finalCanvas.height = dh;
  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';
  finalCtx.fillStyle = '#FFFFFF';
  finalCtx.fillRect(0, 0, dw, dh);
  finalCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, dw, dh);

  return finalCanvas;
}

function applySharpen(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);
  const mix = 0.20;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const top = copy[((y - 1) * w + x) * 4 + c];
        const bottom = copy[((y + 1) * w + x) * 4 + c];
        const left = copy[(y * w + (x - 1)) * 4 + c];
        const right = copy[(y * w + (x + 1)) * 4 + c];
        const center = copy[idx + c];

        const sharpVal = center * 3 - (top + bottom + left + right) * 0.5;
        data[idx + c] = Math.round(center * (1 - mix) + sharpVal * mix);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
