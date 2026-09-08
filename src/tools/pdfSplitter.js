import { PDFDocument } from 'pdf-lib';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderPdfSplitter(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors dark:text-slate-400">← Back</button>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">PDF Splitter</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Extract specific pages or split PDF into separate files.</p>
        <div id="dropzone-area" class="mt-6"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">PDF Extraction Guide</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How to Extract Specific Pages or Split Heavy PDF Documents Online</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Large digital documents, multi-chapter eBooks, or bulky application booklets often contain dozens of pages when you only need to submit a single specific page or a precise page range. Splitting a PDF allows you to extract exactly the pages required without carrying dead weight or exceeding portal file size restrictions.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Targeted Page Extraction</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Instead of redownloading or scanning documents again, entering simple page ranges (such as 1-3, 5) lets your browser quickly carve out the exact sheets you need, packaging them instantly into a fresh, lightweight PDF file ready for immediate download.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Client-Side Security & Privacy</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Splitting confidential records or exam certificates locally ensures zero data exposure. FreeDocTools processes all page extractions directly inside your browser memory, guaranteeing complete privacy.</p>
        </div>
      </article>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', onBack);
  const dropzone = createDropzone({ accept: 'application/pdf', onFilesSelected: (file) => handleFile(file) });
  container.querySelector('#dropzone-area').appendChild(dropzone);

  async function handleFile(file) {
    const actionArea = container.querySelector('#action-area');
    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="p-4 bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">File: ${file.name}</div>
      <div class="flex gap-2">
        <input type="text" id="page-range" placeholder="e.g. 1-3, 5" class="w-full p-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
      </div>
      <button id="btn-split" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">✂ Split PDF</button>
      <div id="result" class="hidden mt-4"></div>
    `;

    actionArea.querySelector('#btn-split').addEventListener('click', async () => {
      const range = actionArea.querySelector('#page-range').value;
      const btn = actionArea.querySelector('#btn-split');
      btn.disabled = true;
      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const newPdf = await PDFDocument.create();
        
        const pages = range.split(',').map(p => parseInt(p.trim()) - 1);
        const copiedPages = await newPdf.copyPages(pdfDoc, pages);
        copiedPages.forEach(p => newPdf.addPage(p));
        
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        const res = actionArea.querySelector('#result');
        res.classList.remove('hidden');
        res.innerHTML = `<button id="dwn" class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">⬇ Download Split PDF</button>`;
        res.querySelector('#dwn').addEventListener('click', () => downloadFile(blob, "split_result.pdf"));
        btn.innerHTML = 'Done!';
      } catch (e) { alert('Split failed: ' + e.message); btn.disabled = false; }
    });
  }
}
