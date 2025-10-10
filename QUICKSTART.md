# Quick Start Guide

## Installation and Setup

```bash
# Navigate to the project
cd /Users/d-led/src/iiwsit

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173** in your browser.

## Available Commands

### Development

```bash
npm run dev         # Start dev server with hot reload
npm run build       # Build for production
npm run preview     # Preview production build locally
```

### Testing

```bash
# Unit Tests
npm test            # Run unit tests
npm run test:ui     # Open Vitest UI

# E2E Tests
npm run cypress     # Open Cypress UI (interactive)
npm run test:e2e    # Run E2E tests headless

# All tests
npm test && npm run test:e2e
```

### Code Quality

```bash
npm run prettier        # Format all code
npm run prettier:check  # Check if code is formatted
```

## Project Features

✅ **Modern Tech Stack**

- TypeScript for type safety
- Vite for fast builds and HMR
- daisyUI + Tailwind CSS for beautiful UI

✅ **Comprehensive Testing**

- Unit tests with Vitest (pure logic testing)
- E2E tests with Cypress (user workflow testing)
- Human-readable test scripts with custom commands
- JUnit XML reporting for CI/CD

✅ **CI/CD Ready**

- GitHub Actions workflows configured
- Automatic deployment to GitHub Pages
- Test results published on PRs

✅ **Developer Experience**

- Prettier for consistent formatting
- EditorConfig for cross-editor consistency
- VS Code settings and extensions included
- TypeScript for IntelliSense and type checking

## Testing Examples

### Run a Single Unit Test

```bash
npm test -- --run -t "should recommend proceeding"
```

### Run E2E Tests for Specific File

```bash
npm run cypress:headless -- --spec "cypress/e2e/calculator-workflow.cy.ts"
```

### Watch Mode for TDD

```bash
npm test -- --watch
```

## Deployment

The project is configured to automatically deploy to GitHub Pages when you push to `main`:

1. Ensure GitHub Pages is enabled in repository settings
2. Push to main branch
3. GitHub Actions will build and deploy
4. Site will be available at `https://d-led.github.io/iiwsit/`

## Next Steps

1. Try the calculator at http://localhost:5173
2. Read the full [README.md](./README.md)
3. Check out [CONTRIBUTING.md](./CONTRIBUTING.md) if you want to contribute
4. Explore the test files to see examples of good test practices

## Troubleshooting

### Port 5173 already in use

```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill

# Or use a different port
npm run dev -- --port 3000
```

### Cypress won't start

```bash
# Reinstall Cypress
npm install cypress --force
```

### Build fails

```bash
# Clear caches
rm -rf node_modules pages dist
npm install
npm run build
```

## Resources

- [xkcd #1205: Is It Worth the Time?](https://xkcd.com/1205/)
- [Vite Documentation](https://vitejs.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
- [daisyUI Components](https://daisyui.com/components/)
- [Vitest Documentation](https://vitest.dev/)
