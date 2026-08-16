import { openModal } from './InfoModal.js';

export function renderNavbar(container, onHome) {
  const nav = document.createElement('header');
  nav.id = 'main-header-bar';
  nav.className = 'sticky top-0 z-40 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-rose-200/60 dark:border-slate-800 transition-colors shadow-sm';
  nav.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      
      <!-- 3D Brand Logo -->
      <button id="nav-brand" class="flex items-center gap-2.5 group focus:outline-none">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
          ⚡
        </div>
        <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Doc<span class="bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 bg-clip-text text-transparent">Tools</span>
        </span>
      </button>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- Theme Toggle -->
        <button id="btn-quick-theme" title="Toggle Theme" class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-lg transition-all border border-rose-200 dark:border-slate-700 shadow-sm active:scale-95">
          🌓
        </button>

        <!-- Menu Drawer Button -->
        <button id="btn-menu-drawer" class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all border border-rose-200 dark:border-slate-700 shadow-sm active:scale-95">
          <span class="text-base">☰</span>
          <span class="hidden sm:inline">Menu</span>
        </button>

      </div>
    </div>
  `;

  container.appendChild(nav);
  nav.querySelector('#nav-brand').addEventListener('click', onHome);

  // Standalone Global Drawer attached to <body> (100% Solid Color)
  let drawerBackdrop = document.getElementById('global-drawer-backdrop');
  if (drawerBackdrop) drawerBackdrop.remove();

  drawerBackdrop = document.createElement('div');
  drawerBackdrop.id = 'global-drawer-backdrop';
  drawerBackdrop.style.cssText = 'position: fixed; inset: 0; width: 100vw; height: 100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); z-index: 99999; display: none; opacity: 0; transition: opacity 0.3s ease;';

  drawerBackdrop.innerHTML = `
    <div id="global-drawer-panel" style="position: fixed; top: 0; right: 0; width: 320px; max-width: 85vw; height: 100vh; height: 100dvh; background-color: #ffffff; z-index: 100000; box-shadow: -15px 0 40px rgba(225, 29, 72, 0.15); display: flex; flex-direction: column; justify-content: space-between; padding: 24px; box-sizing: border-box; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      
      <div>
        <!-- Drawer Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; border-bottom: 1px solid #ffe4e6;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">⚡</span>
            <h3 id="drawer-title" style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.5px;">Navigation</h3>
          </div>
          <button id="btn-close-global-drawer" style="width: 36px; height: 36px; border-radius: 50%; background: #fff1f2; border: 1px solid #fecdd3; font-size: 16px; font-weight: bold; color: #e11d48; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>

        <!-- Navigation Menu List -->
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 8px;">
          
          <button data-drawer-action="home" class="drawer-nav-item" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 16px; border: none; background: transparent; text-align: left; font-size: 15px; font-weight: 700; color: #1e293b; cursor: pointer; transition: background 0.2s;">
            <svg style="width: 22px; height: 22px; stroke: #e11d48; fill: none;" stroke-width="2.2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home / All Tools</span>
          </button>

          <button data-drawer-action="about" class="drawer-nav-item" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 16px; border: none; background: transparent; text-align: left; font-size: 15px; font-weight: 700; color: #1e293b; cursor: pointer; transition: background 0.2s;">
            <svg style="width: 22px; height: 22px; stroke: #ec4899; fill: none;" stroke-width="2.2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>About Us</span>
          </button>

          <button data-drawer-action="privacy" class="drawer-nav-item" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 16px; border: none; background: transparent; text-align: left; font-size: 15px; font-weight: 700; color: #1e293b; cursor: pointer; transition: background 0.2s;">
            <svg style="width: 22px; height: 22px; stroke: #10b981; fill: none;" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Privacy Policy</span>
          </button>

          <button data-drawer-action="terms" class="drawer-nav-item" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 16px; border: none; background: transparent; text-align: left; font-size: 15px; font-weight: 700; color: #1e293b; cursor: pointer; transition: background 0.2s;">
            <svg style="width: 22px; height: 22px; stroke: #f59e0b; fill: none;" stroke-width="2.2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            <span>Terms & Conditions</span>
          </button>

          <button data-drawer-action="help" class="drawer-nav-item" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 16px; border: none; background: transparent; text-align: left; font-size: 15px; font-weight: 700; color: #1e293b; cursor: pointer; transition: background 0.2s;">
            <svg style="width: 22px; height: 22px; stroke: #f43f5e; fill: none;" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span>Help & Contact Us</span>
          </button>

          <button data-drawer-action="settings" class="drawer-nav-item" style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 16px; border: none; background: transparent; text-align: left; font-size: 15px; font-weight: 700; color: #1e293b; cursor: pointer; transition: background 0.2s;">
            <svg style="width: 22px; height: 22px; stroke: #ec4899; fill: none;" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings (Theme Change)</span>
          </button>

        </div>
      </div>

      <!-- Developer Social Badges -->
      <div style="padding-top: 20px; border-top: 1px solid #ffe4e6;">
        <p style="text-align: center; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #f43f5e; text-transform: uppercase; margin: 0 0 14px 0;">
          DEVELOPER SOCIAL LINKS
        </p>

        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px;">
          
          <!-- Instagram -->
          <a href="https://www.instagram.com/rocky_star474?igsh=MW00MHJqZzhleDFlOA==" target="_blank" rel="noopener noreferrer" style="width: 52px; height: 52px; border-radius: 18px; background: #fdf2f8; border: 1.5px solid #fbcfe8; display: flex; align-items: center; justify-content: center; text-decoration: none;" title="Instagram">
            <svg style="width: 26px; height: 26px; stroke: #ec4899; fill: none;" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>

          <!-- WhatsApp -->
          <a href="https://wa.me/917877880925" target="_blank" rel="noopener noreferrer" style="width: 52px; height: 52px; border-radius: 18px; background: #ecfdf5; border: 1.5px solid #a7f3d0; display: flex; align-items: center; justify-content: center; text-decoration: none;" title="WhatsApp">
            <svg style="width: 26px; height: 26px; fill: #10b981;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.41 1.29-1.95 1.37-.5.08-1.14.12-3.32-.78-2.62-1.08-4.31-3.76-4.44-3.93-.13-.18-1.06-1.41-1.06-2.69s.67-1.91.91-2.17c.24-.26.52-.33.7-.33.17 0 .35 0 .5.01.16.01.37-.06.58.44.22.52.74 1.8.8 1.93.07.13.11.29.02.47-.09.18-.13.29-.26.44-.13.16-.28.35-.4.47-.13.13-.27.28-.11.55.15.27.69 1.13 1.48 1.83 1.02.9 1.88 1.18 2.15 1.31.27.13.43.11.59-.07.16-.18.69-.8.87-1.08.18-.28.37-.23.62-.14.25.09 1.58.74 1.85.88.27.13.45.2.52.31.06.12.06.69-.18 1.37z"/></svg>
          </a>

          <!-- Gmail -->
          <a href="mailto:radherockystar@gmail.com" style="width: 52px; height: 52px; border-radius: 18px; background: #fef2f2; border: 1.5px solid #fecaca; display: flex; align-items: center; justify-content: center; text-decoration: none;" title="Email Developer">
            <svg style="width: 26px; height: 26px; stroke: #ef4444; fill: none;" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>

        </div>

        <p style="text-align: center; font-size: 11px; color: #94a3b8; margin: 0; font-weight: 500;">Developed by <strong id="drawer-dev-text" style="color: #e11d48;">Rocky Star 474</strong></p>
      </div>

    </div>
  `;

  document.body.appendChild(drawerBackdrop);

  const drawerPanel = drawerBackdrop.querySelector('#global-drawer-panel');
  const btnClose = drawerBackdrop.querySelector('#btn-close-global-drawer');
  const btnOpen = nav.querySelector('#btn-menu-drawer');

  function applyDrawerThemeColors() {
    const isDark = document.documentElement.classList.contains('dark');
    const title = drawerBackdrop.querySelector('#drawer-title');
    const devText = drawerBackdrop.querySelector('#drawer-dev-text');
    const navItems = drawerBackdrop.querySelectorAll('.drawer-nav-item');

    if (isDark) {
      drawerPanel.style.backgroundColor = '#161a29';
      drawerPanel.style.borderLeft = '1px solid #2d2438';
      title.style.color = '#ffffff';
      devText.style.color = '#f43f5e';
      navItems.forEach(item => {
        item.style.color = '#f8fafc';
      });
    } else {
      drawerPanel.style.backgroundColor = '#ffffff';
      drawerPanel.style.borderLeft = '1px solid #ffe4e6';
      title.style.color = '#0f172a';
      devText.style.color = '#e11d48';
      navItems.forEach(item => {
        item.style.color = '#1e293b';
      });
    }
  }

  nav.querySelector('#btn-quick-theme').addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyDrawerThemeColors();
  });

  function openDrawer() {
    applyDrawerThemeColors();
    drawerBackdrop.style.display = 'block';
    setTimeout(() => {
      drawerBackdrop.style.opacity = '1';
      drawerPanel.style.transform = 'translateX(0)';
    }, 10);
  }

  function closeDrawer() {
    drawerBackdrop.style.opacity = '0';
    drawerPanel.style.transform = 'translateX(100%)';
    setTimeout(() => {
      drawerBackdrop.style.display = 'none';
    }, 300);
  }

  btnOpen.addEventListener('click', openDrawer);
  btnClose.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) closeDrawer();
  });

  drawerPanel.querySelectorAll('button[data-drawer-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-drawer-action');
      closeDrawer();
      if (action === 'home') {
        onHome();
      } else {
        openModal(action);
      }
    });
  });
}
