import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

// Copy index.html -> 404.html so GitHub Pages serves the SPA for
// client-side routes (e.g. /blog, /blog/some-post) with BrowserRouter.
function spa404Fallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      cpSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
    },
  };
}

// base '/' for a GitHub Pages user site (username.github.io)
export default defineConfig({
  plugins: [react(), spa404Fallback()],
  base: '/',
  build: {
    outDir: 'dist',
  },
});
