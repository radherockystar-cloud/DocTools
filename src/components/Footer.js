import { openModal } from './InfoModal.js';

export function renderFooter(container) {
  const footer = document.createElement('footer');
  footer.className = 'bg-white dark:bg-[#0b0f19] border-t border-rose-100 dark:border-slate-800 py-10 mt-auto transition-colors';
  footer.innerHTML = `
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        
        <!-- Brand & Info -->
        <div class="text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2.5 mb-1.5">
            <span class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">⚡</span>
            <span class="font-extrabold text-slate-900 dark:text-white text-base">DocTools</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">100% Free & Private In-Browser Micro Utility Tools.</p>
        </div>

        <!-- Links -->
        <div class="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
          <button data-footer-action="about" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">About</button>
          <button data-footer-action="privacy" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Privacy Policy</button>
          <button data-footer-action="terms" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Terms</button>
          <button data-footer-action="help" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Help</button>
          <button data-footer-action="settings" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Settings</button>
        </div>

        <!-- 3D Social Icons -->
        <div class="flex items-center gap-2.5">
          <a href="https://www.instagram.com/rocky_star474?igsh=MW00MHJqZzhleDFlOA==" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md shadow-pink-500/20 hover:scale-110 flex items-center justify-center text-white transition-all" title="Instagram">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          <a href="https://wa.me/917877880925" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-md shadow-emerald-500/20 hover:scale-110 flex items-center justify-center text-white transition-all" title="WhatsApp">
            <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.41 1.29-1.95 1.37-.5.08-1.14.12-3.32-.78-2.62-1.08-4.31-3.76-4.44-3.93-.13-.18-1.06-1.41-1.06-2.69s.67-1.91.91-2.17c.24-.26.52-.33.7-.33.17 0 .35 0 .5.01.16.01.37-.06.58.44.22.52.74 1.8.8 1.93.07.13.11.29.02.47-.09.18-.13.29-.26.44-.13.16-.28.35-.4.47-.13.13-.27.28-.11.55.15.27.69 1.13 1.48 1.83 1.02.9 1.88 1.18 2.15 1.31.27.13.43.11.59-.07.16-.18.69-.8.87-1.08.18-.28.37-.23.62-.14.25.09 1.58.74 1.85.88.27.13.45.2.52.31.06.12.06.69-.18 1.37z"/>
            </svg>
          </a>

          <a href="mailto:radherockystar@gmail.com" class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA4335] via-[#DB4437] to-[#B31412] shadow-md shadow-red-500/20 hover:scale-110 flex items-center justify-center text-white transition-all" title="Email">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </div>

      <!-- Bottom Line -->
      <div class="mt-8 pt-6 border-t border-rose-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2">
        <p>© 2026 DocTools. All rights reserved.</p>
        <p>Developed with ❤️ by <strong class="text-rose-600 dark:text-rose-400 font-bold">Rocky Star 474</strong></p>
      </div>
    </div>
  `;

  container.appendChild(footer);

  footer.querySelectorAll('button[data-footer-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-footer-action');
      openModal(action);
    });
  });
}
