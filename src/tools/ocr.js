import { createWorker } from 'tesseract.js';
import { jsPDF } from 'jspdf';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes } from '../utils/fileHelpers.js';

export function renderOcr(container, onBack) {
  let isProcessing = false;
  let ocrWords = [];
  let selectedIndices = new Set();
  let naturalW = 1;
  let naturalH = 1;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
        
        <div class="mb-6">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-md">Google Lens Interactive</span>
            <span class="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Select & Export</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">Lens Text Selector & Notebook</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Touch photo to select text directly with Google Lens precision.</p>
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

  function handleFileSelection(file) {
    const previewUrl = URL.createObjectURL(file);
    selectedIndices.clear();
    ocrWords = [];

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
          🔍
        </div>
        <div class="overflow-hidden flex-1">
          <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Size: <span class="font-bold text-slate-700 dark:text-slate-300">${formatBytes(file.size)}</span></p>
        </div>
      </div>

      <button id="btn-scan-lens" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/20 transition-all text-sm flex items-center justify-center gap-2">
        <span>⚡</span> Scan & Enable Touch Selection
      </button>

      <div id="lens-result-area" class="hidden space-y-6 pt-2"></div>
    `;

    const btnScan = actionArea.querySelector('#btn-scan-lens');
    const resultArea = actionArea.querySelector('#lens-result-area');

    btnScan.addEventListener('click', async () => {
      if (isProcessing) return;
      try {
        isProcessing = true;
        btnScan.disabled = true;
        btnScan.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Detecting text coordinates...
        `;

        const worker = await createWorker('eng');
        const ret = await worker.recognize(file);
        await worker.terminate();

        // Filter out solitary symbols and status bar junk
        ocrWords = (ret.data.words || []).filter(w => {
          const t = w.text.trim();
          if (t.length < 2 && !/[0-9a-zA-Z]/.test(t)) return false;
          return true;
        });

        // Pre-select all by default
        ocrWords.forEach((_, idx) => selectedIndices.add(idx));

        renderLensWorkspace(resultArea, previewUrl);
        btnScan.disabled = false;
        btnScan.innerHTML = '<span>⚡</span> Re-Scan Image';
        isProcessing = false;

      } catch (err) {
        alert('OCR Scan Error: ' + err.message);
        btnScan.disabled = false;
        btnScan.innerHTML = '<span>⚡</span> Scan & Enable Touch Selection';
        isProcessing = false;
      }
    });
  }

  function renderLensWorkspace(container, previewUrl) {
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        <!-- LEFT: Google Lens Interactive View -->
        <div class="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔍</span> Touch words to Select/Deselect
            </span>
            <div class="flex gap-2">
              <button id="btn-select-all" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg font-semibold">
                Select All
              </button>
              <button id="btn-clear-all" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg font-semibold">
                Clear
              </button>
            </div>
          </div>

          <div class="relative w-full overflow-hidden rounded-2xl bg-black border border-slate-800 flex justify-center">
            <img id="lens-source-img" src="${previewUrl}" class="w-full h-auto block select-none" alt="Scan document" />
            <div id="lens-overlay" class="absolute inset-0 z-10 pointer-events-auto"></div>
          </div>
        </div>

        <!-- RIGHT: Live Notebook Sheet -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📝</span> Selected Text Notebook
            </span>
            <div class="flex gap-2">
              <button id="btn-copy-selected" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                <span>📋</span> Copy
              </button>
              <button id="btn-pdf-selected" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm">
                <span>📥</span> PDF
              </button>
            </div>
          </div>

          <div class="relative rounded-2xl border border-slate-300 dark:border-slate-700 p-4 bg-amber-50/20 dark:bg-slate-950">
            <textarea id="notebook-textarea" rows="13" class="w-full bg-transparent resize-none outline-none font-sans text-slate-800 dark:text-slate-100 text-sm leading-8" style="line-height: 32px; background-image: repeating-linear-gradient(transparent, transparent 31px, rgba(148, 163, 184, 0.3) 32px);"></textarea>
          </div>
        </div>

      </div>
    `;

    const img = container.querySelector('#lens-source-img');
    const overlay = container.querySelector('#lens-overlay');
    const textarea = container.querySelector('#notebook-textarea');
    const btnCopy = container.querySelector('#btn-copy-selected');
    const btnPdf = container.querySelector('#btn-pdf-selected');
    const btnSelectAll = container.querySelector('#btn-select-all');
    const btnClearAll = container.querySelector('#btn-clear-all');

    img.onload = () => {
      naturalW = img.naturalWidth;
      naturalH = img.naturalHeight;
      buildInteractiveBoxes();
    };

    if (img.complete) {
      naturalW = img.naturalWidth;
      naturalH = img.naturalHeight;
      buildInteractiveBoxes();
    }

    function buildInteractiveBoxes() {
      overlay.innerHTML = '';
      ocrWords.forEach((word, index) => {
        const left = (word.bbox.x0 / naturalW) * 100;
        const top = (word.bbox.y0 / naturalH) * 100;
        const width = ((word.bbox.x1 - word.bbox.x0) / naturalW) * 100;
        const height = ((word.bbox.y1 - word.bbox.y0) / naturalH) * 100;

        const box = document.createElement('div');
        box.className = `lens-box absolute cursor-pointer rounded transition-all select-none ${selectedIndices.has(index) ? 'bg-blue-500/40 border border-blue-400 shadow-sm' : 'hover:bg-white/20'}`;
        box.style.left = `${left}%`;
        box.style.top = `${top}%`;
        box.style.width = `${width}%`;
        box.style.height = `${height}%`;

        box.addEventListener('click', (e) => {
          e.stopPropagation();
          if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
            box.className = 'lens-box absolute cursor-pointer rounded transition-all select-none hover:bg-white/20';
          } else {
            selectedIndices.add(index);
            box.className = 'lens-box absolute cursor-pointer rounded transition-all select-none bg-blue-500/40 border border-blue-400 shadow-sm';
          }
          updateNotebookText();
        });

        overlay.appendChild(box);
      });

      updateNotebookText();
    }

    function updateNotebookText() {
      const selectedWords = [];
      ocrWords.forEach((w, idx) => {
        if (selectedIndices.has(idx)) {
          selectedWords.push(w.text);
        }
      });
      textarea.value = selectedWords.join(' ');
    }

    btnSelectAll.addEventListener('click', () => {
      ocrWords.forEach((_, idx) => selectedIndices.add(idx));
      buildInteractiveBoxes();
    });

    btnClearAll.addEventListener('click', () => {
      selectedIndices.clear();
      buildInteractiveBoxes();
    });

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
      doc.save('Selected_Notes.pdf');
    });
  }
}
