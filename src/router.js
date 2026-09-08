const historyStack = [window.location.pathname];

export function navigate(path, push = true) {
  if (window.location.pathname !== path) {
    if (push) {
      window.history.pushState({ path }, '', path);
      historyStack.push(path);
    } else {
      window.history.replaceState({ path }, '', path);
      if (historyStack.length > 0) {
        historyStack[historyStack.length - 1] = path;
      } else {
        historyStack.push(path);
      }
    }
  }
  window.dispatchEvent(new CustomEvent('route-change', { detail: { path } }));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function getCurrentPath() {
  return window.location.pathname;
}

window.addEventListener('popstate', (e) => {
  const path = window.location.pathname;
  if (historyStack.length > 1) {
    historyStack.pop();
  }
  window.dispatchEvent(new CustomEvent('route-change', { detail: { path } }));
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
