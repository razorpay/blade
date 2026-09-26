import 'virtual:uno.css';
import '@razorpay/blade-core/fonts.css';
import './preview.css';

/** @type { import('@storybook/svelte-vite').Preview } */
const preview = {
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '360px', height: '740px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Guides', 'Components'],
      },
    },
  },
};

export default preview;
