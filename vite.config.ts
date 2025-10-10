import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: 'public',
  build: {
    outDir: '../pages',
    emptyOutDir: true,
    sourcemap: true, // Generate source maps for production
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  css: {
    lightningcss: {
      errorRecovery: false,
    },
  },
  logLevel: 'warn',
});
