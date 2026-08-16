export function createDropzone({ accept, multiple = false, onFilesSelected }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'w-full p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:bg-slate-50 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-3 group';

  wrapper.innerHTML = `
    <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-100 transition-transform">
      📁
    </div>
    <div>
      <p class="font-semibold text-slate-800 text-base">Click or drag & drop files here</p>
      <p class="text-xs text-slate-500 mt-1">Supports: ${accept.replace(/\/\*/g, '').toUpperCase()}</p>
    </div>
    <input type="file" accept="${accept}" ${multiple ? 'multiple' : ''} class="hidden" />
  `;

  const input = wrapper.querySelector('input');

  wrapper.addEventListener('click', () => input.click());

  input.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      onFilesSelected(multiple ? Array.from(e.target.files) : e.target.files[0]);
    }
  });

  wrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
    wrapper.classList.add('dropzone-active');
  });

  wrapper.addEventListener('dragleave', () => {
    wrapper.classList.remove('dropzone-active');
  });

  wrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    wrapper.classList.remove('dropzone-active');
    if (e.dataTransfer.files.length > 0) {
      onFilesSelected(multiple ? Array.from(e.dataTransfer.files) : e.dataTransfer.files[0]);
    }
  });

  return wrapper;
}
