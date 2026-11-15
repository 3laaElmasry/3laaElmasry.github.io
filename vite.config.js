import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Two pages: the public site (index.html) and the admin dashboard (admin.html).
// vercel.json turns on clean URLs, so the dashboard is served at /admin.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
      },
    },
  },
});
