import { PDFDocument } from 'pdf-lib';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderPdfMerge(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors dark:text-slate-400">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md dark:bg-amber-950/40">PDF Utility</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 dark:text-white">Merge Multiple PDFs</h1>
          <p class="text-sm text-slate-500 mt-1 dark:text-slate-400">Combine two or more PDF files into a single document in seconds.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">PDF Management Guide</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How to Combine Multiple PDF Files and Marksheets Into a Single Document</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When applying for higher education admissions, government jobs, or professional certifications, candidates are frequently required to upload all academic marksheets, degree certificates, and identity proofs as a single unified PDF file rather than multiple separate attachments. Merging scattered files together keeps your application organized and ensures automated portal checkers evaluate your complete document set without throwing missing file errors.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Maintaining Sequence and Page Order</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A major challenge when joining PDFs is ensuring pages appear in the correct chronological or logical order — such as placing 10th marksheet first, followed by 12th marksheet and graduation certificates. A reliable browser-based merger lets you track and review your selected files instantly before stitching them together.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Client-Side Privacy Protection</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because marksheets and identity cards contain private personal data, uploading them to third-party web servers introduces security risks. FreeDocTools executes all document merging operations locally inside your browser memory using robust client-side libraries, guaranteeing complete confidentiality.</p>
        </div>
      </article>
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
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Selected Files (${selectedFiles.length})</span>
        <button id="btn-clear" class="text-xs text-rose-600 font-semibold hover:underline">Clear All</button>
      </div>

      <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
        ${selectedFiles.map((file, idx) => `
          <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs dark:bg-slate-800 dark:border-slate-700">
            <div class="flex items-center gap-2 overflow-hidden">
              <span class="font-bold text-slate-400">#${idx + 1}</span>
              <span class="font-semibold text-slate-800 truncate dark:text-slate-200">${file.name}</span>
            </div>
            <span class="font-medium text-slate-500 shrink-0 dark:text-slate-400">${formatBytes(file.size)}</span>
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
          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3 dark:bg-slate-800/60 dark:border-slate-800">
            <p class="text-emerald-800 font-bold text-base dark:text-emerald-400">All ${selectedFiles.length} PDFs Merged Successfully!</p>
            <p class="text-xs text-slate-600 dark:text-slate-400">Total Merged Size: <span class="font-bold text-emerald-700 dark:text-emerald-400">${formatBytes(mergedBlob.size)}</span></p>
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
