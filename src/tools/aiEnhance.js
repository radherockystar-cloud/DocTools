import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL, readFileAsArrayBuffer } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

// Safe Worker Configuration
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@legacy/build/pdf.worker.min.js';
} catch (e) {
  console.warn('PDF Worker fallback initialized');
}

export function renderAiEnhance(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="mb-6">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">AI Super Engine</span>
            <span class="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">₹3 / Enhancement</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">AI Photo & Document Clarifier</h1>
          <p class="text-sm text-slate-500 mt-1">Turn blurry photos, old bills & low-res PDFs into crystal clear HDR quality.</p>
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
    accept: 'image/*,application/pdf',
    onFilesSelected: (file) => handleFile(file)
  });
  dropzoneArea.appendChild(dropzone);

  let currentFile = null;

  async function handleFile(file) {
    currentFile = file;
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div class="w-12 h-12 rounded-xl ${isPdf ? 'bg-rose-100 text-rose-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center font-bold text-2xl">
          ${isPdf ? '📄' : '🖼️'}
        </div>
        <div class="overflow-hidden">
          <p class="font-semibold text-slate-800 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500">Original Size: <span class="font-bold text-slate-700">${formatBytes(file.size)}</span> • Type: <span class="font-bold uppercase text-purple-700">${isPdf ? 'PDF Document' : 'Photo Image'}</span></p>
        </div>
      </div>

      <button id="btn-process-ai" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ✨ Enhance to Ultra HDR with AI
      </button>

      <div id="ai-result" class="hidden space-y-5"></div>
    `;

    const btnProcess = actionArea.querySelector('#btn-process-ai');
    const aiResult = actionArea.querySelector('#ai-result');

    btnProcess.addEventListener('click', async () => {
      try {
        btnProcess.disabled = true;
        btnProcess.innerHTML = 'AI Neural Processing... Please wait';

        if (isPdf) {
          await processPdfWithAi(file, aiResult, btnProcess);
        } else {
          await processImageWithAi(file, aiResult, btnProcess);
        }

      } catch (err) {
        alert('AI Enhancement Error: ' + err.message);
        btnProcess.disabled = false;
        btnProcess.innerHTML = '✨ Enhance to Ultra HDR with AI';
      }
    });
  }

  async function processImageWithAi(file, aiResult, btnProcess) {
    const base64Data = await readFileAsDataURL(file);

    const res = await fetch('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data, scale: 2, face_enhance: true })
    });

    const data = await res.json();
    if (!data.success || !data.output) {
      throw new Error(data.error || 'Failed to generate enhanced image');
    }

    renderComparisonView(aiResult, base64Data, data.output, false, file.name);
    btnProcess.disabled = false;
    btnProcess.innerHTML = '✨ Enhance Another';
  }

  async function processPdfWithAi(file, aiResult, btnProcess) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const typedarray = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
    const numPages = pdf.numPages;

    let doc = null;
    let firstPageOriginal = null;
    let firstPageEnhanced = null;

    for (let i = 1; i <= numPages; i++) {
      btnProcess.innerHTML = `AI Enhancing Page ${i} of ${numPages}...`;
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      const pageBase64 = canvas.toDataURL('image/jpeg', 0.85);

      if (i === 1) firstPageOriginal = pageBase64;

      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: pageBase64, scale: 2, face_enhance: false })
      });

      const data = await res.json();
      const enhancedImgUrl = data.output || pageBase64;
      if (i === 1) firstPageEnhanced = enhancedImgUrl;

      const ptWidth = (viewport.width / 1.5) * 0.75;
      const ptHeight = (viewport.height / 1.5) * 0.75;
      const orientation = viewport.width > viewport.height ? 'l' : 'p';

      if (i === 1) {
        doc = new jsPDF({ orientation, unit: 'pt', format: [ptWidth, ptHeight], compress: true });
        doc.addImage(enhancedImgUrl, 'JPEG', 0, 0, ptWidth, ptHeight, undefined, 'FAST');
      } else {
        doc.addPage([ptWidth, ptHeight], orientation);
        doc.addImage(enhancedImgUrl, 'JPEG', 0, 0, ptWidth, ptHeight, undefined, 'FAST');
      }
    }

    const finalPdfBlob = doc.output('blob');
    renderComparisonView(aiResult, firstPageOriginal, firstPageEnhanced, true, file.name, finalPdfBlob);
    btnProcess.disabled = false;
    btnProcess.innerHTML = '✨ Enhance Another';
  }

  function renderComparisonView(container, beforeSrc, afterSrc, isPdf, originalName, pdfBlob = null) {
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl text-white space-y-4 border border-slate-800">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">✨ AI Enhancement Complete</span>
          <span class="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">Preview Ready</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold text-slate-400 uppercase">Original (Blur)</p>
            <div class="h-44 sm:h-56 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700">
              <img src="${beforeSrc}" class="w-full h-full object-contain" />
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-[11px] font-semibold text-emerald-400 uppercase">AI Ultra HDR</p>
            <div class="h-44 sm:h-56 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-emerald-500/40 relative">
              <img src="${afterSrc}" class="w-full h-full object-contain" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <span class="text-[10px] font-black uppercase text-white/40 tracking-widest rotate-[-25deg]">DocTools AI Preview</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-white">Unlock Full HD (No Watermark)</p>
              <p class="text-[11px] text-slate-400">One-time micro payment for this file</p>
            </div>
            <span class="text-base font-extrabold text-amber-400">₹3.00</span>
          </div>

          <button id="btn-unlock-hd" class="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
            ⚡ Pay ₹3 via UPI & Download HD
          </button>
        </div>
      </div>
    `;

    const btnUnlock = container.querySelector('#btn-unlock-hd');
    btnUnlock.addEventListener('click', async () => {
      btnUnlock.disabled = true;
      btnUnlock.innerHTML = 'Downloading HD File...';

      const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

      if (isPdf && pdfBlob) {
        downloadFile(pdfBlob, `${baseName}_AI_HDR.pdf`);
      } else {
        const imageRes = await fetch(afterSrc);
        const imageBlob = await imageRes.blob();
        downloadFile(imageBlob, `${baseName}_AI_HDR.jpg`);
      }

      btnUnlock.innerHTML = '✅ Downloaded Successfully';
      setTimeout(() => {
        btnUnlock.disabled = false;
        btnUnlock.innerHTML = '⚡ Pay ₹3 via UPI & Download HD';
      }, 2500);
    });
  }
}
