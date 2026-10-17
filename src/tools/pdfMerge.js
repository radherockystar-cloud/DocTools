import { PDFDocument } from 'pdf-lib';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';
import { escapeHtml } from '../utils/dom.js';

export function renderPdfMerge(container) {
  // The page title, intro and article live in the static HTML page (content/pdf-merge.html).
  // This file only draws the tool itself.
  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div id="dropzone-area"></div>
      <div id="action-area" class="hidden mt-6 space-y-4"></div>
    </div>
  `;

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  let selectedFiles = [];

  const dropzone = createDropzone({
    accept: 'application/pdf',
    multiple: true,
    onFilesSelected: (files) => {
      selectedFiles = [...selectedFiles, ...[].concat(files)];
      renderList();
    }
  });
  dropzoneArea.appendChild(dropzone);

  function renderList(errorMessage) {
    if (selectedFiles.length === 0) {
      actionArea.classList.add('hidden');
      actionArea.innerHTML = '';
      return;
    }

    const last = selectedFiles.length - 1;
    const smallBtn = 'w-7 h-7 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:border-amber-500 hover:text-amber-600 disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:text-slate-600 dark:border-slate-600 dark:text-slate-300';

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Selected Files (${selectedFiles.length})</span>
        <button id="btn-clear" type="button" class="text-xs text-rose-600 font-semibold hover:underline">Clear All</button>
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400">The PDFs are merged in this order. Use the arrows to change it.</p>

      <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
        ${selectedFiles.map((file, idx) => `
          <div class="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs dark:bg-slate-800 dark:border-slate-700">
            <div class="flex items-center gap-2 overflow-hidden">
              <span class="font-bold text-slate-400">#${idx + 1}</span>
              <span class="font-semibold text-slate-800 truncate dark:text-slate-200">${escapeHtml(file.name)}</span>
              <span class="font-medium text-slate-500 shrink-0 dark:text-slate-400">${formatBytes(file.size)}</span>
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
      ${selectedFiles.length < 2 ? '<p class="text-xs font-semibold text-amber-700 dark:text-amber-300">Add at least 2 PDF files to merge.</p>' : ''}

      <button id="btn-merge" type="button" ${selectedFiles.length < 2 ? 'disabled' : ''} class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-amber-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Merge ${selectedFiles.length} PDFs
      </button>
    `;

    if (errorMessage) {
      const box = actionArea.querySelector('#error-box');
      box.textContent = errorMessage;
      box.classList.remove('hidden');
    }

    actionArea.querySelector('#btn-clear').addEventListener('click', () => {
      selectedFiles = [];
      renderList();
    });

    actionArea.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const action = btn.getAttribute('data-action');
        if (action === 'remove') {
          selectedFiles.splice(idx, 1);
        } else {
          const target = action === 'up' ? idx - 1 : idx + 1;
          if (target < 0 || target > last) return;
          [selectedFiles[idx], selectedFiles[target]] = [selectedFiles[target], selectedFiles[idx]];
        }
        renderList();
      });
    });

    const btnMerge = actionArea.querySelector('#btn-merge');
    btnMerge.addEventListener('click', async () => {
      if (selectedFiles.length < 2) return;

      try {
        btnMerge.disabled = true;
        btnMerge.innerHTML = 'Merging PDFs... Please wait';

        const mergedPdf = await PDFDocument.create();

        for (const file of selectedFiles) {
          const fileBuffer = await readFileAsArrayBuffer(file);
          let pdf;
          try {
            pdf = await PDFDocument.load(fileBuffer);
          } catch (loadErr) {
            if (/encrypt|password/i.test(String(loadErr && (loadErr.name + loadErr.message)))) {
              throw new Error(`"${file.name}" is password protected. Remove the password first, then try again.`);
            }
            throw new Error(`"${file.name}" could not be read as a PDF.`);
          }
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const count = selectedFiles.length;
        const pageCount = mergedPdf.getPageCount();

        actionArea.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3 dark:bg-slate-800/60 dark:border-slate-800">
            <p class="text-emerald-800 font-bold text-base dark:text-emerald-400">${count} PDFs merged into ${pageCount} pages</p>
            <p class="text-xs text-slate-600 dark:text-slate-400">Merged size: <span class="font-bold text-emerald-700 dark:text-emerald-400">${formatBytes(mergedBlob.size)}</span></p>
            <button id="btn-download-merged" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download Merged PDF
            </button>
            <button id="btn-start-over" type="button" class="text-xs font-bold text-slate-500 hover:text-amber-600 dark:text-slate-400">Merge different files</button>
          </div>
        `;

        actionArea.querySelector('#btn-download-merged').addEventListener('click', () => {
          downloadFile(mergedBlob, 'merged_document.pdf');
        });
        actionArea.querySelector('#btn-start-over').addEventListener('click', () => {
          selectedFiles = [];
          renderList();
        });
      } catch (err) {
        renderList((err && err.message) || 'Merge failed. Please try again.');
      }
    });
  }
}
