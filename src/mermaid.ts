/**
 * Mermaid integration for rendering influence diagrams
 * Uses npm Mermaid package for rendering flowcharts and diagrams
 * Uses svg-pan-zoom for interactive zoom/pan (like mermaid.live)
 */

import mermaid from 'mermaid';
import svgPanZoom from 'svg-pan-zoom';

/**
 * Initialize Mermaid with configuration
 */
export function initMermaid(): void {
  mermaid.initialize({
    startOnLoad: false, // We'll use mermaid.run() instead
    theme: 'base',
    themeVariables: {
      primaryColor: '#e1f5fe',
      primaryTextColor: '#01579b',
      primaryBorderColor: '#01579b',
      lineColor: '#666666',
      secondaryColor: '#f3e5f5',
      tertiaryColor: '#e8f5e8',
      background: '#ffffff',
      mainBkg: '#ffffff',
      secondBkg: '#f7fafc',
      tertiaryBkg: '#e8f5e8',
      clusterBkg: '#f7fafc',
      clusterBorder: '#cbd5e0',
      defaultLinkColor: '#4299e1',
      titleColor: '#2d3748',
      nodeBorder: '#cbd5e0',
      nodeTextColor: '#2d3748',
      edgeLabelBackground: '#ffffff',
      edgeLabelColor: '#4a5568',
      section0: '#e1f5fe',
      section1: '#e8f5e8',
      section2: '#fff3e0',
      section3: '#ffebee',
      altSection: '#f3e5f5',
      gridColor: '#e2e8f0',
      textColor: '#2d3748',
      taskBkgColor: '#e1f5fe',
      taskTextColor: '#01579b',
      taskTextLightColor: '#0277bd',
      taskTextOutsideColor: '#01579b',
      taskTextClickableColor: '#1565c0',
      activeTaskBkgColor: '#81d4fa',
      activeTaskBorderColor: '#01579b'
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    },
    securityLevel: 'loose',
    maxTextSize: 100000
  });
  console.log('Mermaid initialized');
}

/**
 * Render all Mermaid diagrams in the document using mermaid.run()
 */
export async function renderMermaidDiagrams(): Promise<void> {
  try {
    console.log('Starting Mermaid rendering with mermaid.run()...');

    // Find all mermaid elements with content
    const mermaidElements = document.querySelectorAll('.mermaid');
    console.log(`Found ${mermaidElements.length} total Mermaid elements`);

    const elementsWithContent = Array.from(mermaidElements).filter(el => {
      const hasContent = el.textContent && el.textContent.trim().length > 0;
      if (!hasContent) {
        console.log('Empty Mermaid element:', el.id || 'unnamed', el.textContent);
      }
      return hasContent;
    });

    if (elementsWithContent.length === 0) {
      console.warn('No Mermaid elements with content found');
      return;
    }

    console.log(`Found ${elementsWithContent.length} Mermaid elements with content`);

    // Store original text content before rendering and add loading indicators
    elementsWithContent.forEach(el => {
      if (!el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', el.textContent || '');
      }

      // Add loading indicator to the parent container, not the mermaid element
      const parentContainer = el.parentElement;
      if (parentContainer) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'flex items-center justify-center p-8 text-gray-500 absolute inset-0 bg-white bg-opacity-90 z-10';
        loadingDiv.innerHTML = `
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Rendering diagram...</span>
          </div>
        `;
        parentContainer.style.position = 'relative';
        parentContainer.appendChild(loadingDiv);

        // Store reference to loading div for later removal
        el.setAttribute('data-loading-div', 'true');
        parentContainer.setAttribute('data-loading-div', 'true');
      }
    });

    // Use mermaid.run() on elements with content (cast to HTMLElement[])
    await mermaid.run({
      nodes: elementsWithContent as unknown as ArrayLike<HTMLElement>,
      suppressErrors: false
    });

    // Remove loading indicators after rendering
    elementsWithContent.forEach(el => {
      const parentContainer = el.parentElement;
      if (parentContainer && parentContainer.getAttribute('data-loading-div') === 'true') {
        const loadingDiv = parentContainer.querySelector('.flex.items-center.justify-center');
        if (loadingDiv) loadingDiv.remove();
        parentContainer.removeAttribute('data-loading-div');
        el.removeAttribute('data-loading-div');
      }
    });

    console.log('Mermaid rendering completed');

    // Enable svg-pan-zoom on all rendered diagrams
    enablePanZoomOnDiagrams();
  } catch (err) {
    console.error('Mermaid rendering failed:', err);
  }
}

/**
 * Enable svg-pan-zoom on all Mermaid diagrams (like mermaid.live does it)
 */
