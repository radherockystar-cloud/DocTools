import { navigate } from '../router.js';

export function renderNavbar(container, onHome) {
  const currentPath = window.location.pathname;
  const isHome = currentPath === '/' || currentPath === '';

  const nav = document.createElement('header');
  nav.id = 'main-header-bar';
  nav.className = 'sticky top-0 z-40 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-rose-200/60 dark:border-slate-800 transition-colors shadow-sm';
  nav.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
      
      <!-- Left Controls: Back Button & Brand Logo -->
      <div class="flex items-center gap-2.5">
        ${!isHome ? `
          <button id="nav-back-btn" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm border border-rose-200 dark:border-slate-700 transition-all active:scale-95 shadow-sm shrink-0">
            <span>←</span>
            <span class="hidden sm:inline">Back</span>
          </button>
        ` : ''}

        <!-- 3D Brand Logo -->
        <button id="nav-brand" class="flex items-center gap-2.5 group focus:outline-none shrink-0">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white hidden sm:inline">
            Doc<span class="bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 bg-clip-text text-transparent">Tools</span>
          </span>
        </button>
      </div>

      <!-- Center Search Bar -->
      <div class="flex-1 max-w-md mx-2">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            🔍
          </span>
          <input 
            type="text" 
            id="header-search-input" 
            placeholder="Search tools (e.g. 20kb, PDF, Resize)..." 
            class="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-xl border border-rose-200/60 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>
      </div>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Theme Toggle -->
        <button id="btn-quick-theme" title="Toggle Theme" class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-lg transition-all border border-rose-200 dark:border-slate-700 shadow-sm active:scale-95">
          🌓
        </button>
      </div>
    </div>
  `;

  container.appendChild(nav);
  nav.querySelector('#nav-brand').addEventListener('click', onHome);
  
  const backBtn = nav.querySelector('#nav-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  nav.querySelector('#btn-quick-theme').addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Search input handler with auto-redirect to home if searching from subpages
  const searchInput = nav.querySelector('#header-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (currentPath !== '/') {
        navigate('/');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('filter-tools', { detail: { query } }));
        }, 100);
      } else {
        window.dispatchEvent(new CustomEvent('filter-tools', { detail: { query } }));
      }
    });
  }
}
