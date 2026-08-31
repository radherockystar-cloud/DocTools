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
      <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
        <p class="leading-relaxed">
          <strong class="text-slate-900 dark:text-white">DocTools</strong> is an advanced, ultra-secure, client-side document and image utility suite engineered to optimize workflow efficiency for students, developers, and professionals.
        </p>
        <div class="bg-blue-50 dark:bg-slate-800 p-4 rounded-2xl border border-blue-100 dark:border-slate-700">
          <h4 class="font-bold text-blue-900 dark:text-blue-400 mb-1">🚀 100% Private Client-Side Architecture</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400">
            Unlike standard web services, all file processing computations run completely inside your local browser memory leveraging WebAssembly, HTML5 APIs, and Canvas processing. Your files remain exclusively on your terminal device.
          </p>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 dark:text-white mb-1">Core Utility Focus</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Our micro-tools deliver lightning-fast execution for image compression, passport photo cropping, structural document enhancement, OCR text scanning, and PDF compilation without dependency overhead.
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
      <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
        <p class="text-xs text-slate-400">Effective Date: January 1, 2026</p>
        <p>At <strong>DocTools</strong>, accessible from our web platform, safeguarding your personal data and uploaded documents is our primary commitment. This Privacy Policy document outlines the types of information collected and recorded by DocTools and how we utilize it.</p>
        <p><strong>1. Zero Server-Side File Storage:</strong> We do not upload, store, monitor, view, or archive any documents, PDFs, or images processed through our utility tools. All operations run locally within your device environment.</p>
        <p><strong>2. Information Collection & Usage:</strong> We do not require user account registration to process utilities. Basic technical telemetry (such as standard browser user-agent strings or localized theme preferences stored via localStorage) may be utilized exclusively to optimize user experience.</p>
        <p><strong>3. Third-Party Partners & Advertisers:</strong> We may utilize standard web analytics or third-party advertisement frameworks (such as Google AdSense) which may employ cookies or web beacons to display contextually relevant ads based on user visits to this and other websites.</p>
        <p><strong>4. Consent:</strong> By utilizing our web application, you hereby consent to our Privacy Policy and agree to its terms.</p>
      </div>
    `;
  } else if (type === 'terms') {
    icon = '📜';
    title = 'Terms & Conditions';
    content = `
      <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
        <p class="text-xs text-slate-400">Please read these terms and conditions carefully before using DocTools.</p>
        <p><strong>1. Acceptance of Terms:</strong> By accessing and using DocTools, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        <p><strong>2. Free Utility Service:</strong> DocTools is provided completely free of charge for personal, educational, and commercial workflow optimization.</p>
        <p><strong>3. Disclaimer of Warranties:</strong> The tool suite is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. We do not guarantee absolute compatibility with every external government portal or third-party system.</p>
        <p><strong>4. User Responsibility:</strong> Users bear full legal and operational responsibility for verifying that converted, resized, or compressed documents meet specific target submission criteria or portal regulations prior to official filing.</p>
        <p><strong>5. Limitation of Liability:</strong> DocTools and its developer shall not be held liable for any direct, indirect, or incidental damages arising out of the use or inability to use our browser utilities.</p>
      </div>
    `;
  } else if (type === 'help') {
    icon = '💬';
    title = 'Help & Support';
    content = `
      <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
        <p class="leading-relaxed">
          Need assistance with document configurations, facing technical bugs, or want to suggest custom utility tools? Reach out directly via our official support channels:
        </p>
        
        <div class="space-y-2">
          <a href="mailto:radherockystar@gmail.com" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <span class="text-xl">✉️</span>
            <div>
              <p class="text-xs text-slate-400 font-semibold">Email Support</p>
              <p class="text-sm font-bold text-slate-800 dark:text-white">radherockystar@gmail.com</p>
            </div>
          </a>

          <a href="https://t.me/ROCKY_STAR474" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <span class="text-xl">✈️</span>
            <div>
              <p class="text-xs text-slate-400 font-semibold">Telegram Channel</p>
              <p class="text-sm font-bold text-sky-600 dark:text-sky-400">@ROCKY_STAR474</p>
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
