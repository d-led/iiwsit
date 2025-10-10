/**
 * KaTeX integration for browser environment
 * Uses npm KaTeX package for rendering mathematical formulas
 * Renders formulas from data attributes in a separate section
 */

import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Initialize KaTeX - no initialization needed, just import
 */
export function initKaTeX(): void {
  console.log('KaTeX ready');
}

/**
 * Render all math formulas in the rendered formulas section
 */
export async function typesetMath(element?: HTMLElement): Promise<void> {
  try {
    console.log('Starting KaTeX rendering...');

    const targetElement = element || document;
    const formulaElements = targetElement.querySelectorAll('.formula-render[data-formula]');

    console.log(`Found ${formulaElements.length} formulas to render`);

    formulaElements.forEach((el, i) => {
      const formula = el.getAttribute('data-formula');
      if (!formula) return;

      console.log(`Processing formula ${i}: "${formula}"`);

      try {
        // Convert AsciiMath-like notation to TeX
        const texFormula = convertAsciiMathToTeX(formula);
        console.log(`Converted to TeX: "${texFormula}"`);

        // Render with KaTeX
        katex.render(texFormula, el as HTMLElement, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false,
        });

        // Start with 2em size and scale down if needed
        const container = el as HTMLElement;
        container.style.fontSize = '2em';
        container.style.padding = '1rem 0';
        container.style.overflow = 'hidden';

        // Check if formula overflows and scale down if needed
        requestAnimationFrame(() => {
          const parent = container.parentElement;
          if (parent) {
            const containerWidth = container.scrollWidth;
            const parentWidth = parent.clientWidth - 32; // Account for padding

            if (containerWidth > parentWidth) {
              const scale = parentWidth / containerWidth;
              // Don't scale below 1em (original size)
              const newSize = Math.max(1, 2 * scale);
              container.style.fontSize = `${newSize}em`;
              console.log(
                `Scaled formula ${i} from 2em to ${newSize.toFixed(2)}em (overflow: ${containerWidth}px > ${parentWidth}px)`
              );
            }
          }
        });

        console.log(`Successfully rendered formula ${i}`);
      } catch (err) {
        console.error(`Failed to render formula ${i}:`, err);
        // Show error in element
        (el as HTMLElement).textContent = `Error rendering: ${formula}`;
        (el as HTMLElement).style.color = '#cc0000';
      }
    });

    // Check processed elements
    setTimeout(() => {
      const processedElements = targetElement.querySelectorAll('.katex');
      console.log(`Found ${processedElements.length} processed KaTeX elements`);
    }, 100);
  } catch (err) {
    console.error('KaTeX rendering failed:', err);
  }
}

/**
 * Convert basic AsciiMath notation to TeX
 * This is a simple converter for common patterns
 */
function convertAsciiMathToTeX(asciimath: string): string {
  let tex = asciimath;

  // Convert underscore subscripts: R_("total") -> R_{\text{total}}
  tex = tex.replace(/(\w+)_\("([^"]+)"\)/g, '$1_{\\text{$2}}');
  tex = tex.replace(/(\w+)_\(([^)]+)\)/g, '$1_{$2}');
  tex = tex.replace(/(\w+)_(\w+)/g, '$1_{$2}');

  // Convert quoted strings: "text" -> \text{text}
  tex = tex.replace(/"([^"]+)"/g, '\\text{$1}');

  // Convert multiplication: * -> \times
  tex = tex.replace(/\*/g, '\\times');

  // Convert fractions: (a)/(b) -> \frac{a}{b}
  tex = tex.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');

  // Convert simple fractions: 1/x -> \frac{1}{x}
  tex = tex.replace(/(\d+)\/([a-zA-Z_]+)/g, '\\frac{$1}{$2}');

  // Greek letters and special symbols
  tex = tex.replace(/\bDelta\b/g, '\\Delta');
  tex = tex.replace(/\bdelta\b/g, '\\delta');
  tex = tex.replace(/\bsum\b/g, '\\sum');

  // Percentage sign
  tex = tex.replace(/%/g, '\\%');

  return tex;
}

/**
 * Check if KaTeX is loaded and ready
 */
export function isKaTeXReady(): boolean {
  return true; // KaTeX is always ready after import
}

/**
 * Wait for KaTeX to be ready (always resolves immediately)
 */
export function waitForKaTeX(_timeout = 1000): Promise<boolean> {
  return Promise.resolve(true);
}

/**
 * Setup responsive scaling for rendered formulas
 */
export function setupResponsiveFormulas(): void {
  let resizeTimeout: number;

  window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      const formulaElements = document.querySelectorAll('.formula-render[data-formula]');

      formulaElements.forEach((container) => {
        const el = container as HTMLElement;
        // Reset to 2em first
        el.style.fontSize = '2em';

        // Check if formula overflows and scale down if needed
        requestAnimationFrame(() => {
          const parent = el.parentElement;
          if (parent) {
            const containerWidth = el.scrollWidth;
            const parentWidth = parent.clientWidth - 32; // Account for padding

            if (containerWidth > parentWidth) {
              const scale = parentWidth / containerWidth;
              // Don't scale below 1em (original size)
              const newSize = Math.max(1, 2 * scale);
              el.style.fontSize = `${newSize}em`;
            }
          }
        });
      });
    }, 250);
  });
}
