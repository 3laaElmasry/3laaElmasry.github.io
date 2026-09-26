import { defineConfig } from 'vite';

// base is updated by the deploy phase depending on the target repo:
// '/' for a <user>.github.io user site, '/portfolio/' for a project site.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
