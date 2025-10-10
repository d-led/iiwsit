#!/usr/bin/env node

import { watch } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

let isBuilding = false;
let needsRebuild = false;

async function build() {
  if (isBuilding) {
    needsRebuild = true;
    return;
  }

  isBuilding = true;
  console.log('\n🔨 Building project...');

  try {
    const startTime = Date.now();

    // Run TypeScript compiler
    console.log('📝 Compiling TypeScript...');
    await execAsync('npm run build', { cwd: projectRoot });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Build completed in ${duration}s`);

    isBuilding = false;

    // If changes occurred during build, rebuild
    if (needsRebuild) {
      needsRebuild = false;
      setTimeout(() => build(), 100);
    }
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    isBuilding = false;
  }
}

function startWatching() {
  console.log('👀 Watching for changes...');
  console.log('   - src/**/*.{ts,tsx,html,css}');
  console.log('   - tsconfig.json');
  console.log('   - vite.config.ts');
  console.log('\nPress Ctrl+C to stop\n');

  const srcDir = path.join(projectRoot, 'src');
  const watchPaths = [srcDir, path.join(projectRoot, 'tsconfig.json'), path.join(projectRoot, 'vite.config.ts')];

  let debounceTimer = null;

  watchPaths.forEach((watchPath) => {
    watch(
      watchPath,
      { recursive: true },
      (eventType, filename) => {
        if (!filename) return;

        // Ignore specific files/patterns
        if (
          filename.includes('node_modules') ||
          filename.includes('.git') ||
          filename.includes('pages') ||
          filename.includes('dist') ||
          filename.endsWith('.test.ts') ||
          filename.endsWith('.spec.ts')
        ) {
          return;
        }

        // Only rebuild for relevant file types
        const ext = path.extname(filename);
        if (!['.ts', '.tsx', '.html', '.css', '.json'].includes(ext)) {
          return;
        }

        console.log(`📝 Changed: ${filename}`);

        // Debounce builds
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          build();
        }, 300);
      }
    );
  });
}

async function main() {
  const args = process.argv.slice(2);
  const watchMode = args.includes('--watch') || args.includes('-w');

  // Initial build
  await build();

  if (watchMode) {
    startWatching();
  } else {
    console.log('\n✨ Done! Use --watch or -w to enable watch mode.');
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping build watcher...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Stopping build watcher...');
  process.exit(0);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

