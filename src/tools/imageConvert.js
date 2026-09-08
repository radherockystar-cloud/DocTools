import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderImageConvert(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors dark:text-slate-400">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md dark:bg-purple-950/40">Smart Format Engine</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 dark:text-white">Convert Image Format</h1>
          <p class="text-sm text-slate-500 mt-1 dark:text-slate-400">Convert between JPG, PNG & WebP with optimal balance of HD sharpness & small size.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-6"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">Format Guide & Comparison</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">JPG vs PNG vs WEBP: Which Format Should You Use?</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Choosing the right image format matters more than most people realize. JPG is the safest choice for photographs and almost all exam or job application forms, since it compresses well and is universally accepted. PNG is lossless, making it ideal for signatures, logos, or screenshots with sharp text and transparent backgrounds, but it produces much larger files for photos. WEBP is the modern middle ground — it often achieves the smallest file size of the three while keeping visual quality close to the original, making it great for websites, though some older government portals may not accept it.</p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">If a form specifically asks for JPG, always convert to JPG even if your original file is PNG or WEBP. For anything involving a signature or a logo with flat colors, PNG preserves the crisp edges better. When in doubt and the platform accepts it, WEBP gives you the best balance of quality and small size.</p>
        </div>
      </article>
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
  let imgElement = null;

  async function handleFile(file) {
    currentFile = file;
    const previewUrl = await readFileAsDataURL(file);

    imgElement = new Image();
    imgElement.src = previewUrl;
    await new Promise(r => imgElement.onload = r);

    const originalFormat = file.type ? file.type.split('/')[1].toUpperCase() : 'UNKNOWN';

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
        <img src="${previewUrl}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm dark:border-slate-700" />
        <div class="overflow-hidden">
          <p class="font-semibold text-slate-800 text-sm truncate dark:text-slate-200">${file.name}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md dark:bg-slate-700 dark:text-slate-200">${originalFormat}</span>
            <span class="text-xs text-slate-500 font-medium dark:text-slate-400">${imgElement.naturalWidth}×${imgElement.naturalHeight} px</span>
            <span class="text-xs text-slate-500 font-medium dark:text-slate-400">| ${formatBytes(file.size)}</span>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300">Select Target Format</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label class="flex flex-col p-3.5 border-2 border-purple-600 bg-purple-50 text-purple-900 rounded-2xl cursor-pointer format-card dark:bg-purple-950/40">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm">JPG / JPEG</span>
              <input type="radio" name="targetFormat" value="image/jpeg" checked class="accent-purple-600" />
            </div>
            <span class="text-[11px] text-slate-500 mt-1 dark:text-slate-400">Standard for Exam & Job Forms</span>
          </label>

          <label class="flex flex-col p-3.5 border-2 border-slate-200 bg-white text-slate-800 rounded-2xl cursor-pointer hover:border-purple-400 format-card dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm">WEBP</span>
              <input type="radio" name="targetFormat" value="image/webp" class="accent-purple-600" />
            </div>
            <span class="text-[11px] text-slate-500 mt-1 dark:text-slate-400">Fast & Smallest Size (HD)</span>
          </label>

          <label class="flex flex-col p-3.5 border-2 border-slate-200 bg-white text-slate-800 rounded-2xl cursor-pointer hover:border-purple-400 format-card dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm">PNG</span>
              <input type="radio" name="targetFormat" value="image/png" class="accent-purple-600" />
            </div>
            <span class="text-[11px] text-slate-500 mt-1 dark:text-slate-400">Lossless (Best for Sign / Logo)</span>
          </label>
        </div>
      </div>

      <button id="btn-convert" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Convert Format Now
      </button>

      <div id="convert-result" class="hidden"></div>
    `;

    const formatCards = actionArea.querySelectorAll('.format-card');
    const btnConvert = actionArea.querySelector('#btn-convert');
    const convertResult = actionArea.querySelector('#convert-result');

    formatCards.forEach(card => {
      card.addEventListener('click', () => {
        formatCards.forEach(c => {
          c.classList.remove('border-purple-600', 'bg-purple-50', 'text-purple-900');
          c.classList.add('border-slate-200', 'bg-white', 'text-slate-800');
        });
        card.classList.add('border-purple-600', 'bg-purple-50', 'text-purple-900');
        card.classList.remove('border-slate-200', 'bg-white', 'text-slate-800');
        card.querySelector('input[type="radio"]').checked = true;
      });
    });

    btnConvert.addEventListener('click', () => {
      btnConvert.disabled = true;
      btnConvert.innerHTML = 'Converting Format...';

      const selectedFormat = actionArea.querySelector('input[name="targetFormat"]:checked').value;
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (selectedFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(imgElement, 0, 0);

      let quality = 0.92;
      if (selectedFormat === 'image/webp') quality = 0.88;
      if (selectedFormat === 'image/png') quality = undefined;

      canvas.toBlob((blob) => {
        const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
        const targetExt = extMap[selectedFormat] || 'jpg';
        const originalBaseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
        const newFileName = `${originalBaseName}_converted.${targetExt}`;
        const previewConvertedUrl = URL.createObjectURL(blob);

        convertResult.classList.remove('hidden');
        convertResult.innerHTML = `
          <div class="bg-purple-50/70 border border-purple-200 p-5 rounded-2xl space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase text-purple-700">Conversion Successful!</span>
              <span class="text-xs font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">${targetExt.toUpperCase()}</span>
            </div>

            <div class="flex justify-center bg-white p-2 rounded-xl border border-purple-100 max-h-64 overflow-hidden dark:bg-slate-900">
              <img src="${previewConvertedUrl}" class="max-h-60 object-contain rounded-lg" />
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-purple-100 dark:bg-slate-900">
              <div>
                <p class="text-slate-400 font-semibold dark:text-slate-500">Original (${originalFormat})</p>
                <p class="text-slate-800 font-bold mt-0.5 dark:text-slate-200">${formatBytes(currentFile.size)}</p>
              </div>
              <div>
                <p class="text-purple-600 font-semibold">Converted (${targetExt.toUpperCase()})</p>
                <p class="text-purple-900 font-bold mt-0.5">${formatBytes(blob.size)}</p>
              </div>
            </div>

            <button id="btn-download-converted" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download .${targetExt.toUpperCase()} (${formatBytes(blob.size)})
            </button>
          </div>
        `;

        convertResult.querySelector('#btn-download-converted').addEventListener('click', () => {
          downloadFile(blob, newFileName);
        });

        btnConvert.disabled = false;
        btnConvert.innerHTML = '⚡ Convert Again';
      }, selectedFormat, quality);
    });
  }
}