function enablePanZoomOnDiagrams(): void {
  const mermaidElements = document.querySelectorAll('.mermaid svg');

  mermaidElements.forEach((svg) => {
    if (svg instanceof SVGSVGElement) {
      try {
        // Make SVG fill the container
        svg.setAttribute('height', '100%');
        svg.style.height = '100%';

        // Initialize svg-pan-zoom with proper configuration
        const panZoomInstance = svgPanZoom(svg, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.1,
          maxZoom: 10,
          zoomScaleSensitivity: 0.3,
          dblClickZoomEnabled: true,
          mouseWheelZoomEnabled: true,
          preventMouseEventsDefault: true,
          contain: false
        });

        // Reposition controls properly after initialization
        setTimeout(() => {
          const controls = svg.querySelector('g[id="svg-pan-zoom-controls"]');
          if (controls) {
            const svgRect = svg.getBoundingClientRect();

            // Position controls in top-right corner with proper scaling
            const xPosition = svgRect.width - 80; // 80px from right
            const yPosition = 20; // 20px from top

            // Reset any existing transform and set proper position and scale
            controls.setAttribute('transform', `translate(${xPosition}, ${yPosition}) scale(0.6)`);

            console.log('Controls repositioned to:', xPosition, yPosition);
          } else {
            console.warn('svg-pan-zoom controls not found');
          }
        }, 100);

        // Add fullscreen button
        addFullscreenButton(svg, panZoomInstance);

        console.log('svg-pan-zoom enabled on diagram with custom positioning');
      } catch (err) {
        console.warn('Failed to enable svg-pan-zoom:', err);
      }
    }
  });
}

/**
 * Add fullscreen button to diagram
 */
function addFullscreenButton(svg: SVGSVGElement, _panZoomInstance: any): void {
  const container = svg.parentElement;
  if (!container) return;

  // Create fullscreen button
  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.id = 'fullscreen-diagram-btn';
  fullscreenBtn.className = 'absolute top-2 left-2 z-10 bg-white/90 hover:bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium shadow-sm';
  fullscreenBtn.innerHTML = `
    <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
    </svg>
    Fullscreen
  `;
  fullscreenBtn.title = 'Open diagram in fullscreen with zoom/pan';

  // Make container relative for absolute positioning
  container.style.position = 'relative';
  container.style.overflow = 'visible'; // Ensure controls are not clipped
  container.appendChild(fullscreenBtn);

  // Add click handler
  fullscreenBtn.addEventListener('click', () => {
    openFullscreenDiagram();
  });
}

/**
 * Check if Mermaid is ready
 */
export function isMermaidReady(): boolean {
  return true; // Mermaid is always ready after import and init
}

/**
 * Wait for Mermaid to be ready (always resolves immediately)
 */
export function waitForMermaid(_timeout = 1000): Promise<boolean> {
  return Promise.resolve(true);
}

/**
 * Create fullscreen modal for Mermaid diagram
 */
