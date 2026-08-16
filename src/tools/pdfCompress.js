import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

// Setup Robust Worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@legacy/build/pdf.worker.min.js';
}

export function renderPdfCompress(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">Smart PDF Engine</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Compress PDF Document</h1>
          <p class="text-sm text-slate-500 mt-1">Shrink heavy PDF files up to 85% with crystal clear text & image quality.</p>
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
    accept: 'application/pdf',
    onFilesSelected: (file) => handleFile(file)
  });
  dropzoneArea.appendChild(dropzone);

  let currentFile = null;
  let selectedMode = 'recommended';

  async function handleFile(file) {
    currentFile = file;

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-2xl">📄</div>
        <div class="overflow-hidden">
          <p class="font-semibold text-slate-800 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500">Original Size: <span class="font-bold text-slate-700">${formatBytes(file.size)}</span></p>
        </div>
      </div>

      <!-- Compression Level Selection -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Compression Level</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button type="button" data-mode="recommended" class="mode-btn text-left p-3.5 border-2 border-rose-600 bg-rose-50/70 rounded-2xl transition-all">
            <span class="block font-bold text-sm text-rose-950">⚡ Recommended (HD)</span>
            <span class="block text-[11px] text-rose-700 font-medium mt-1">70%–85% Smaller (Clear & Sharp)</span>
          </button>

          <button type="button" data-mode="extreme" class="mode-btn text-left p-3.5 border-2 border-slate-200 bg-white rounded-2xl transition-all hover:border-rose-400">
            <span class="block font-bold text-sm text-slate-800">🔥 Maximum Small</span>
            <span class="block text-[11px] text-slate-500 font-medium mt-1">90%+ Smaller (Govt Forms &lt;200KB)</span>
          </button>

          <button type="button" data-mode="basic" class="mode-btn text-left p-3.5 border-2 border-slate-200 bg-white rounded-2xl transition-all hover:border-rose-400">
            <span class="block font-bold text-sm text-slate-800">🔒 Fast Stream Clean</span>
            <span class="block text-[11px] text-slate-500 font-medium mt-1">Light Metadata & Code Cleanup</span>
          </button>

        </div>
      </div>

      <button id="btn-compress-pdf" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Compress PDF Now
      </button>

      <div id="compress-result" class="hidden"></div>
    `;

    const modeBtns = actionArea.querySelectorAll('.mode-btn');
    const btnCompress = actionArea.querySelector('#btn-compress-pdf');
    const compressResult = actionArea.querySelector('#compress-result');

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => {
          b.classList.remove('border-rose-600', 'bg-rose-50/70');
          b.classList.add('border-slate-200', 'bg-white');
          b.querySelector('span:first-child').classList.remove('text-rose-950');
          b.querySelector('span:first-child').classList.add('text-slate-800');
          b.querySelector('span:last-child').classList.remove('text-rose-700');
          b.querySelector('span:last-child').classList.add('text-slate-500');
        });

        btn.classList.add('border-rose-600', 'bg-rose-50/70');
        btn.classList.remove('border-slate-200', 'bg-white');
        btn.querySelector('span:first-child').classList.add('text-rose-950');
        btn.querySelector('span:first-child').classList.remove('text-slate-800');
        btn.querySelector('span:last-child').classList.add('text-rose-700');
        btn.querySelector('span:last-child').classList.remove('text-slate-500');

        selectedMode = btn.getAttribute('data-mode');
      });
    });

    btnCompress.addEventListener('click', async () => {
      try {
        btnCompress.disabled = true;
        btnCompress.innerHTML = 'Optimizing Pages... Please wait';

        const arrayBuffer = await readFileAsArrayBuffer(currentFile);
        let compressedBlob = null;

        if (selectedMode === 'basic') {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
          compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
        } else {
          const typedarray = new Uint8Array(arrayBuffer);
          const loadingTask = pdfjsLib.getDocument({ data: typedarray });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          // Highly optimized scale & quality parameters
          const scale = selectedMode === 'extreme' ? 0.95 : 1.15;
          const quality = selectedMode === 'extreme' ? 0.50 : 0.70;

          let doc = null;

          for (let i = 1; i <= numPages; i++) {
            btnCompress.innerHTML = `Compressing Page ${i} of ${numPages}...`;
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            canvas.width = Math.round(viewport.width);
            canvas.height = Math.round(viewport.height);
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            await page.render({ canvasContext: ctx, viewport }).promise;

            const imgData = canvas.toDataURL('image/jpeg', quality);
            const orientation = viewport.width > viewport.height ? 'l' : 'p';
            const ptWidth = (viewport.width / scale) * 0.75;
            const ptHeight = (viewport.height / scale) * 0.75;

            if (i === 1) {
              doc = new jsPDF({
                orientation,
                unit: 'pt',
                format: [ptWidth, ptHeight],
                compress: true
              });
              doc.addImage(imgData, 'JPEG', 0, 0, ptWidth, ptHeight, undefined, 'FAST');
            } else {
              doc.addPage([ptWidth, ptHeight], orientation);
              doc.addImage(imgData, 'JPEG', 0, 0, ptWidth, ptHeight, undefined, 'FAST');
            }
          }

          compressedBlob = doc.output('blob');
        }

        const originalBaseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
        const savedPercent = Math.max(0, Math.round(((currentFile.size - compressedBlob.size) / currentFile.size) * 100));

        compressResult.classList.remove('hidden');
        compressResult.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase text-emerald-800">PDF Successfully Compressed!</span>
              ${savedPercent > 0 ? `<span class="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Reduced by ${savedPercent}%</span>` : ''}
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-emerald-100">
              <div>
                <p class="text-slate-400 font-semibold">Original Size</p>
                <p class="text-slate-800 font-bold mt-0.5">${formatBytes(currentFile.size)}</p>
              </div>
              <div>
                <p class="text-emerald-700 font-semibold">Compressed Size</p>
                <p class="text-emerald-900 font-bold mt-0.5">${formatBytes(compressedBlob.size)}</p>
              </div>
            </div>

            <button id="btn-download-pdf" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download Compressed PDF (${formatBytes(compressedBlob.size)})
            </button>
          </div>
        `;

        compressResult.querySelector('#btn-download-pdf').addEventListener('click', () => {
          downloadFile(compressedBlob, `${originalBaseName}_compressed.pdf`);
        });

        btnCompress.disabled = false;
        btnCompress.innerHTML = '⚡ Compress Again';

      } catch (err) {
        alert('PDF compression error: ' + err.message);
        btnCompress.disabled = false;
        btnCompress.innerHTML = '⚡ Compress PDF Now';
      }
    });
  }
}
