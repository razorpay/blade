// Import global styles and blade-core theme CSS
import '../src/global.css';
import '@razorpay/blade-core/tokens/theme.css';
import './preview.css';
import BladeThemeDecorator from './BladeThemeDecorator.svelte';

/** @type { import('@storybook/svelte-vite').Preview } */
const preview = {
  parameters: {
    // Opt out of Storybook's default `.sb-main-padded` 1rem body padding so the
    // canvas chrome defined in preview.css (`#storybook-root` / `.docs-story`)
    // is the single source of truth — matches React blade's StoryCanvas decorator.
    layout: 'fullscreen',
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
          ['Amount', 'Button', 'Link', 'Typography', ['Code', 'Heading', 'Text'], 'Spinner'],
        ],
      },
    },
  },
  decorators: [
    (storyFn, context) => ({
      Component: BladeThemeDecorator,
      props: {
        colorScheme: context.globals.colorScheme ?? 'light',
        brandColor: context.globals.brandColor,
        skipProvider: context.parameters.skipBladeProviderDecorator === true,
      },
      slots: {
        default: storyFn,
      },
    }),
  ],
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
      description: 'Brand Color passed to createTheme for BladeProvider',
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
