import { createWorker } from 'tesseract.js';
import { createDropzone } from '../components/Dropzone.js';
import { formatBytes } from '../utils/fileHelpers.js';

const LANGUAGES = [
  { code: 'eng+hin', label: 'English + Hindi (Default)' },
  { code: 'eng', label: 'English only' },
  { code: 'hin', label: 'Hindi (हिन्दी)' },
  { code: 'mar', label: 'Marathi (मराठी)' },
  { code: 'guj', label: 'Gujarati (ગુજરાતી)' },
  { code: 'ben', label: 'Bengali (বাংলা)' },
  { code: 'tam', label: 'Tamil (தமிழ்)' },
  { code: 'tel', label: 'Telugu (తెలుగు)' },
  { code: 'kan', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'mal', label: 'Malayalam (മലയാളം)' },
  { code: 'pan', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'urd', label: 'Urdu (اردو)' },
  { code: 'ara', label: 'Arabic (العربية)' },
  { code: 'chi_sim', label: 'Chinese (Simplified)' },
  { code: 'jpn', label: 'Japanese (日本語)' },
  { code: 'kor', label: 'Korean (한국어)' },
  { code: 'spa', label: 'Spanish (Español)' },
  { code: 'fra', label: 'French (Français)' },
  { code: 'deu', label: 'German (Deutsch)' },
  { code: 'rus', label: 'Russian (Русский)' }
];

export function renderTextExtractor(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">← Back</button>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Text Extractor (OCR)</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Convert scanned images, camera photos, or screenshots into editable text — any language.</p>

        <div class="mt-5">
          <label class="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1.5 block">Text Language in Photo</label>
          <select id="lang-select" class="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500">
            ${LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join('')}
          </select>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Not sure? Leave it on the default — it reads English and Hindi together.</p>
        </div>

        <div id="dropzone-area" class="mt-5"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">OCR Technology Guide</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How to Convert Scanned Images and Documents Into Editable Text Online</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Extracting text from scanned documents, notes, or receipt images eliminates the hassle of manual typing. Optical Character Recognition (OCR) scans letter formations within pictures and instantly transforms them into clean, editable digital text that you can copy to your clipboard with a single click.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Works With Camera Photos and Screenshots Alike</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Whether you snap a photo of a printed page with your phone camera or take a screenshot of text on your screen, the extractor reads both equally well. For the sharpest results, make sure the text is well-lit, in focus, and not at a steep angle.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Beyond English: Reading Indian and International Languages</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Printed or handwritten text isn't always in English. This tool lets you pick the language present in your photo — including Hindi, Marathi, Gujarati, Tamil, Telugu, Bengali, Urdu, and several major world languages — so recognition stays accurate instead of turning foreign scripts into garbled symbols.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">100% Client-Side Privacy for Confidential Notes</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Extracting text from sensitive legal contracts, official letters, or personal notebook entries requires strict privacy. Because all OCR computing runs locally inside your browser memory using advanced WebAssembly packages, your photos are never transmitted or saved on external servers, ensuring complete document security.</p>
        </div>
      </article>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const langSelect = container.querySelector('#lang-select');
  const dropzone = createDropzone({ accept: 'image/*', onFilesSelected: (file) => handleFile(file) });
  container.querySelector('#dropzone-area').appendChild(dropzone);

  async function handleFile(file) {
    const actionArea = container.querySelector('#action-area');
    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div id="status" class="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold dark:bg-blue-950/40 dark:text-blue-300">Scanning text... (this can take a few seconds)</div>
    `;

    const selectedLang = langSelect.value;

    try {
      const worker = await createWorker(selectedLang);
      const result = await worker.recognize(file);
      await worker.terminate();

      const extractedText = (result.data.text || '').trim();

      actionArea.innerHTML = `
        <div id="status" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold dark:bg-emerald-950/40 dark:text-emerald-300">✅ Extraction Successful!</div>
        <textarea id="output" class="w-full h-64 p-4 border rounded-xl border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-white text-sm" readonly>${extractedText}</textarea>
        <button id="copy-btn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">📋 Copy Text</button>
      `;

      const copyBtn = actionArea.querySelector('#copy-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(extractedText);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy Text'; }, 2000);
      });

    } catch (e) {
      actionArea.innerHTML = `
        <div id="status" class="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold dark:bg-rose-950/40 dark:text-rose-300">Error: ${e.message}</div>
      `;
    }
  }
}
