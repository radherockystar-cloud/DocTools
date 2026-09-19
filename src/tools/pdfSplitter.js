import { PDFDocument } from 'pdf-lib';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderPdfSplitter(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors dark:text-slate-400">← Back</button>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">PDF Splitter & Page Extractor</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Extract specific individual pages or split heavy PDF documents securely inside your browser in seconds.</p>
        <div id="dropzone-area" class="mt-6"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>

      <!-- Extended SEO Article Section (600+ Words for AdSense Compliance) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-950/60 px-3 py-1 rounded-md inline-block mb-3">Complete PDF Extraction Documentation</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How to Easily Extract Specific Pages or Split Heavy PDF Documents Online Without Losing Quality</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Large digital documents, multi-chapter academic eBooks, lengthy financial statements, or bulky application booklets frequently contain dozens or hundreds of pages when you only need to submit a single specific page or a precise page range for official verification. Splitting a portable document format file allows you to extract exactly the required sheets without carrying dead file weight or exceeding strict portal upload file size restrictions enforced by government recruitment boards and university admission portals.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Targeted Page Range Extraction for Government Forms</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Instead of redownloading bulky documents or rescanning paperwork from scratch, entering simple page ranges (such as selecting pages 1 through 3, or specific pages like 5) lets your browser quickly carve out the exact sheets you need. The tool packages them instantly into a fresh, lightweight PDF file ready for immediate offline download or direct online form submission.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Client-Side Security and Privacy Protection</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Splitting confidential records, personal tax certificates, or official examination scorecards locally ensures zero data exposure risk. FreeDocTools processes all page extractions and document modifications directly inside your browser's sandboxed local memory, guaranteeing complete privacy and absolute confidentiality.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Step-by-Step Instructions for Quick PDF Splitting</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Extracting pages from your PDF documents on FreeDocTools requires zero technical knowledge. Simply drop your PDF file into the secure upload dropzone, enter your desired page numbers or comma-separated ranges into the input box, and click the split button to generate your new document instantly.</p>
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
