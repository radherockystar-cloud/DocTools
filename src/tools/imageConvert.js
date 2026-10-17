import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';
import { escapeHtml, loadImage } from '../utils/dom.js';

export function renderImageConvert(container) {
  // The page title, intro and article live in the static HTML page (content/image-convert.html).
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
  let imgElement = null;
  let lastPreviewUrl = null;

  async function handleFile(file) {
    currentFile = file;
    const previewUrl = await readFileAsDataURL(file);

    try {
      imgElement = await loadImage(previewUrl);
    } catch (err) {
      alert(err.message);
      return;
    }

    const originalFormat = file.type ? file.type.split('/')[1].toUpperCase() : 'UNKNOWN';

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
        <img src="${previewUrl}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm dark:border-slate-700" />
        <div class="overflow-hidden">
          <p class="font-semibold text-slate-800 text-sm truncate dark:text-slate-200">${escapeHtml(file.name)}</p>
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
        if (!blob) {
          alert('The image could not be converted. Try a smaller image.');
          btnConvert.disabled = false;
          btnConvert.innerHTML = '⚡ Convert Format Now';
          return;
        }
        const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
        // Some browsers cannot create WEBP and silently return PNG, so trust the real type of the result.
        const targetExt = extMap[blob.type] || extMap[selectedFormat] || 'jpg';
        const formatMismatch = Boolean(blob.type) && blob.type !== selectedFormat;
        const originalBaseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
        const newFileName = `${originalBaseName}_converted.${targetExt}`;
        if (lastPreviewUrl) URL.revokeObjectURL(lastPreviewUrl);
        const previewConvertedUrl = URL.createObjectURL(blob);
        lastPreviewUrl = previewConvertedUrl;

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

            ${formatMismatch ? `<p class="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">Your browser cannot create the format you chose, so it saved ${targetExt.toUpperCase()} instead.</p>` : ''}

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
