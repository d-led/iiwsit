import { defineConfig } from 'cypress';
import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';

let serverProcess: ChildProcess | null = null;
let serverPort: number | null = null;

function copyScreenshot(on: Cypress.PluginEvents) {
  on('after:screenshot', (details) => {
    const newPath = details.path.replace('/screenshots/', '/screenshots/latest/');
    return { path: newPath };
  });
}

async function startDevServer(): Promise<number> {
  if (serverPort) {
    return serverPort;
  }

  return new Promise<number>((resolve, reject) => {
    const pagesDir = join(process.cwd(), 'pages');

    // Start serve on a random port (--listen 0 means random available port)
    serverProcess = spawn('npx', ['serve', pagesDir, '--listen', '0', '--no-clipboard'], {
      shell: true,
    });

    let output = '';

    serverProcess.stdout?.on('data', (data) => {
      output += data.toString();
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match && !serverPort) {
        serverPort = parseInt(match[1], 10);
        console.log(`\n📡 Test server started on http://localhost:${serverPort}\n`);
        resolve(serverPort);
      }
    });

    serverProcess.stderr?.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!serverPort) {
        reject(new Error('Server failed to start within 10 seconds'));
      }
    }, 10000);
  });
}

function stopDevServer() {
  if (serverProcess) {
    console.log('\n🛑 Stopping test server...\n');
    serverProcess.kill();
    serverProcess = null;
    serverPort = null;
  }
}

export default defineConfig({
  e2e: {
    // baseUrl will be set dynamically in setupNodeEvents
    baseUrl: undefined,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    viewportWidth: 1280,
    viewportHeight: 720,
    async setupNodeEvents(on, config) {
      copyScreenshot(on);

      // Start the server and set baseUrl before any tests run
      const port = await startDevServer();
      config.baseUrl = `http://localhost:${port}`;
      console.log(`✅ Using baseUrl: ${config.baseUrl}`);

      on('after:run', async () => {
        stopDevServer();
      });

      return config;
    },
  },
  // JUnit reporter for CI/CD integration
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
});
