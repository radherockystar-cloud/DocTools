import { jsPDF } from 'jspdf';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';
import { createComparisonSlider } from '../components/ComparisonSlider.js';
import { showPaymentModal } from '../components/PaymentModal.js';
import { saveOrder, getLatestPendingOrder, clearOrder } from '../utils/orderStorage.js';

export function renderAiEnhance(container, onBack) {
  let selectedMode = 'photo'; // 'photo' or 'pdf'
  let currentFile = null;

  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <!-- Recovery Banner (If app crashed earlier) -->
      <div id="recovery-banner" class="hidden mb-6 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between text-amber-300 text-xs">
        <div>
          <p class="font-bold">⚠️ Unsaved 4K File Recovered</p>
          <p class="text-[11px] text-amber-400/80">Your previously processed file is ready for download.</p>
        </div>
        <button id="btn-recover-download" class="bg-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs">
          Download Now
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-1 rounded-md">AI Neural Super-Engine</span>
            <span class="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded" id="price-badge">₹3 / Photo</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">AI Ultra Clarifier & HDR Upscaler</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Remini-grade 4K AI enhancement for photos & documents up to 100MB.</p>
        </div>

        <!-- 2 Main Option Cards (Photo vs PDF) -->
        <div class="grid grid-cols-2 gap-3.5 mb-6">
          <div id="tab-photo" class="mode-tab cursor-pointer border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm">
            <span class="text-3xl mb-1.5">🖼️</span>
            <span class="font-extrabold text-sm text-slate-900 dark:text-white">AI Photo 4K</span>
            <span class="text-[11px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">₹3 • Selfies, Portraits</span>
          </div>

          <div id="tab-pdf" class="mode-tab cursor-pointer border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all opacity-70 hover:opacity-100">
            <span class="text-3xl mb-1.5">📄</span>
            <span class="font-extrabold text-sm text-slate-900 dark:text-white">AI PDF & Doc</span>
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">₹5 • Marksheets, Scans</span>
          </div>
        </div>

        <!-- Dropzone Box -->
        <div id="dropzone-area"></div>
        
        <!-- Action Area -->
        <div id="action-area" class="hidden mt-6 space-y-6"></div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const tabPhoto = container.querySelector('#tab-photo');
  const tabPdf = container.querySelector('#tab-pdf');
  const priceBadge = container.querySelector('#price-badge');
  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');
  const recoveryBanner = container.querySelector('#recovery-banner');
  const btnRecover = container.querySelector('#btn-recover-download');

  // Check for recovered session from crash
  getLatestPendingOrder().then(order => {
    if (order && order.outputUrl) {
      recoveryBanner.classList.remove('hidden');
      btnRecover.addEventListener('click', () => {
        downloadFinalFile(order.outputUrl, order.fileName, order.fileType === 'pdf');
        clearOrder(order.id);
        recoveryBanner.classList.add('hidden');
      });
    }
  });

  function renderDropzone() {
    dropzoneArea.innerHTML = '';
    const dropzone = createDropzone({
      accept: selectedMode === 'photo' ? 'image/jpeg,image/png,image/webp,image/jpg' : 'application/pdf,image/*',
      onFilesSelected: (file) => handleFileSelection(file)
    });
    dropzoneArea.appendChild(dropzone);
  }

  tabPhoto.addEventListener('click', () => {
    selectedMode = 'photo';
    priceBadge.textContent = '₹3 / Photo';
    tabPhoto.className = 'mode-tab cursor-pointer border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm';
    tabPdf.className = 'mode-tab cursor-pointer border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all opacity-70 hover:opacity-100';
    actionArea.classList.add('hidden');
    renderDropzone();
  });

  tabPdf.addEventListener('click', () => {
    selectedMode = 'pdf';
    priceBadge.textContent = '₹5 / PDF';
    tabPdf.className = 'mode-tab cursor-pointer border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm';
    tabPhoto.className = 'mode-tab cursor-pointer border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all opacity-70 hover:opacity-100';
    actionArea.classList.add('hidden');
    renderDropzone();
  });

  renderDropzone();

  function prepareImagePayload(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX_DIM = 1800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function handleFileSelection(file) {
    currentFile = file;
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="w-12 h-12 rounded-xl ${isPdf ? 'bg-rose-100 text-rose-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center font-bold text-2xl">
          ${isPdf ? '📄' : '🖼️'}
        </div>
        <div class="overflow-hidden flex-1">
          <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Size: <span class="font-bold text-slate-700 dark:text-slate-300">${formatBytes(file.size)}</span> • Mode: <span class="font-bold uppercase text-purple-600">${selectedMode === 'photo' ? 'Photo (₹3)' : 'PDF (₹5)'}</span></p>
        </div>
      </div>

      <button id="btn-process-ai" class="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ✨ Enhance to 4K Ultra HDR (Remini Style)
      </button>

      <div id="ai-result" class="hidden space-y-5"></div>
    `;

    const btnProcess = actionArea.querySelector('#btn-process-ai');
    const aiResult = actionArea.querySelector('#ai-result');

    btnProcess.addEventListener('click', async () => {
      try {
        btnProcess.disabled = true;
        btnProcess.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          AI 4K Neural Enhancing... Please wait
        `;

        const base64Data = await prepareImagePayload(file);

        const res = await fetch('/api/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            scale: 2,
            face_enhance: selectedMode === 'photo'
          })
        });

        const data = await res.json();
        if (!data.success || !data.output) {
          throw new Error(data.error || 'Failed to generate 4K image');
        }

        // Save order in local IndexedDB (Crash Protection)
        const orderId = 'order_' + Date.now();
        await saveOrder({
          id: orderId,
          fileName: file.name,
          fileType: selectedMode,
          outputUrl: data.output,
          timestamp: Date.now()
        });

        renderReminiResult(aiResult, base64Data, data.output, selectedMode === 'pdf', file.name, orderId);
        btnProcess.disabled = false;
        btnProcess.innerHTML = '✨ Enhance Another';

      } catch (err) {
        alert('Enhancement Error: ' + err.message);
        btnProcess.disabled = false;
        btnProcess.innerHTML = '✨ Enhance to 4K Ultra HDR (Remini Style)';
      }
    });
  }

  function renderReminiResult(container, beforeSrc, afterSrc, isPdfMode, originalName, orderId) {
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-6 rounded-3xl text-white space-y-5 border border-slate-800 shadow-2xl">
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-black uppercase tracking-wider text-emerald-400">4K Ultra HDR Ready</span>
          </div>
          <span class="text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">Swipe Slider</span>
        </div>

        <!-- Remini-style interactive Swipe Slider -->
        <div id="slider-mount"></div>

        <!-- Paywall Unlock Card -->
        <div class="bg-slate-800/80 border border-slate-700 p-4 sm:p-5 rounded-2xl space-y-3.5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm font-extrabold text-white">Download Full 4K HDR (Watermark Free)</p>
              <p class="text-[11px] text-slate-400">One-time payment of <span class="text-amber-400 font-bold">${isPdfMode ? '₹5' : '₹3'}</span></p>
            </div>
            <span class="text-xl font-black text-amber-400">${isPdfMode ? '₹5.00' : '₹3.00'}</span>
          </div>

          <button id="btn-unlock-hd" class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-4 px-4 rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
            ⚡ Pay ${isPdfMode ? '₹5' : '₹3'} via UPI & Download 4K ${isPdfMode ? 'PDF' : 'Photo'}
          </button>
        </div>

      </div>
    `;

    // Mount Interactive Slider
    const sliderMount = container.querySelector('#slider-mount');
    sliderMount.appendChild(createComparisonSlider(beforeSrc, afterSrc));

    const btnUnlock = container.querySelector('#btn-unlock-hd');
    btnUnlock.addEventListener('click', () => {
      showPaymentModal({
        fileType: isPdfMode ? 'pdf' : 'photo',
        fileName: originalName,
        onPaymentSuccess: async (paymentDetails) => {
          btnUnlock.disabled = true;
          btnUnlock.innerHTML = '⚡ Payment Verified! Downloading 4K File...';

          // 1-Second Auto-Download Trigger
          setTimeout(async () => {
            await downloadFinalFile(afterSrc, originalName, isPdfMode);
            await clearOrder(orderId);
            btnUnlock.innerHTML = '✅ Downloaded Successfully';
            setTimeout(() => {
              btnUnlock.disabled = false;
              btnUnlock.innerHTML = `⚡ Pay ${isPdfMode ? '₹5' : '₹3'} via UPI & Download 4K ${isPdfMode ? 'PDF' : 'Photo'}`;
            }, 2500);
          }, 1000);
        }
      });
    });
  }

  async function downloadFinalFile(url, originalName, isPdfMode) {
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    if (isPdfMode) {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      doc.addImage(url, 'JPEG', 20, 20, 555, 780, undefined, 'FAST');
      doc.save(`${baseName}_4K_HDR.pdf`);
    } else {
      const imageRes = await fetch(url);
      const imageBlob = await imageRes.blob();
      downloadFile(imageBlob, `${baseName}_4K_HDR.jpg`);
    }
  }
}
