import { jsPDF } from 'jspdf';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderImagesToPdf(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">PDF Utility</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Convert Images to PDF</h1>
          <p class="text-sm text-slate-500 mt-1">Convert multiple JPG, PNG photos into a clean printable PDF document.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  let selectedImages = [];

  const dropzone = createDropzone({
    accept: 'image/*',
    multiple: true,
    onFilesSelected: (files) => {
      selectedImages = [...selectedImages, ...files];
      renderList();
    }
  });
  dropzoneArea.appendChild(dropzone);

  function renderList() {
    if (selectedImages.length === 0) {
      actionArea.classList.add('hidden');
      return;
    }

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Selected Photos (${selectedImages.length})</span>
        <button id="btn-clear" class="text-xs text-rose-600 font-semibold hover:underline">Clear All</button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
        ${selectedImages.map((file, idx) => `
          <div class="relative p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs overflow-hidden">
            <span class="font-bold text-slate-500 mb-1 block truncate">Page ${idx + 1}: ${file.name}</span>
            <span class="text-slate-400 font-medium">${formatBytes(file.size)}</span>
          </div>
        `).join('')}
      </div>

      <button id="btn-convert-pdf" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Create PDF Document
      </button>
    `;

    actionArea.querySelector('#btn-clear').addEventListener('click', () => {
      selectedImages = [];
      renderList();
    });

    const btnConvert = actionArea.querySelector('#btn-convert-pdf');
    btnConvert.addEventListener('click', async () => {
      try {
        btnConvert.disabled = true;
        btnConvert.innerHTML = 'Generating PDF... Please wait';

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < selectedImages.length; i++) {
          if (i > 0) pdf.addPage();
          const dataUrl = await readFileAsDataURL(selectedImages[i]);
          pdf.addImage(dataUrl, 'JPEG', 10, 10, pageWidth - 20, pageHeight - 20, undefined, 'FAST');
        }

        const pdfBlob = pdf.output('blob');

        actionArea.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3">
            <p class="text-emerald-800 font-bold text-base">PDF Created with ${selectedImages.length} Pages!</p>
            <p class="text-xs text-slate-600">Total PDF Size: <span class="font-bold text-emerald-700">${formatBytes(pdfBlob.size)}</span></p>
            <button id="btn-download-img-pdf" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download Created PDF
            </button>
          </div>
        `;

        actionArea.querySelector('#btn-download-img-pdf').addEventListener('click', () => {
          downloadFile(pdfBlob, 'converted_photos.pdf');
        });

      } catch (err) {
        alert('Failed to generate PDF: ' + err.message);
        btnConvert.disabled = false;
        btnConvert.innerHTML = '⚡ Create PDF Document';
      }
    });
  }
}
