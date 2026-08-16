export function openModal(type) {
  const existing = document.getElementById('info-modal-backdrop');
  if (existing) existing.remove();

  let title = '';
  let icon = '';
  let content = '';

  if (type === 'about') {
    icon = '✨';
    title = 'About DocTools';
    content = `
      <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <p class="leading-relaxed">
          <strong class="text-slate-900 dark:text-white">DocTools</strong> is a fast, ultra-secure, client-side document and image micro-utility platform designed to solve daily compression, resizing, and conversion needs.
        </p>
        <div class="bg-blue-50 dark:bg-slate-800 p-4 rounded-2xl border border-blue-100 dark:border-slate-700">
          <h4 class="font-bold text-blue-900 dark:text-blue-400 mb-1">🚀 100% Private Architecture</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400">
            Unlike other web tools, all operations run entirely within your local device memory using WebAssembly & HTML5 Canvas. Your sensitive documents never leave your phone or computer.
          </p>
        </div>
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <p>Created and Maintained with dedication by <strong class="text-slate-800 dark:text-white">Rocky Star</strong>.</p>
        </div>
      </div>
    `;
  } else if (type === 'privacy') {
    icon = '🔒';
    title = 'Privacy Policy';
    content = `
      <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <p><strong>1. Zero Data Collection:</strong> We do not store, view, or transmit any images or PDF files uploaded to DocTools.</p>
        <p><strong>2. In-Browser Memory Processing:</strong> All compression, resizing, text extraction, and PDF manipulation take place directly inside your device's browser.</p>
        <p><strong>3. No Cookies or Third-Party Tracking:</strong> We respect your complete privacy without storing intrusive behavioral cookies.</p>
        <p><strong>4. Security:</strong> Since files never touch any external server, there is zero risk of data breaches or leaks.</p>
      </div>
    `;
  } else if (type === 'terms') {
    icon = '📜';
    title = 'Terms & Conditions';
    content = `
      <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <p><strong>1. Free to Use:</strong> DocTools is 100% free for personal, educational, and professional use.</p>
        <p><strong>2. As-Is Service:</strong> The tool suite is provided "as is" to help users prepare documents for online forms, exams, and storage optimization.</p>
        <p><strong>3. User Responsibility:</strong> Users are responsible for verifying that converted/compressed documents meet specific portal requirements prior to submission.</p>
      </div>
    `;
  } else if (type === 'help') {
    icon = '💬';
    title = 'Help & Support';
    content = `
      <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <p class="leading-relaxed">
          Need help with document processing, want to report a bug, or have a feature suggestion? Contact the developer directly:
        </p>
        
        <div class="space-y-2">
          <a href="mailto:radherockystar@gmail.com" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <span class="text-xl">✉️</span>
            <div>
              <p class="text-xs text-slate-400 font-semibold">Email Support</p>
              <p class="text-sm font-bold text-slate-800 dark:text-white">radherockystar@gmail.com</p>
            </div>
          </a>

          <a href="https://wa.me/917877880925" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <span class="text-xl">📱</span>
            <div>
              <p class="text-xs text-slate-400 font-semibold">WhatsApp Chat</p>
              <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">+91 7877880925</p>
            </div>
          </a>
        </div>
      </div>
    `;
  } else if (type === 'settings') {
    icon = '⚙️';
    title = 'App Settings';
    const isDark = document.documentElement.classList.contains('dark');
    content = `
      <div class="space-y-5 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Theme Mode</label>
          <div class="grid grid-cols-2 gap-3">
            <button id="btn-theme-light" class="p-3.5 border-2 ${!isDark ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} rounded-2xl flex items-center justify-center gap-2">
              <span>☀️</span> Light Theme
            </button>
            <button id="btn-theme-dark" class="p-3.5 border-2 ${isDark ? 'border-blue-600 bg-blue-900/30 text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} rounded-2xl flex items-center justify-center gap-2">
              <span>🌙</span> Dark Theme
            </button>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
          <p class="text-xs text-slate-400">Settings are saved locally on your device browser.</p>
        </div>
      </div>
    `;
  }

  const modalBackdrop = document.createElement('div');
  modalBackdrop.id = 'info-modal-backdrop';
  modalBackdrop.className = 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
  modalBackdrop.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-xl">${icon}</span>
          <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${title}</h3>
        </div>
        <button id="modal-close" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold">✕</button>
      </div>

      <div class="mt-2">
        ${content}
      </div>
    </div>
  `;

  document.body.appendChild(modalBackdrop);

  modalBackdrop.querySelector('#modal-close').addEventListener('click', () => modalBackdrop.remove());
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.remove();
  });

  if (type === 'settings') {
    const lightBtn = modalBackdrop.querySelector('#btn-theme-light');
    const darkBtn = modalBackdrop.querySelector('#btn-theme-dark');

    lightBtn.addEventListener('click', () => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      modalBackdrop.remove();
    });

    darkBtn.addEventListener('click', () => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      modalBackdrop.remove();
    });
  }
}
