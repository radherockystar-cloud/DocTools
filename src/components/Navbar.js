import { navigate } from '../router.js';

const DRAWER_ITEMS = [
  { action: 'home', icon: '🏠', label: 'Home / All Tools' },
  { action: 'bg-remover', icon: '🖼️', label: 'Background Remover' },
  { action: 'about', icon: '👤', label: 'About Us' },
  { action: 'privacy', icon: '🛡️', label: 'Privacy Policy' },
  { action: 'terms', icon: '📄', label: 'Terms & Conditions' },
  { action: 'security', icon: '🔒', label: 'Security' },
  { action: 'help', icon: '❓', label: 'Help & Contact Us' }
];

const ROUTE_MAP = {
  'about': '/about',
  'privacy': '/privacy-policy',
  'terms': '/terms',
  'security': '/security',
  'help': '/contact',
  'bg-remover': '/tool-bg-remover'
};

export function renderNavbar(container, onHome) {
  const nav = document.createElement('header');
  nav.id = 'main-header-bar';
  nav.className = 'sticky top-0 z-40 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-rose-200/60 dark:border-slate-800 transition-colors shadow-sm';
  nav.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

      <!-- Brand Logo -->
      <div class="flex items-center gap-2.5">
        <button id="nav-brand" class="flex items-center gap-2.5 group focus:outline-none shrink-0">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white hidden sm:inline">
            Doc<span class="bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 bg-clip-text text-transparent">Tools</span>
          </span>
        </button>
      </div>

      <!-- Center Clean Search Bar -->
      <div class="flex-1 max-w-sm mx-2">
        <div class="relative flex items-center">
          <span class="absolute left-3.5 text-slate-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            id="header-search-input"
            placeholder=""
            class="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-2xl border border-rose-200/60 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
          />
        </div>
      </div>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2 shrink-0">
        <button id="btn-quick-theme" title="Toggle Theme" class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-lg transition-all border border-rose-200 dark:border-slate-700 shadow-sm active:scale-95">
          🌓
        </button>
        <button id="btn-open-drawer" title="Menu" class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-lg transition-all border border-rose-200 dark:border-slate-700 shadow-sm active:scale-95">
          ☰
        </button>
      </div>
    </div>
  `;

  container.appendChild(nav);
  nav.querySelector('#nav-brand').addEventListener('click', onHome);

  nav.querySelector('#btn-quick-theme').addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyDrawerThemeColors();
  });

  const searchInput = nav.querySelector('#header-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('filter-tools', { detail: { query } }));
        }, 100);
      } else {
        window.dispatchEvent(new CustomEvent('filter-tools', { detail: { query } }));
      }
    });
  }

  // ---------- Drawer ----------
  const overlay = document.createElement('div');
  overlay.id = 'drawer-overlay';
  overlay.className = 'fixed inset-0 z-50 hidden';
  overlay.innerHTML = `
    <div id="drawer-backdrop" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    <div id="drawer-panel" class="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-[#0b0f19] shadow-2xl p-6 overflow-y-auto translate-x-full transition-transform duration-300">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚡</span>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Navigation</h2>
        </div>
        <button id="btn-close-drawer" class="w-9 h-9 rounded-full bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">✕</button>
      </div>
      <hr class="border-rose-100 dark:border-slate-800 mb-4" />
      <div id="drawer-items" class="space-y-5"></div>

      <div class="mt-10 pt-6 border-t border-rose-100 dark:border-slate-800 text-center">
        <p class="text-xs font-black tracking-widest text-rose-500 uppercase mb-3">Developer Social Links</p>
        <div class="flex items-center justify-center gap-3">
          <a href="https://instagram.com/rocky_star474" target="_blank" rel="noopener" class="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-slate-800 flex items-center justify-center text-lg">📷</a>
          <a href="https://wa.me/917877880925" target="_blank" rel="noopener" class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-lg">💬</a>
          <a href="mailto:radherockystar@gmail.com" class="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-slate-800 flex items-center justify-center text-lg">✉️</a>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-4">Developed by <span class="text-rose-600 dark:text-rose-400 font-bold">Rocky Star 474</span></p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const drawerItemsEl = overlay.querySelector('#drawer-items');
  DRAWER_ITEMS.forEach(item => {
    const btn = document.createElement('button');
    btn.setAttribute('data-drawer-action', item.action);
    btn.className = 'w-full flex items-center gap-4 text-left py-1.5 group';
    btn.innerHTML = `
      <span class="text-xl w-7 text-center">${item.icon}</span>
      <span class="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">${item.label}</span>
    `;
    drawerItemsEl.appendChild(btn);
  });

  const drawerPanel = overlay.querySelector('#drawer-panel');
  const backdrop = overlay.querySelector('#drawer-backdrop');
  let isDrawerVisible = false;

  function showDrawerUI() {
    if (isDrawerVisible) return;
    isDrawerVisible = true;
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => drawerPanel.classList.remove('translate-x-full'));
    document.body.style.overflow = 'hidden';
    applyDrawerThemeColors();
  }

  function hideDrawerUI() {
    if (!isDrawerVisible) return;
    isDrawerVisible = false;
    drawerPanel.classList.add('translate-x-full');
    document.body.style.overflow = '';
    setTimeout(() => overlay.classList.add('hidden'), 300);
  }

  function applyDrawerThemeColors() {
    const isDark = document.documentElement.classList.contains('dark');
    drawerPanel.style.backgroundColor = isDark ? '#0b0f19' : '#ffffff';
  }

  function openDrawer() {
    history.pushState({ drawerOpen: true }, '', window.location.pathname);
    showDrawerUI();
  }

  function requestClose() {
    if (history.state && history.state.drawerOpen) {
      history.back();
    } else {
      hideDrawerUI();
    }
  }

  nav.querySelector('#btn-open-drawer').addEventListener('click', openDrawer);
  overlay.querySelector('#btn-close-drawer').addEventListener('click', requestClose);
  backdrop.addEventListener('click', requestClose);

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.drawerOpen) {
      showDrawerUI();
    } else {
      hideDrawerUI();
    }
  });

  drawerItemsEl.querySelectorAll('button[data-drawer-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-drawer-action');
      hideDrawerUI();

      if (action === 'home') {
        navigate('/');
        onHome();
      } else {
        const path = ROUTE_MAP[action];
        if (path) navigate(path);
      }
    });
  });
}
