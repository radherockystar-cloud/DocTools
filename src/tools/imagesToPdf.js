import { jsPDF } from 'jspdf';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';
import { escapeHtml, loadImage } from '../utils/dom.js';

const MARGIN_MM = 10;
const MAX_LONG_SIDE_PX = 2400; // about A4 at 200 dpi, keeps the PDF a sensible size

// Draws the image on a white canvas and returns it as a JPEG data URL, so PNG, WEBP and
// transparent images all work and every page uses the same format.
async function imageToJpeg(file) {
  const img = await loadImage(await readFileAsDataURL(file));
  const longSide = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = Math.min(1, MAX_LONG_SIDE_PX / longSide);
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  canvas.width = 0;
  canvas.height = 0;
  return { dataUrl, width, height };
}

export function renderImagesToPdf(container) {
  // The page title, intro and article live in the static HTML page (content/images-to-pdf.html).
  // This file only draws the tool itself.
  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div id="dropzone-area"></div>
      <div id="action-area" class="hidden mt-6 space-y-4"></div>
    </div>
  `;

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  let selectedImages = [];
  const thumbUrls = new Map();

  function thumbFor(file) {
    if (!thumbUrls.has(file)) thumbUrls.set(file, URL.createObjectURL(file));
    return thumbUrls.get(file);
  }

  function dropThumb(file) {
    if (thumbUrls.has(file)) {
      URL.revokeObjectURL(thumbUrls.get(file));
      thumbUrls.delete(file);
    }
  }

  function clearAll() {
    selectedImages.forEach(dropThumb);
    selectedImages = [];
  }

  const dropzone = createDropzone({
    accept: 'image/*',
    multiple: true,
    onFilesSelected: (files) => {
      selectedImages = [...selectedImages, ...[].concat(files)];
      renderList();
    }
  });
  dropzoneArea.appendChild(dropzone);

  function renderList(errorMessage) {
    if (selectedImages.length === 0) {
      actionArea.classList.add('hidden');
      actionArea.innerHTML = '';
      return;
    }

    const last = selectedImages.length - 1;
    const smallBtn = 'w-7 h-7 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:border-teal-500 hover:text-teal-600 disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:text-slate-600 dark:border-slate-600 dark:text-slate-300';

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Selected Photos (${selectedImages.length})</span>
        <button id="btn-clear" type="button" class="text-xs text-rose-600 font-semibold hover:underline">Clear All</button>
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400">Each photo becomes one page, in this order. Use the arrows to change it.</p>

      <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
        ${selectedImages.map((file, idx) => `
          <div class="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs dark:bg-slate-800 dark:border-slate-700">
            <div class="flex items-center gap-2.5 overflow-hidden">
              <img src="${thumbFor(file)}" alt="" class="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
              <div class="overflow-hidden">
                <span class="block font-semibold text-slate-800 truncate dark:text-slate-200">Page ${idx + 1}: ${escapeHtml(file.name)}</span>
                <span class="text-slate-400 font-medium">${formatBytes(file.size)}</span>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button type="button" data-action="up" data-idx="${idx}" class="${smallBtn}" ${idx === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
              <button type="button" data-action="down" data-idx="${idx}" class="${smallBtn}" ${idx === last ? 'disabled' : ''} aria-label="Move down">↓</button>
              <button type="button" data-action="remove" data-idx="${idx}" class="${smallBtn}" aria-label="Remove">✕</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div id="error-box" class="hidden p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold dark:bg-rose-950/40 dark:text-rose-300"></div>

      <button id="btn-convert-pdf" type="button" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Create PDF Document
      </button>
    `;

    if (errorMessage) {
      const box = actionArea.querySelector('#error-box');
      box.textContent = errorMessage;
      box.classList.remove('hidden');
    }

    actionArea.querySelector('#btn-clear').addEventListener('click', () => {
      clearAll();
      renderList();
    });

    actionArea.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const action = btn.getAttribute('data-action');
        if (action === 'remove') {
          dropThumb(selectedImages[idx]);
          selectedImages.splice(idx, 1);
        } else {
          const target = action === 'up' ? idx - 1 : idx + 1;
          if (target < 0 || target > last) return;
          [selectedImages[idx], selectedImages[target]] = [selectedImages[target], selectedImages[idx]];
        }
        renderList();
      });
    });

    const btnConvert = actionArea.querySelector('#btn-convert-pdf');
    btnConvert.addEventListener('click', async () => {
      try {
        btnConvert.disabled = true;
        let pdf = null;

        for (let i = 0; i < selectedImages.length; i++) {
          btnConvert.innerHTML = `Adding photo ${i + 1} of ${selectedImages.length}...`;
          const { dataUrl, width, height } = await imageToJpeg(selectedImages[i]);

          const landscape = width > height;
          const orientation = landscape ? 'l' : 'p';
          if (!pdf) {
            pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4', compress: true });
          } else {
            pdf.addPage('a4', orientation);
          }

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const availW = pageWidth - MARGIN_MM * 2;
          const availH = pageHeight - MARGIN_MM * 2;
          const fit = Math.min(availW / width, availH / height);
          const drawW = width * fit;
          const drawH = height * fit;
          const x = (pageWidth - drawW) / 2;
          const y = (pageHeight - drawH) / 2;

          pdf.addImage(dataUrl, 'JPEG', x, y, drawW, drawH, undefined, 'FAST');
        }

        const pdfBlob = pdf.output('blob');
        const count = selectedImages.length;

        actionArea.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3 dark:bg-slate-800/60 dark:border-slate-800">
            <p class="text-emerald-800 font-bold text-base dark:text-emerald-400">PDF created with ${count} ${count === 1 ? 'page' : 'pages'}</p>
            <p class="text-xs text-slate-600 dark:text-slate-400">PDF size: <span class="font-bold text-emerald-700 dark:text-emerald-400">${formatBytes(pdfBlob.size)}</span></p>
            <button id="btn-download-img-pdf" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download PDF
            </button>
            <button id="btn-edit-list" type="button" class="text-xs font-bold text-slate-500 hover:text-teal-600 dark:text-slate-400">Back to my photos</button>
          </div>
        `;

        actionArea.querySelector('#btn-download-img-pdf').addEventListener('click', () => {
          downloadFile(pdfBlob, 'converted_photos.pdf');
        });
        actionArea.querySelector('#btn-edit-list').addEventListener('click', () => renderList());
      } catch (err) {
        renderList((err && err.message) || 'The PDF could not be created. Please try again.');
      }
    });
  }
}
