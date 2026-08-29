import { createDropzone } from '../components/Dropzone.js';
import { formatBytes } from '../utils/fileHelpers.js';

export function renderAiEnhance(container, onBack) {
  let selectedMode = 'photo'; // 'photo' or 'pdf'

  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
        ← Back to All Tools
      </button>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-1 rounded-md">Neural Super-Engine</span>
            <span class="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider" id="badge-status">🚀 Coming Soon</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">AI Ultra Clarifier & HDR Upscaler</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep neural reconstruction for blurry portraits, documents & heavy files up to 100MB.</p>
        </div>

        <!-- 2 Selection Cards -->
        <div class="grid grid-cols-2 gap-3.5 mb-6">
          <div id="tab-photo" class="mode-tab cursor-pointer border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm">
            <span class="text-3xl mb-1.5">🖼️</span>
            <span class="font-extrabold text-sm text-slate-900 dark:text-white">AI Photo 4K</span>
            <span class="text-[11px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">₹3 • Remini-Grade Faces</span>
          </div>

          <div id="tab-pdf" class="mode-tab cursor-pointer border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all opacity-70 hover:opacity-100">
            <span class="text-3xl mb-1.5">📄</span>
            <span class="font-extrabold text-sm text-slate-900 dark:text-white">AI PDF & Doc</span>
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">₹5 • Marksheets, Forms</span>
          </div>
        </div>

        <!-- Dropzone Area -->
        <div id="dropzone-area"></div>
        
        <!-- Action / Details Area -->
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const tabPhoto = container.querySelector('#tab-photo');
  const tabPdf = container.querySelector('#tab-pdf');
  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  function showComingSoonModal(modeName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-sm w-full p-6 text-white text-center shadow-2xl relative">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-3xl">
          🚀
        </div>
        <span class="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950/80 border border-purple-800 px-3 py-1 rounded-full">
          Feature Under Active Upgrade
        </span>
        <h3 class="text-xl font-black mt-3">AI ${modeName} 4K Engine</h3>
        <p class="text-xs text-slate-300 mt-2 leading-relaxed">
          Hum is feature ko ultra-high-speed Neural AI models ke sath integrate kar rahe hain. 
        </p>
        <div class="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl my-4 text-left">
          <p class="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
            <span>✨</span> 4K HDR Resolution & Paper Whitening
          </p>
          <p class="text-[11px] text-slate-400 mt-1">
            Coming very soon in the upcoming update. Stay tuned!
          </p>
        </div>
        <button id="btn-close-coming-soon" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-purple-500/20">
          Got It, Thanks!
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#btn-close-coming-soon').addEventListener('click', () => {
      modal.remove();
    });
  }

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
    tabPhoto.className = 'mode-tab cursor-pointer border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm';
    tabPdf.className = 'mode-tab cursor-pointer border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all opacity-70 hover:opacity-100';
    actionArea.classList.add('hidden');
    renderDropzone();
  });

  tabPdf.addEventListener('click', () => {
    selectedMode = 'pdf';
    tabPdf.className = 'mode-tab cursor-pointer border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm';
    tabPhoto.className = 'mode-tab cursor-pointer border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all opacity-70 hover:opacity-100';
    actionArea.classList.add('hidden');
    renderDropzone();
  });

  renderDropzone();

  function handleFileSelection(file) {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const modeName = selectedMode === 'photo' ? 'Photo' : 'PDF & Doc';

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="w-12 h-12 rounded-xl ${isPdf ? 'bg-rose-100 text-rose-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center font-bold text-2xl">
          ${isPdf ? '📄' : '🖼️'}
        </div>
        <div class="overflow-hidden flex-1">
          <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Size: <span class="font-bold text-slate-700 dark:text-slate-300">${formatBytes(file.size)}</span> • Selected: <span class="font-bold uppercase text-purple-600">${modeName}</span></p>
        </div>
      </div>

      <button id="btn-process-ai" class="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ✨ Enhance with Neural AI (Remini Preview)
      </button>
    `;

    const btnProcess = actionArea.querySelector('#btn-process-ai');
    btnProcess.addEventListener('click', () => {
      showComingSoonModal(modeName);
    });

    // Also trigger modal immediately on file selection
    showComingSoonModal(modeName);
  }
}
