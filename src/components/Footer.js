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

        <!-- Social Icons -->
        <div class="flex items-center gap-2.5">
          <a href="https://www.instagram.com/rocky_star474?igsh=MW00MHJqZzhleDFlOA==" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md shadow-pink-500/20 hover:scale-110 flex items-center justify-center text-white transition-all" title="Instagram">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          <a href="https://t.me/ROCKY_STAR474" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0088cc] to-[#229ed9] shadow-md shadow-sky-500/20 hover:scale-110 flex items-center justify-center text-white transition-all" title="Telegram Channel">
            <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.228-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.12.098.153.228.166.331.011.095.025.31.009.479z"/>
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
