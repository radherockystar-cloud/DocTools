import { PDFDocument } from 'pdf-lib';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderPdfSplitter(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">← Back</button>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h1 class="text-2xl font-extrabold text-slate-900">PDF Splitter</h1>
        <p class="text-sm text-slate-500 mt-1">Extract specific pages or split PDF into separate files.</p>
        <div id="dropzone-area" class="mt-6"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', onBack);
  const dropzone = createDropzone({ accept: 'application/pdf', onFilesSelected: (file) => handleFile(file) });
  container.querySelector('#dropzone-area').appendChild(dropzone);

  async function handleFile(file) {
    const actionArea = container.querySelector('#action-area');
    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="p-4 bg-slate-50 rounded-xl text-sm font-semibold text-slate-700">File: ${file.name}</div>
      <div class="flex gap-2">
        <input type="text" id="page-range" placeholder="e.g. 1-3, 5" class="w-full p-3 border rounded-xl" />
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
        
        // Simple Logic: Extract requested pages
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
