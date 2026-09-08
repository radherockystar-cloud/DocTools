import Tesseract from 'tesseract.js';
import { createDropzone } from '../components/Dropzone.js';

export function renderTextExtractor(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">← Back</button>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Text Extractor (OCR)</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Convert scanned images/docs to editable text.</p>
        <div id="dropzone-area" class="mt-6"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">OCR Technology Guide</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How to Convert Scanned Images and Documents Into Editable Text Online</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Extracting text from scanned documents, notes, or receipt images eliminates the hassle of manual typing. Optical Character Recognition (OCR) scans letter formations within pictures and instantly transforms them into clean, editable digital text that you can copy to your clipboard with a single click[span_2](start_span)[span_2](end_span).</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Fast and Private In-Browser Text Recognition</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Processing personal notes or official paperwork online requires robust security. FreeDocTools executes all recognition routines locally within your browser memory, ensuring your sensitive text documents remain entirely private and secure.</p>
        </div>
      </article>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', onBack);
  const dropzone = createDropzone({ accept: 'image/*', onFilesSelected: (file) => handleFile(file) });
  container.querySelector('#dropzone-area').appendChild(dropzone);

  async function handleFile(file) {
    const actionArea = container.querySelector('#action-area');
    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div id="status" class="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold dark:bg-blue-950/40 dark:text-blue-300">Scanning text... (Please wait)</div>
      <textarea id="output" class="w-full h-64 p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" readonly></textarea>
      <button id="copy-btn" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">📋 Copy Text</button>
    `;

    try {
      const result = await Tesseract.recognize(file, 'eng');
      actionArea.querySelector('#status कुलकर्णी.innerText || #status').innerText = 'Extraction Successful!';
      actionArea.querySelector('#output').value = result.data.text;
      actionArea.querySelector('#copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(result.data.text);
        alert('Copied to clipboard!');
      });
    } catch (e) {
      actionArea.querySelector('#status').innerText = 'Error: ' + e.message;
    }
  }
}
