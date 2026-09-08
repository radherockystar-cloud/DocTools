import { jsPDF } from 'jspdf';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderImagesToPdf(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors dark:text-slate-400">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md dark:bg-teal-950/40">PDF Utility</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 dark:text-white">Convert Images to PDF</h1>
          <p class="text-sm text-slate-500 mt-1 dark:text-slate-400">Convert multiple JPG, PNG photos into a clean printable PDF document.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">PDF Conversion Guide</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How to Convert and Combine Multiple Images Into a Single Printable PDF Document</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When submitting scanned marksheets, handwritten assignment pages, or identification certificates for official verification, single image files are often rejected. Most institutional and government portals require documents to be bundled into a unified multi-page PDF format. Converting separate gallery photos into a single structured PDF keeps your documents organized, pages correctly sequenced, and fully printable on standard A4 paper without quality loss.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Why PDF is the Universal Standard for Documents</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Unlike image formats that can open differently across various mobile viewers and operating systems, Portable Document Format (PDF) locks page dimensions and layout in place. When you combine multiple scanned certificates or marksheets into a single PDF, the reviewer sees them in the exact order you arranged, preventing pages from getting misplaced or viewed out of sequence.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Secure, Client-Side PDF Generation</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Combining personal marksheets or confidential paperwork online usually raises privacy concerns. FreeDocTools processes your images entirely inside your browser memory using native client-side libraries. Your files are never uploaded or stored on any external server, ensuring complete confidentiality from the moment you select your photos to the final PDF download.</p>
        </div>
      </article>
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
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Selected Photos (${selectedImages.length})</span>
        <button id="btn-clear" class="text-xs text-rose-600 font-semibold hover:underline">Clear All</button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
        ${selectedImages.map((file, idx) => `
          <div class="relative p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs overflow-hidden dark:bg-slate-800 dark:border-slate-700">
            <span class="font-bold text-slate-500 mb-1 block truncate dark:text-slate-300">Page ${idx + 1}: ${file.name}</span>
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
          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3 dark:bg-slate-800/60 dark:border-slate-800">
            <p class="text-emerald-800 font-bold text-base dark:text-emerald-400">PDF Created with ${selectedImages.length} Pages!</p>
            <p class="text-xs text-slate-600 dark:text-slate-400">Total PDF Size: <span class="font-bold text-emerald-700 dark:text-emerald-400">${formatBytes(pdfBlob.size)}</span></p>
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
