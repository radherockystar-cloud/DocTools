import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, existsSync } from 'node:fs';

const root = fileURLToPath(new URL('.', import.meta.url));

// Every *.html file in the project root becomes a page (index, about, tool pages...).
// Tool pages are created by scripts/generate-pages.js, so nothing needs to be added here by hand.
const input = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace(/\.html$/, ''), resolve(root, f)])
);

// Dev server only: let /about open about.html, like Vercel cleanUrls does in production.
function cleanUrlsDev() {
  return {
    name: 'clean-urls-dev',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = (req.url || '').split('?')[0];
        if (path !== '/' && !path.includes('.') && existsSync(resolve(root, `.${path}.html`))) {
          req.url = `${path}.html`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [cleanUrlsDev()],
  build: {
    rollupOptions: { input },
  },
});
