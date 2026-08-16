import Tesseract from 'tesseract.js';
import { createDropzone } from '../components/Dropzone.js';

export function renderTextExtractor(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">← Back</button>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h1 class="text-2xl font-extrabold text-slate-900">Text Extractor (OCR)</h1>
        <p class="text-sm text-slate-500 mt-1">Convert scanned images/docs to editable text.</p>
        <div id="dropzone-area" class="mt-6"></div>
        <div id="action-area" class="hidden mt-6 space-y-4"></div>
      </div>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', onBack);
  const dropzone = createDropzone({ accept: 'image/*', onFilesSelected: (file) => handleFile(file) });
  container.querySelector('#dropzone-area').appendChild(dropzone);

  async function handleFile(file) {
    const actionArea = container.querySelector('#action-area');
    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div id="status" class="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold">Scanning text... (Please wait)</div>
      <textarea id="output" class="w-full h-64 p-4 border rounded-xl" readonly></textarea>
      <button id="copy-btn" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">📋 Copy Text</button>
    `;

    try {
      const result = await Tesseract.recognize(file, 'eng');
      actionArea.querySelector('#status').innerText = 'Extraction Successful!';
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
