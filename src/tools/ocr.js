import { createWorker } from 'tesseract.js';
import { jsPDF } from 'jspdf';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes } from '../utils/fileHelpers.js';

export function renderOcr(container, onBack) {
  let isProcessing = false;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <div class="mb-6">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-md">Smart Lens & Notes</span>
            <span class="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">PDF Export</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">Lens Text Extractor & Notebook</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Extract text with Google Lens precision, edit on lined notebook paper, and download as PDF.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-6"></div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  const dropzone = createDropzone({
    accept: 'image/jpeg,image/png,image/webp,image/jpg',
    onFilesSelected: (file) => handleFileSelection(file)
  });
  dropzoneArea.appendChild(dropzone);

  async function handleFileSelection(file) {
    const previewUrl = URL.createObjectURL(file);

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl">
          🔍
        </div>
        <div class="overflow-hidden flex-1">
          <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Size: <span class="font-bold text-slate-700 dark:text-slate-300">${formatBytes(file.size)}</span></p>
        </div>
      </div>

      <button id="btn-extract-text" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2">
        <span>⚡</span> Scan & Open in Notebook View
      </button>

      <div id="ocr-result-area" class="hidden space-y-6 pt-2"></div>
    `;

    const btnExtract = actionArea.querySelector('#btn-extract-text');
    const resultArea = actionArea.querySelector('#ocr-result-area');

    btnExtract.addEventListener('click', async () => {
      if (isProcessing) return;
      try {
        isProcessing = true;
        btnExtract.disabled = true;
        btnExtract.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Scanning with Lens precision...
        `;

        const worker = await createWorker('eng');
        const ret = await worker.recognize(file);
        await worker.terminate();

        const extractedText = ret.data.text.trim();

        resultArea.classList.remove('hidden');
        resultArea.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <!-- LEFT: Upload Preview -->
            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">📷 Scanned Image</p>
              <img src="${previewUrl}" class="w-full h-auto rounded-xl object-contain max-h-96" alt="Uploaded Document" />
            </div>

            <!-- RIGHT: Lined Notebook Paper View -->
            <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  📝 Lined Notebook View
                </span>
                <div class="flex gap-2">
                  <button id="btn-copy-notes" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                    <span>📋</span> Copy
                  </button>
                  <button id="btn-pdf-notes" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm">
                    <span>📥</span> PDF
                  </button>
                </div>
              </div>

              <!-- Notebook Styled Area -->
              <div class="relative rounded-xl border border-slate-300 dark:border-slate-700 p-4 bg-amber-50/30 dark:bg-slate-950">
                <textarea id="notebook-textarea" rows="12" class="w-full bg-transparent resize-none outline-none font-sans text-slate-800 dark:text-slate-100 text-sm leading-8" style="line-height: 32px; background-image: repeating-linear-gradient(transparent, transparent 31px, rgba(148, 163, 184, 0.3) 32px);">${extractedText}</textarea>
              </div>
            </div>

          </div>
        `;

        const textarea = resultArea.querySelector('#notebook-textarea');
        const btnCopy = resultArea.querySelector('#btn-copy-notes');
        const btnPdf = resultArea.querySelector('#btn-pdf-notes');

        btnCopy.addEventListener('click', () => {
          textarea.select();
          navigator.clipboard.writeText(textarea.value);
          btnCopy.innerHTML = '<span>✅</span> Copied!';
          setTimeout(() => {
            btnCopy.innerHTML = '<span>📋</span> Copy';
          }, 2000);
        });

        btnPdf.addEventListener('click', () => {
          const doc = new jsPDF();
          const splitText = doc.splitTextToSize(textarea.value, 180);
          doc.text(splitText, 15, 20);
          doc.save('Scanned_Notes.pdf');
        });

        btnExtract.disabled = false;
        btnExtract.innerHTML = '<span>⚡</span> Scan Another Image';
        isProcessing = false;

      } catch (err) {
        alert('Scan Error: ' + err.message);
        btnExtract.disabled = false;
        btnExtract.innerHTML = '<span>⚡</span> Scan & Open in Notebook View';
        isProcessing = false;
      }
    });
  }
}
