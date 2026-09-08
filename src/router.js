// Clean client-side router forcing direct return to home on history states.

export function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({ path }, '', path);
  }
  window.dispatchEvent(new CustomEvent('route-change', { detail: { path } }));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function getCurrentPath() {
  return window.location.pathname;
}

window.addEventListener('popstate', (e) => {
  const path = window.location.pathname;
  window.dispatchEvent(new CustomEvent('route-change', { detail: { path } }));
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
