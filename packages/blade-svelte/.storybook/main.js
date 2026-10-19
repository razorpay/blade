import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnoCSS from 'unocss/vite';
import bladePlugin from '../src/plugin/vite.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

/**
 * Storybook for src, styled by UnoCSS (`uno.config.ts`).
 *
 * @type { import('@storybook/svelte-vite').StorybookConfig }
 */
const config = {
  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  // Guides without a component are MDX pages.
  stories: ['../src/stories/**/*.stories.svelte', '../src/stories/**/*.mdx'],
  addons: [
    getAbsolutePath('@storybook/addon-svelte-csf'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-links'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/svelte-vite'),
    // Docgen re-parses each component and chokes on typed optional snippet
    // params. Stories take a custom `args` object, so
    // there are no component prop tables to generate anyway.
    options: { docgen: false },
  },
  docs: {
    autodocs: true,
  },
  features: {
    // No "Getting started" checklist in the sidebar.
    sidebarOnboardingChecklist: false,
  },
  viteFinal: async (config) => {
    config.plugins = [
      // The framework compiles no `.svelte` itself: it expects the app's plugin.
      svelte(),
      ...(config.plugins ?? []),
      // The Icon gallery imports the whole set, so the font holds every glyph.
      ...bladePlugin(),
      UnoCSS({
        configFile: resolve(packageRoot, 'uno.config.ts'),
        // Class maps live in plain `.ts` (`styles.ts`), which the default
        // pipeline does not scan.
        content: {
          pipeline: { include: [/\.(svelte|ts)($|\?)/] },
        },
      }),
    ];
    return config;
  },
};

export default config;
