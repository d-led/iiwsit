import { defineConfig } from 'vite';
import { resolve } from 'path';
import { execSync } from 'child_process';

// Get git information at build time
function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const commit = execSync('git rev-parse --short HEAD').toString().trim();
    return { branch, commit };
  } catch (error) {
    console.warn('Could not get git info:', error);
    return { branch: 'unknown', commit: 'unknown' };
  }
}

const gitInfo = getGitInfo();

export default defineConfig({
  root: 'src',
  base: './',
  publicDir: 'public',
  define: {
    __GIT_BRANCH__: JSON.stringify(gitInfo.branch),
    __GIT_COMMIT__: JSON.stringify(gitInfo.commit),
  },
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
  logLevel: 'info',
});
