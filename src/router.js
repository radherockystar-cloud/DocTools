// Multi-page navigation helper for MPA architecture
export function navigate(path, push = true) {
  // Map clean routes to actual HTML files for multi-page build
  const routeMap = {
    '/': '/index.html',
    '/about': '/about.html',
    '/privacy-policy': '/privacy-policy.html',
    '/terms': '/terms.html',
    '/contact': '/contact.html',
    '/security': '/security.html',
    '/how-to-use': '/how-to-use.html'
  };

  let targetPath = routeMap[path] || path;
  
  if (path.startsWith('/tool-')) {
    targetPath = `/${path}.html`;
  }

  if (window.location.pathname !== targetPath && window.location.pathname !== path) {
    window.location.href = path; // Real multi-page navigation for SEO crawlers
  }
}

export function getCurrentPath() {
  return window.location.pathname;
}
