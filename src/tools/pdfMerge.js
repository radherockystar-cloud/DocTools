import { PDFDocument } from 'pdf-lib';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderPdfMerge(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">PDF Utility</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Merge Multiple PDFs</h1>
          <p class="text-sm text-slate-500 mt-1">Combine two or more PDF files into a single document in seconds.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  let selectedFiles = [];

  const dropzone = createDropzone({
    accept: 'application/pdf',
    multiple: true,
    onFilesSelected: (files) => {
      selectedFiles = [...selectedFiles, ...files];
      renderList();
    }
  });
  dropzoneArea.appendChild(dropzone);

  function renderList() {
    if (selectedFiles.length === 0) {
      actionArea.classList.add('hidden');
      return;
    }

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Selected Files (${selectedFiles.length})</span>
        <button id="btn-clear" class="text-xs text-rose-600 font-semibold hover:underline">Clear All</button>
      </div>

      <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
        ${selectedFiles.map((file, idx) => `
          <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div class="flex items-center gap-2 overflow-hidden">
              <span class="font-bold text-slate-400">#${idx + 1}</span>
              <span class="font-semibold text-slate-800 truncate">${file.name}</span>
            </div>
            <span class="font-medium text-slate-500 shrink-0">${formatBytes(file.size)}</span>
          </div>
        `).join('')}
      </div>

      <button id="btn-merge" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-amber-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Merge ${selectedFiles.length} PDFs
      </button>
    `;

    actionArea.querySelector('#btn-clear').addEventListener('click', () => {
      selectedFiles = [];
      renderList();
    });

    const btnMerge = actionArea.querySelector('#btn-merge');
    btnMerge.addEventListener('click', async () => {
      if (selectedFiles.length < 2) {
        alert('Please select at least 2 PDF files to merge.');
        return;
      }

      try {
        btnMerge.disabled = true;
        btnMerge.innerHTML = 'Merging PDFs... Please wait';

        const mergedPdf = await PDFDocument.create();

        for (const file of selectedFiles) {
          const fileBuffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

        actionArea.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3">
            <p class="text-emerald-800 font-bold text-base">All ${selectedFiles.length} PDFs Merged Successfully!</p>
            <p class="text-xs text-slate-600">Total Merged Size: <span class="font-bold text-emerald-700">${formatBytes(mergedBlob.size)}</span></p>
            <button id="btn-download-merged" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download Merged PDF
            </button>
          </div>
        `;

        actionArea.querySelector('#btn-download-merged').addEventListener('click', () => {
          downloadFile(mergedBlob, 'merged_document.pdf');
        });

      } catch (err) {
        alert('Merge failed: ' + err.message);
        btnMerge.disabled = false;
        btnMerge.innerHTML = '⚡ Merge PDFs';
      }
    });
  }
}
