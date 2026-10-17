import { PDFDocument } from 'pdf-lib';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';
import { escapeHtml } from '../utils/dom.js';
import { parsePageRanges } from '../utils/pageRange.js';

export function renderPdfSplitter(container) {
  // The page title, intro and article live in the static HTML page (content/pdf-splitter.html).
  // This file only draws the tool itself.
  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div id="dropzone-area"></div>
      <div id="action-area" class="hidden mt-6 space-y-4"></div>
    </div>
  `;

  const actionArea = container.querySelector('#action-area');
  const dropzone = createDropzone({ accept: 'application/pdf', onFilesSelected: (file) => handleFile([].concat(file)[0]) });
  container.querySelector('#dropzone-area').appendChild(dropzone);

  async function handleFile(file) {
    if (!file) return;
    actionArea.classList.remove('hidden');
    actionArea.innerHTML = '<div class="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold dark:bg-blue-950/40 dark:text-blue-300">Reading PDF...</div>';

    let sourceDoc;
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      sourceDoc = await PDFDocument.load(arrayBuffer);
    } catch (err) {
      const protectedPdf = /encrypt|password/i.test(String(err && (err.name + err.message)));
      actionArea.innerHTML = '<div id="load-error" class="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold dark:bg-rose-950/40 dark:text-rose-300"></div>';
      actionArea.querySelector('#load-error').textContent = protectedPdf
        ? 'This PDF is password protected. Remove the password first, then try again.'
        : 'This file could not be read as a PDF.';
      return;
    }

    const pageCount = sourceDoc.getPageCount();
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'document';

    actionArea.innerHTML = `
      <div class="p-4 bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <span class="block truncate">${escapeHtml(file.name)}</span>
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${pageCount} ${pageCount === 1 ? 'page' : 'pages'} · ${formatBytes(file.size)}</span>
      </div>
      <div>
        <label for="page-range" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300">Pages to extract</label>
        <input type="text" id="page-range" inputmode="numeric" placeholder="e.g. 1-3, 5" class="w-full p-3 border border-slate-300 rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
        <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Use commas and dashes. Example: <strong>1-3, 5, 8-</strong> gives pages 1, 2, 3, 5 and 8 to the end. Pages are saved in the order you type them.</p>
      </div>
      <div id="error-box" class="hidden p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold dark:bg-rose-950/40 dark:text-rose-300"></div>
      <button id="btn-split" type="button" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm">✂ Extract Pages</button>
      <div id="result" class="hidden mt-2"></div>
    `;

    const btn = actionArea.querySelector('#btn-split');
    const errorBox = actionArea.querySelector('#error-box');
    const result = actionArea.querySelector('#result');

    btn.addEventListener('click', async () => {
      errorBox.classList.add('hidden');
      result.classList.add('hidden');

      let indexes;
      try {
        indexes = parsePageRanges(actionArea.querySelector('#page-range').value, pageCount);
      } catch (err) {
        errorBox.textContent = err.message;
        errorBox.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Extracting...';
      try {
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourceDoc, indexes);
        copiedPages.forEach((p) => newPdf.addPage(p));

        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });

        result.classList.remove('hidden');
        result.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-3 dark:bg-slate-800/60 dark:border-slate-800">
            <p class="text-emerald-800 font-bold text-sm dark:text-emerald-400">${indexes.length} ${indexes.length === 1 ? 'page' : 'pages'} extracted (${formatBytes(blob.size)})</p>
            <button id="dwn" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">⬇ Download PDF</button>
          </div>
        `;
        result.querySelector('#dwn').addEventListener('click', () => downloadFile(blob, `${baseName}_pages.pdf`));
      } catch (err) {
        errorBox.textContent = 'Extraction failed: ' + ((err && err.message) || 'unknown error');
        errorBox.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.textContent = '✂ Extract Pages';
      }
    });
  }
}
