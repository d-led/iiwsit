# Is It Worth Speeding It (Throughput)?

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

An interactive decision helper tool to determine whether performance optimizations in throughput systems are worth the investment. Inspired by [xkcd #1205: "Is It Worth the Time?"](https://xkcd.com/1205/).

🔗 **[Live Demo](https://d-led.github.io/iiwsit/)**

## 🎯 What Is This?

Making decisions about performance optimizations can be tricky. Should you spend weeks optimizing a system that processes thousands of requests per second? What if the optimization introduces bugs? What about maintenance costs?

This tool helps you make data-driven decisions by calculating:

- **Time savings** based on request rate and speed improvements
- **Cost analysis** including implementation and ongoing maintenance
- **Failure impact** considering both current failures and potential bugs
- **Break-even point** to know when the optimization pays for itself
- **ROI (Return on Investment)** to quantify the value

## ✨ Features

- 🎨 Beautiful, modern UI built with **daisyUI** and **Tailwind CSS**
- 📊 Comprehensive calculation breakdown with detailed metrics
- 🎯 Clear YES/NO/MAYBE recommendations with confidence scores
- 📈 Human-readable explanations of the decision factors
- 🧪 Tested with **Vitest** and **Cypress**
- 📱 Fully responsive design for mobile and desktop
- ⚡ Fast and lightweight, built with **Vite**
- 🏷️ Version tracking (displays git branch and commit SHA in footer)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/d-led/iiwsit.git
cd iiwsit

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action.

## 📖 Usage

### Input Parameters

The calculator requires the following inputs:

1. **Request Rate**: How many requests your system handles per second/minute/hour
2. **Average Request Duration**: How long each request takes to process
3. **Expected Speed Gain**: Percentage improvement you expect (e.g., 20% faster)
4. **Current Failure Rate**: Percentage of requests failing or missing deadlines now
5. **Expected Bug-Induced Failure Rate**: Potential failures from newly introduced bugs
6. **Maintenance Time**: Ongoing time investment to maintain the optimization
7. **Implementation Time**: One-time hours needed to implement
8. **Time Horizon**: How long you plan to use this system

### Example Scenarios

#### High-Traffic API Optimization

- Request Rate: **1000 req/second**
- Duration: **500 milliseconds**
- Speed Gain: **30%**
- Implementation: **80 hours**
- Result: **Strong YES** ✅

#### Low-Traffic Background Job

- Request Rate: **10 req/hour**
- Duration: **2 minutes**
- Speed Gain: **50%**
- Implementation: **200 hours**
- Result: **Strong NO** ❌

## 🏗️ Project Structure

```
iiwsit/
├── src/
│   ├── types.ts           # TypeScript type definitions
│   ├── calculator.ts      # Core calculation logic
│   ├── calculator.test.ts # Comprehensive test suite
│   ├── main.ts           # Application entry point
│   ├── styles.css        # Global styles (Tailwind)
│   └── index.html        # Main HTML template
├── pages/                # Built output for GitHub Pages
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vitest.config.ts     # Vitest testing configuration
├── .prettierrc          # Prettier code formatting
├── .editorconfig        # Editor configuration
├── package.json         # Project dependencies
├── LICENSE              # MPLv2 license
└── README.md           # This file
```

## 🧪 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate test coverage report
npm run test:coverage

# Format code with Prettier
npm run prettier

# Check code formatting
npm run prettier:check
```

### Running Tests

The project includes comprehensive tests at multiple levels:

#### Unit Tests

Pure unit tests for the calculator logic, focusing on behavior rather than implementation details:

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Open test UI
npm run test:ui
```

#### E2E Tests with Cypress

Human-readable end-to-end tests that verify the complete user workflows:

```bash
# Open Cypress interactive test runner
npm run cypress

# Run Cypress tests headless (automatically starts dev server)
npm run test:e2e

# Run Cypress tests against production build
npm run test:e2e:ci
```

The Cypress tests are written using custom commands that read like a script:

- `cy.visitCalculator()` - Navigate to the calculator
- `cy.fillHighTrafficScenario()` - Fill in a high-traffic scenario
- `cy.clickCalculate()` - Submit the form
- `cy.shouldShowDecision('YES')` - Verify the decision
- `cy.shouldShowPositiveROI()` - Verify positive ROI is displayed

These abstractions make tests easy to read and maintain without coupling to implementation details.

### Code Formatting

This project uses Prettier for consistent code formatting:

```bash
# Format all files
npm run prettier

# Check if files are formatted
npm run prettier:check
```

The `.editorconfig` file ensures that all editors use consistent settings.

## 📐 How It Works

### Calculation Method

The calculator uses the following approach:

1. **Normalize all units** to hours for consistent calculations
2. **Calculate total requests** over the time horizon
3. **Compute time saved** = requests × duration × speed_gain_percentage
4. **Sum all costs** = implementation_time + (maintenance_time × time_horizon)
5. **Calculate net benefit** = time_saved - total_costs
6. **Compute ROI** = (net_benefit / total_costs) × 100
7. **Find break-even** = when cumulative savings equal cumulative costs

### Decision Logic

The tool makes recommendations based on multiple weighted factors:

- **Net Benefit** (30 points): Positive time savings after all costs
- **ROI** (25 points): Return on investment percentage
- **Break-Even Time** (20 points): How quickly the optimization pays for itself
- **Failure Rate Impact** (15 points): Net change in system reliability
- **Speed Gain Magnitude** (10 points): Size of the performance improvement

**Decision Thresholds:**

- **YES** (Confidence ≥ 60%): Strong recommendation to proceed
- **MAYBE** (Confidence 40-59%): Borderline case, consider additional factors
- **NO** (Confidence < 40%): Not recommended

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Guidelines

1. Write tests for new features
2. Ensure tests pass: `npm test`
3. Format code: `npm run prettier`
4. Follow the existing code style
5. Update documentation as needed

## 📜 License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE](LICENSE) file for details.

The MPLv2 is a simple copyleft license that allows you to:

- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Use privately
- ✅ Include in larger works under different licenses

Just ensure that modifications to MPL-licensed files remain under MPL.

## 🙏 Acknowledgments

- Inspired by [xkcd #1205: "Is It Worth the Time?"](https://xkcd.com/1205/) by Randall Munroe
- Calculator logic reference: [xkcd calculator by Albert Thompson](https://c.albert-thompson.com/xkcd/)
- Built with [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [daisyUI](https://daisyui.com/), and [Vitest](https://vitest.dev/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/d-led/iiwsit/issues) page
2. Create a new issue with details about your problem
3. Include your input parameters and expected vs. actual behavior

## 🗺️ Roadmap

Future enhancements being considered:

- [ ] Support for percentile-based duration calculations
- [ ] Cost in monetary terms (not just time)
- [ ] Export/import calculation scenarios
- [ ] Comparison mode for multiple optimization strategies
- [ ] Historical tracking of decisions and outcomes
- [ ] Dark mode theme toggle
- [ ] Shareable calculation links

---

Made with ❤️ and inspired by xkcd. Because not all optimizations are worth optimizing.