export function createFullscreenModal(): void {
  // Check if modal already exists
  if (document.getElementById('mermaid-fullscreen-modal')) {
    console.log('Fullscreen modal already exists');
    return;
  }

  // Create modal HTML - simplified to use Mermaid's native controls
  const modalHTML = `
    <div id="mermaid-fullscreen-modal" class="fixed inset-0 bg-black bg-opacity-75 z-50 hidden">
      <div class="flex flex-col h-full">
        <!-- Header with close button only -->
        <div class="bg-base-100 p-4 flex justify-between items-center border-b">
          <h3 class="text-xl font-bold">📈 Influence Diagram - Full Screen</h3>
          <button id="close-fullscreen-btn" class="btn btn-sm btn-error">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Close
          </button>
        </div>

        <!-- Diagram container - let Mermaid handle zoom/pan natively -->
        <div class="flex-1 overflow-hidden relative">
          <div id="fullscreen-mermaid-container" class="w-full h-full bg-white">
            <div id="fullscreen-mermaid-diagram" class="mermaid w-full h-full">
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="bg-base-100 p-2 text-center text-sm text-base-content/70 border-t">
          💡 Use mouse wheel to zoom, drag to pan (Mermaid native controls)
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Setup simplified event listeners
  setupFullscreenControls();

  console.log('Fullscreen modal created successfully');
}

/**
 * Setup fullscreen modal controls - simplified to use Mermaid's native functionality
 */
function setupFullscreenControls(): void {
  const modal = document.getElementById('mermaid-fullscreen-modal');
  const closeBtn = document.getElementById('close-fullscreen-btn');

  if (!modal || !closeBtn) {
    console.error('Fullscreen modal elements not found');
    return;
  }

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
    // Clear the fullscreen diagram content to allow re-rendering
    const fullscreenDiagram = document.getElementById('fullscreen-mermaid-diagram');
    if (fullscreenDiagram) {
      fullscreenDiagram.innerHTML = '';
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      // Clear the fullscreen diagram content to allow re-rendering
      const fullscreenDiagram = document.getElementById('fullscreen-mermaid-diagram');
      if (fullscreenDiagram) {
        fullscreenDiagram.innerHTML = '';
      }
    }
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      // Clear the fullscreen diagram content to allow re-rendering
      const fullscreenDiagram = document.getElementById('fullscreen-mermaid-diagram');
      if (fullscreenDiagram) {
        fullscreenDiagram.innerHTML = '';
      }
    }
  });
}


/**
 * Open fullscreen modal with the diagram
 */
export function openFullscreenDiagram(): void {
  const modal = document.getElementById('mermaid-fullscreen-modal');
  const fullscreenDiagram = document.getElementById('fullscreen-mermaid-diagram');
  const originalDiagram = document.getElementById('influence-diagram');

  if (!modal || !fullscreenDiagram || !originalDiagram) {
    console.error('Fullscreen modal elements not found');
    return;
  }

  // Clear any previous rendering state by removing data-processed attribute
  fullscreenDiagram.removeAttribute('data-processed');

  // Get the original diagram text content (before rendering)
  const originalText = originalDiagram.getAttribute('data-original-text');
  if (originalText) {
    // Use the stored original text
    fullscreenDiagram.textContent = originalText;
  } else {
    // Fallback: try to extract just the Mermaid text, not the rendered SVG
    const mermaidText = originalDiagram.textContent;
    if (mermaidText && mermaidText.trim().length > 0) {
      fullscreenDiagram.textContent = mermaidText;
    } else {
      console.error('No original diagram text found');
      return;
    }
  }

  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  // Re-render the diagram in fullscreen mode
  setTimeout(async () => {
    if (isMermaidReady()) {
      try {
        // Check if fullscreen diagram has content
        if (!fullscreenDiagram.textContent || fullscreenDiagram.textContent.trim().length === 0) {
          console.warn('Fullscreen diagram has no content');
          return;
        }

        // Use mermaid.run() for the fullscreen diagram
        await mermaid.run({
          nodes: [fullscreenDiagram],
          suppressErrors: false
        });

        console.log('Fullscreen diagram rendered');

        // Enable svg-pan-zoom on the fullscreen diagram
        const svg = fullscreenDiagram.querySelector('svg');
        if (svg instanceof SVGSVGElement) {
          // Make SVG fill the full container
          svg.setAttribute('height', '100%');
          svg.style.height = '100%';

          // Initialize pan/zoom functionality (instance not needed)
          svgPanZoom(svg, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1,
            maxZoom: 10,
            zoomScaleSensitivity: 0.3,
            dblClickZoomEnabled: true,
            mouseWheelZoomEnabled: true,
            preventMouseEventsDefault: true,
            contain: false
          });

          // Reposition fullscreen controls properly after initialization
          setTimeout(() => {
            const controls = svg.querySelector('g[id="svg-pan-zoom-controls"]');
            if (controls) {
              const svgRect = svg.getBoundingClientRect();

              // Position controls in top-right corner with proper scaling for fullscreen
              const xPosition = svgRect.width - 100; // 100px from right for fullscreen
              const yPosition = 30; // 30px from top for fullscreen

              // Reset any existing transform and set proper position and scale
              controls.setAttribute('transform', `translate(${xPosition}, ${yPosition}) scale(0.7)`);

              console.log('Fullscreen controls repositioned to:', xPosition, yPosition);
            } else {
              console.warn('Fullscreen svg-pan-zoom controls not found');
            }
          }, 100);

          console.log('svg-pan-zoom enabled on fullscreen diagram');
        }
      } catch (err) {
        console.error('Failed to render fullscreen diagram:', err);
      }
    }
  }, 100);
}

/**
 * Setup Mermaid rendering for expandable sections
 */
export function setupMermaidExpansion(): void {
  // Find the influence diagram details element
  const detailsElements = document.querySelectorAll('details');
  const influenceDiagramDetails = Array.from(detailsElements).find((details) =>
    details.textContent?.includes('Factor Influence Map')
  );

  if (influenceDiagramDetails) {
    influenceDiagramDetails.addEventListener('toggle', async () => {
      if (influenceDiagramDetails.open) {
        // Wait a bit for the collapse animation, then render
        setTimeout(async () => {
          if (isMermaidReady()) {
            console.log('Influence diagram section expanded, rendering with Mermaid...');
            await renderMermaidDiagrams();

            // Fullscreen button is now added directly by enablePanZoomOnDiagrams()
          }
        }, 300);
      }
    });
  }
}

