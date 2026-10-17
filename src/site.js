import { inject } from '@vercel/analytics';
inject();

// Remove any old service worker that earlier versions of the site may have installed.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => registrations.forEach((r) => r.unregister()))
    .catch(() => {});
}

// ---------- Dark mode ----------
const themeButton = document.getElementById('theme-toggle');
if (themeButton) {
  themeButton.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) { /* storage may be blocked */ }
  });
}

// ---------- Menu ----------
// Opening the menu adds "#menu" to the address bar. If you tap a menu link and then press Back,
// the browser returns to "<page>#menu" and the menu is shown open again.
const MENU_HASH = '#menu';
const overlay = document.getElementById('menu-overlay');
const panel = document.getElementById('menu-panel');
const openButton = document.getElementById('menu-open');
const closeButton = document.getElementById('menu-close');
const backdrop = document.getElementById('menu-backdrop');
let menuVisible = false;
let hideTimer = null;

function showMenu() {
  if (!overlay || menuVisible) return;
  menuVisible = true;
  clearTimeout(hideTimer);
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => panel.classList.remove('translate-x-full'));
  document.body.style.overflow = 'hidden';
}

function hideMenu() {
  if (!overlay || !menuVisible) return;
  menuVisible = false;
  panel.classList.add('translate-x-full');
  document.body.style.overflow = '';
  hideTimer = setTimeout(() => overlay.classList.add('hidden'), 300);
}

function pagePath() {
  return location.pathname + location.search;
}

function openMenu() {
  if (menuVisible) return;
  history.pushState({ menu: true }, '', pagePath() + MENU_HASH);
  showMenu();
}

function closeMenu() {
  if (!menuVisible) return;
  if (history.state && history.state.menu) {
    history.back(); // goes to the entry without #menu, then popstate hides the menu
  } else {
    // Menu was opened by a direct link to #menu, so there is no earlier entry to go back to.
    history.replaceState(null, '', pagePath());
    hideMenu();
  }
}

function syncMenuWithAddress() {
  if (location.hash === MENU_HASH) showMenu();
  else hideMenu();
}

if (overlay && panel) {
  if (openButton) openButton.addEventListener('click', openMenu);
  if (closeButton) closeButton.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // A menu link that points to the page you are already on just closes the menu.
  panel.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.pathname === location.pathname) {
        e.preventDefault();
        closeMenu();
      }
    });
  });

  window.addEventListener('popstate', syncMenuWithAddress);
  window.addEventListener('hashchange', syncMenuWithAddress);
  window.addEventListener('pageshow', syncMenuWithAddress);
  syncMenuWithAddress();
}

// ---------- Tool search (home page only) ----------
const searchInput = document.getElementById('tool-search');
if (searchInput) {
  const cards = Array.from(document.querySelectorAll('[data-tool-card]'));
  const emptyNote = document.getElementById('no-tools');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let shown = 0;
    cards.forEach((card) => {
      const match = !query || (card.getAttribute('data-search') || '').includes(query);
      card.classList.toggle('hidden', !match);
      if (match) shown += 1;
    });
    if (emptyNote) emptyNote.classList.toggle('hidden', shown > 0);
  });
}
