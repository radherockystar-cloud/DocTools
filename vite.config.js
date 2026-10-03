import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
        terms: resolve(__dirname, 'terms.html'),
        contact: resolve(__dirname, 'contact.html'),
        security: resolve(__dirname, 'security.html'),
        howToUse: resolve(__dirname, 'how-to-use.html'),
        // Aur agar aapke tools ke alag HTML pages banane hain, toh unhe yahan jod sakte hain
      },
    },
  },
});
