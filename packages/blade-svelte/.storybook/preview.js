// Import global styles and blade-core theme CSS
import '../src/global.css';
import '@razorpay/blade-core/tokens/theme.css';
import './preview.css';

// Theme management function
function updateTheme(scheme) {
  if (scheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else if (scheme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  } else {
    document.body.removeAttribute('data-theme');
  }
}

// Listen for Storybook global updates via window channel
if (typeof window !== 'undefined') {
  // Wait for Storybook to initialize
  setTimeout(() => {
    if (window.__STORYBOOK_ADDONS_CHANNEL__) {
      const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
      
      // Listen for global updates
      channel.on('updateGlobals', (update) => {
        if (update?.globals?.colorScheme !== undefined) {
          updateTheme(update.globals.colorScheme);
        }
      });
      
      // Apply initial theme from current globals
      const currentGlobals = channel.lastEvent?.globals || {};
      if (currentGlobals.colorScheme) {
        updateTheme(currentGlobals.colorScheme);
      }
    }
  }, 0);
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (window.__STORYBOOK_ADDONS_CHANNEL__) {
      const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
      const currentGlobals = channel.lastEvent?.globals || {};
      if (currentGlobals.colorScheme === 'system') {
        updateTheme('system');
      }
    }
  });
}

/** @type { import('@storybook/svelte-vite').Preview } */
const preview = {
  parameters: {
    // Disable snapshot by default (similar to React setup)
    chromatic: {
      disableSnapshot: true,
      pauseAnimationAtEnd: true,
    },
    previewTabs: {
      'storybook/docs/panel': { index: 0 },
      canvas: { title: 'Stories', index: 1 },
    },
    backgrounds: {
      disable: true,
      grid: {
        disable: true,
      },
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Small Mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
        mobile2: {
          name: 'Large Mobile',
          styles: {
            width: '414px',
            height: '896px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
      },
    },
    // On development, don't force viewMode so live reload works smoothly
    viewMode: process.env.NODE_ENV === 'development' ? undefined : 'docs',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Guides',
          ['Installation'],
          'Components',
          [
            'Amount',
            'Button',
            'Link',
            'Typography',
            ['Code','Heading', 'Text'],
            'Spinner',
          ],
        ],
      },
    },
  },
  // Note: Decorators removed - they don't work correctly with svelte-csf
  // Theme switching is handled via preview-head.html script
  globalTypes: {
    colorScheme: {
      name: 'Color Scheme',
      description: 'Color Scheme for Blade',
      defaultValue: 'light',
      toolbar: {
        icon: 'eye',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        showName: true,
      },
    },
    brandColor: {
      name: 'Brand Color',
      description: 'Brand Color (You can pass any valid color to BladeProvider)',
      defaultValue: undefined,
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: undefined, title: 'Razorpay' },
          { value: '#EE681A', title: 'ICICI' },
          { value: '#83003D', title: 'Axis' },
          { value: '#15A5EB', title: 'SBI' },
          { value: '#107259', title: 'IDBI' },
          { value: '#FFF10A', title: 'Allahabad' },
          { value: '#F32951', title: 'BookMyShow' },
          { value: '#F86B15', title: 'Swiggy' },
          { value: '#CF2033', title: 'Zomato' },
          { value: '#19BEA2', title: 'DSP Mutual Fund' },
          { value: '#DF005D', title: 'Nykaa' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;
