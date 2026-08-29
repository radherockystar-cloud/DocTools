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
            <span class="text-xs font-extrabold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">✨ Big Update In Progress</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">AI Ultra Clarifier & HDR Upscaler</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep neural reconstruction for blurry portraits, documents & heavy files up to 100MB.</p>
        </div>

        <!-- 2 Selection Cards -->
        <div class="grid grid-cols-2 gap-3.5 mb-6">
          <div id="tab-photo" class="mode-tab cursor-pointer border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm">
            <span class="text-3xl mb-1.5">🖼️</span>
            <span class="font-extrabold text-sm text-slate-900 dark:text-white">AI Photo 4K</span>
            <span class="text-[11px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">Remini-Grade HDR</span>
          </div>

          <div id="tab-pdf" class="mode-tab cursor-pointer border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center text-center transition-all opacity-70 hover:opacity-100">
            <span class="text-3xl mb-1.5">📄</span>
            <span class="font-extrabold text-sm text-slate-900 dark:text-white">AI PDF & Doc</span>
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">Marksheets & Forms</span>
          </div>
        </div>

        <!-- Dropzone Area -->
        <div id="dropzone-area"></div>
        
        <!-- Action Area -->
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const tabPhoto = container.querySelector('#tab-photo');
  const tabPdf = container.querySelector('#tab-pdf');
  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  function showComingSoonModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fadeIn';
    
    modal.innerHTML = `
      <div class="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white text-center shadow-2xl relative my-auto">
        
        <!-- Glowing Top Icon -->
        <div class="relative w-16 h-16 mx-auto mb-3">
          <div class="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl blur-md opacity-75"></div>
          <div class="relative w-full h-full bg-slate-900 rounded-2xl border border-purple-400/50 flex items-center justify-center text-3xl shadow-inner">
            ⚡
          </div>
        </div>

        <!-- Status Tag -->
        <span class="text-[10px] font-black uppercase tracking-widest text-purple-300 bg-purple-950/90 border border-purple-700/60 px-3.5 py-1 rounded-full shadow-sm">
          🚀 Next-Gen AI Under Development
        </span>

        <h3 class="text-xl sm:text-2xl font-black mt-3 bg-gradient-to-r from-purple-200 via-white to-pink-200 bg-clip-text text-transparent">
          Ultra Premium AI Engine
        </h3>
        
        <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
          Hum is feature ko aur bhi powerful & ultra-high quality banane par kaam kar rahe hain. Jaldi hi ye 3 bade AI features launch honge:
        </p>

        <!-- Feature Points Card -->
        <div class="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 my-4 text-left space-y-3 shadow-inner">
          
          <div class="flex items-start gap-2.5">
            <span class="text-sm bg-purple-500/20 text-purple-300 p-1 rounded-lg">✨</span>
            <div>
              <p class="text-xs font-bold text-white">4K AI Photo & Face Restoration</p>
              <p class="text-[11px] text-slate-400">Remini-grade sharpness — blurry facial details & eyes crystal clear honge.</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <span class="text-sm bg-blue-500/20 text-blue-300 p-1 rounded-lg">📄</span>
            <div>
              <p class="text-xs font-bold text-white">Document & PDF Magic Whitening</p>
              <p class="text-[11px] text-slate-400">Marksheets se parchhayi (shadows) hatakar background clean white aur text deep black banega.</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <span class="text-sm bg-emerald-500/20 text-emerald-300 p-1 rounded-lg">⚡</span>
            <div>
              <p class="text-xs font-bold text-white">Smart AI MB to KB Compression</p>
              <p class="text-[11px] text-slate-400">Heavy files (10MB-50MB) ko bina 1% bhi quality kharab kiye ultra-compact KB me convert karega.</p>
            </div>
          </div>

        </div>

        <!-- Release Badge -->
        <p class="text-[11px] font-semibold text-amber-400 mb-4 flex items-center justify-center gap-1.5">
          <span>🔔</span> Next major update me 1-click live hoga!
        </p>

        <!-- Action Button -->
        <button id="btn-close-coming-soon" class="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-purple-500/30 transition-all">
          Awesome! I'll Wait For The Update 🚀
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
    const modeName = selectedMode === 'photo' ? 'Photo 4K' : 'PDF & Doc';

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="w-12 h-12 rounded-xl ${isPdf ? 'bg-rose-100 text-rose-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center font-bold text-2xl">
          ${isPdf ? '📄' : '🖼️'}
        </div>
        <div class="overflow-hidden flex-1">
          <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">${file.name}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Size: <span class="font-bold text-slate-700 dark:text-slate-300">${formatBytes(file.size)}</span> • Mode: <span class="font-bold uppercase text-purple-600">${modeName}</span></p>
        </div>
      </div>

      <button id="btn-process-ai" class="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ✨ Enhance with Ultra AI (Preview)
      </button>
    `;

    const btnProcess = actionArea.querySelector('#btn-process-ai');
    btnProcess.addEventListener('click', () => {
      showComingSoonModal();
    });

    showComingSoonModal();
  }
}
