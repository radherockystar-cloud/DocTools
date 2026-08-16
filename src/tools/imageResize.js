import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderImageResize(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">Crisp Edge Engine</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Crop & Resize Dimensions</h1>
          <p class="text-sm text-slate-500 mt-1">Multi-step downscaling + Micro-sharpening for crystal clear Passport & Signature.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-6"></div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  const dropzone = createDropzone({
    accept: 'image/*',
    onFilesSelected: (file) => handleFile(file)
  });
  dropzoneArea.appendChild(dropzone);

  let currentFile = null;
  let imgObj = null;

  async function handleFile(file) {
    currentFile = file;
    const previewUrl = await readFileAsDataURL(file);

    imgObj = new Image();
    imgObj.src = previewUrl;
    await new Promise(r => imgObj.onload = r);

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <img src="${previewUrl}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm" />
        <div class="overflow-hidden">
          <p class="font-semibold text-slate-800 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500">Original Dimensions: <span class="font-bold text-indigo-700">${imgObj.naturalWidth} × ${imgObj.naturalHeight} px</span></p>
        </div>
      </div>

      <!-- Document Presets -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Document / Form Preset</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button type="button" data-w="350" data-h="450" class="preset-card text-left p-3 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 hover:border-indigo-600 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900">🛂 Passport Photo</span>
            <span class="block text-[11px] text-indigo-600 font-semibold mt-0.5">350 × 450 px (7:9)</span>
          </button>

          <button type="button" data-w="300" data-h="120" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900">✍️ Signature</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5">300 × 120 px (5:2)</span>
          </button>

          <button type="button" data-w="200" data-h="230" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900">🏛️ SSC / UPSC</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5">200 × 230 px</span>
          </button>

          <button type="button" data-w="1080" data-h="1080" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900">🔲 Square (1:1)</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5">1080 × 1080 px</span>
          </button>

          <button type="button" data-w="1920" data-h="1080" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900">🖥️ Full HD (16:9)</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5">1920 × 1080 px</span>
          </button>

          <button type="button" data-w="custom" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900">✏️ Custom Size</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5">Enter custom px</span>
          </button>
        </div>
      </div>

      <!-- Dimensions and Framing -->
      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Target Width (px)</label>
            <input type="number" id="input-w" value="350" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Target Height (px)</label>
            <input type="number" id="input-h" value="450" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600" />
          </div>
        </div>

        <!-- Clarity Mode / Multiplier -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Clarity & Resolution Mode</label>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <label class="flex items-center gap-2 p-3 bg-white border-2 border-indigo-600 rounded-xl cursor-pointer clarity-opt">
              <input type="radio" name="clarityMode" value="1" checked class="accent-indigo-600" />
              <div>
                <span class="font-bold text-slate-800 block">Exact Form Size (1x)</span>
                <span class="text-[10px] text-slate-500">Matches official form requirements</span>
              </div>
            </label>
            <label class="flex items-center gap-2 p-3 bg-white border-2 border-slate-200 rounded-xl cursor-pointer clarity-opt hover:border-indigo-400">
              <input type="radio" name="clarityMode" value="2" class="accent-indigo-600" />
              <div>
                <span class="font-bold text-slate-800 block">Super HD 2x Clarity</span>
                <span class="text-[10px] text-indigo-600 font-semibold">2x High-DPI for sharp viewing</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <button id="btn-crop-resize" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Crop & Render Ultra HD
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

      btnCropResize.disabled = true;
      btnCropResize.innerHTML = 'Rendering Ultra Sharp HD...';

      // 1. Calculate Crop Box
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
        cropY = (srcH - cropH) * 0.22; // Face focus offset
      }

      // 2. Multi-Step Downscaling for Maximum Sharpness
      const finalCanvas = multiStepScale(imgObj, cropX, cropY, cropW, cropH, targetW, targetH);
      
      // 3. Apply Micro-Sharpening Filter
      applySharpen(finalCanvas);

      finalCanvas.toBlob((blob) => {
        const resizedUrl = URL.createObjectURL(blob);

        cropPreviewOutput.classList.remove('hidden');
        cropPreviewOutput.innerHTML = `
          <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-600">Ultra-Sharp HD Result</p>
              <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                ${targetW} × ${targetH} px (${formatBytes(blob.size)})
              </span>
            </div>
            <div class="flex justify-center bg-white p-3 rounded-xl border border-slate-200 max-h-80 overflow-hidden">
              <img src="${resizedUrl}" class="max-h-72 object-contain rounded-lg shadow-sm" />
            </div>
            <button id="btn-download-crop" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download Sharp Photo (${targetW}×${targetH}px)
            </button>
          </div>
        `;

        cropPreviewOutput.querySelector('#btn-download-crop').addEventListener('click', () => {
          const nameParts = currentFile.name.split('.');
          nameParts.pop();
          downloadFile(blob, `${nameParts.join('.')}_${targetW}x${targetH}_sharp.jpg`);
        });

        btnCropResize.disabled = false;
        btnCropResize.innerHTML = '⚡ Crop & Render Ultra HD';
      }, 'image/jpeg', 0.98);
    });
  }
}

// Multi-Step High Quality Stepped Scaling
function multiStepScale(img, sx, sy, sw, sh, dw, dh) {
  let curW = sw;
  let curH = sh;
  let curCanvas = document.createElement('canvas');
  curCanvas.width = curW;
  curCanvas.height = curH;
  let curCtx = curCanvas.getContext('2d');
  curCtx.drawImage(img, sx, sy, sw, sh, 0, 0, curW, curH);

  // Stepped halving to avoid downscale aliasing/blur
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

  // Final render to target size
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

// Micro-Edge Sharpening Filter Kernel
function applySharpen(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);

  // Moderate Sharpen Kernel [0, -0.5, 0, -0.5, 3, -0.5, 0, -0.5, 0]
  const mix = 0.20; // 20% subtle edge crisping

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
