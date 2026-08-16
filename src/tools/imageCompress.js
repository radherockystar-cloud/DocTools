import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderImageCompress(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Smart Quality Engine</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Compress Image (HD Sharpness)</h1>
          <p class="text-sm text-slate-500 mt-1">Shrinks MBs to exact KB (up to 2000 KB) without losing clarity.</p>
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
  let compressedBlob = null;

  async function handleFile(file) {
    currentFile = file;
    const previewUrl = await readFileAsDataURL(file);

    imgObj = new Image();
    imgObj.src = previewUrl;
    await new Promise(r => imgObj.onload = r);

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-3">
          <img src="${previewUrl}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm" />
          <div class="overflow-hidden">
            <p class="font-semibold text-slate-800 text-sm truncate">${file.name}</p>
            <p class="text-xs text-slate-500">Original Size: <span class="font-bold text-slate-700">${formatBytes(file.size)}</span></p>
          </div>
        </div>
        <div id="result-stat" class="flex sm:justify-end items-center text-xs text-slate-600 font-medium">
          Ready to compress
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Target Size (KB)</label>
        
        <!-- Preset Buttons -->
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          <button type="button" data-kb="20" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all">20 KB</button>
          <button type="button" data-kb="50" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all">50 KB</button>
          <button type="button" data-kb="100" class="preset-btn py-2 text-xs font-bold rounded-xl border border-blue-500 bg-blue-50 text-blue-600 font-bold transition-all">100 KB</button>
          <button type="button" data-kb="200" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all">200 KB</button>
          <button type="button" data-kb="500" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all">500 KB</button>
          <button type="button" data-kb="1000" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all">1 MB</button>
        </div>

        <!-- Custom Slider (10 KB to 2000 KB) -->
        <div class="flex items-center gap-3">
          <input type="range" id="size-range" min="10" max="2000" step="10" value="100" class="w-full accent-blue-600" />
          <span id="range-val" class="text-sm font-bold text-blue-600 min-w-[75px] text-right">100 KB</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button id="btn-compress" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2">
          ⚡ Compress (Keep Sharp)
        </button>
      </div>

      <div id="preview-output" class="hidden"></div>
    `;

    const range = actionArea.querySelector('#size-range');
    const rangeVal = actionArea.querySelector('#range-val');
    const presetBtns = actionArea.querySelectorAll('.preset-btn');
    const btnCompress = actionArea.querySelector('#btn-compress');
    const resultStat = actionArea.querySelector('#result-stat');
    const previewOutput = actionArea.querySelector('#preview-output');

    range.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      rangeVal.textContent = val >= 1000 ? `${(val/1000).toFixed(1)} MB` : `${val} KB`;
      presetBtns.forEach(b => b.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-600'));
    });

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-600'));
        btn.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-600');
        const kb = parseInt(btn.getAttribute('data-kb'), 10);
        range.value = kb;
        rangeVal.textContent = kb >= 1000 ? `${(kb/1000).toFixed(0)} MB` : `${kb} KB`;
      });
    });

    btnCompress.addEventListener('click', async () => {
      btnCompress.disabled = true;
      btnCompress.innerHTML = 'Optimizing with HD Engine...';

      const targetBytes = parseInt(range.value, 10) * 1024;
      compressedBlob = await smartCompress(imgObj, targetBytes);

      const compressedUrl = URL.createObjectURL(compressedBlob);

      resultStat.innerHTML = `
        <span class="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          Result: ${formatBytes(compressedBlob.size)}
        </span>
      `;

      previewOutput.classList.remove('hidden');
      previewOutput.innerHTML = `
        <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-600">HD Preview (Zero Blur)</p>
          <div class="flex justify-center bg-white p-2 rounded-xl border border-slate-200 max-h-72 overflow-hidden">
            <img src="${compressedUrl}" class="max-h-64 object-contain rounded-lg" />
          </div>
          <button id="btn-download" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
            ⬇ Download Compressed Photo (${formatBytes(compressedBlob.size)})
          </button>
        </div>
      `;

      previewOutput.querySelector('#btn-download').addEventListener('click', () => {
        const nameParts = currentFile.name.split('.');
        nameParts.pop();
        downloadFile(compressedBlob, `${nameParts.join('.')}_hd_compressed.jpg`);
      });

      btnCompress.disabled = false;
      btnCompress.innerHTML = '⚡ Compress Again';
    });
  }
}

// Smart Adaptive High-Quality Compression Engine
async function smartCompress(img, targetBytes) {
  let scale = 1.0;
  let quality = 0.92;
  let bestBlob = null;

  // Max dimension bounds adaptive based on target size
  const maxDim = Math.max(img.width, img.height);
  let capDim = 2560; // 2K/4K resolution for large targets
  if (targetBytes <= 100 * 1024) {
    capDim = 1280; // For small form size (20KB - 100KB)
  } else if (targetBytes <= 500 * 1024) {
    capDim = 1920; // Full HD
  }

  if (maxDim > capDim) {
    scale = capDim / maxDim;
  }

  for (let i = 0; i < 8; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
    bestBlob = blob;

    if (blob.size <= targetBytes) {
      if (blob.size >= targetBytes * 0.85 || quality >= 0.94) {
        return blob;
      }
      quality = Math.min(0.96, quality + 0.04);
    } else {
      if (quality > 0.72) {
        quality -= 0.07;
      } else {
        scale *= 0.84;
      }
    }
  }

  return bestBlob;
}
