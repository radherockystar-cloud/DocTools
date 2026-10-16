import { createWorker } from 'tesseract.js';
import { createDropzone } from '../components/Dropzone.js';

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

export function renderTextExtractor(container) {
  // The page title, intro and article live in the static HTML page (content/text-extractor.html).
  // This file only draws the tool itself.
  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <label for="lang-select" class="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1.5 block">Text Language in Photo</label>
      <select id="lang-select" class="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500">
        ${LANGUAGES.map((l) => `<option value="${l.code}">${l.label}</option>`).join('')}
      </select>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Not sure? Leave it on the default. It reads English and Hindi together.</p>

      <div id="dropzone-area" class="mt-5"></div>
      <div id="action-area" class="hidden mt-6 space-y-4"></div>
    </div>
  `;

  const langSelect = container.querySelector('#lang-select');
  const actionArea = container.querySelector('#action-area');
  const dropzone = createDropzone({ accept: 'image/*', onFilesSelected: (file) => handleFile(file) });
  container.querySelector('#dropzone-area').appendChild(dropzone);

  let busy = false;

  function showStatus(kind, text) {
    const styles = {
      info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
      ok: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      error: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
    };
    const box = document.createElement('div');
    box.id = 'status';
    box.className = `p-4 rounded-xl text-sm font-bold ${styles[kind]}`;
    box.textContent = text;
    return box;
  }

  async function handleFile(file) {
    if (busy) return;
    busy = true;

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = '';
    const status = showStatus('info', 'Starting... the first scan in a language downloads its data and can take a while.');
    actionArea.appendChild(status);

    const selectedLang = langSelect.value;
    let worker = null;

    try {
      worker = await createWorker(selectedLang, 1, {
        logger: (m) => {
          if (m && m.status === 'recognizing text' && typeof m.progress === 'number') {
            status.textContent = `Scanning text... ${Math.round(m.progress * 100)}%`;
          }
        }
      });
      const result = await worker.recognize(file);
      const extractedText = ((result && result.data && result.data.text) || '').trim();

      actionArea.innerHTML = '';
      if (!extractedText) {
        actionArea.appendChild(showStatus('error', 'No text was found. Try a sharper, better-lit image and check the selected language.'));
        return;
      }

      actionArea.appendChild(showStatus('ok', '✅ Extraction successful! Please read the text and correct any mistakes.'));

      const output = document.createElement('textarea');
      output.id = 'output';
      output.readOnly = true;
      output.className = 'w-full h-64 p-4 border rounded-xl border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-white text-sm';
      output.value = extractedText;
      actionArea.appendChild(output);

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors';
      copyBtn.textContent = '📋 Copy Text';
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(extractedText);
          copyBtn.textContent = '✅ Copied!';
        } catch (e) {
          output.focus();
          output.select();
          copyBtn.textContent = 'Press Copy on your keyboard or menu';
        }
        setTimeout(() => { copyBtn.textContent = '📋 Copy Text'; }, 2500);
      });
      actionArea.appendChild(copyBtn);
    } catch (e) {
      actionArea.innerHTML = '';
      actionArea.appendChild(showStatus('error', `Error: ${(e && e.message) || 'The text could not be read. Please try again.'}`));
    } finally {
      if (worker) {
        try { await worker.terminate(); } catch (e) { /* ignore */ }
      }
      busy = false;
    }
  }
}
