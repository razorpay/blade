import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import UnoCSS from 'unocss/vite';
import { bladeIconFontPlugin } from '../src-cx/plugin/vite.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

/**
 * Storybook for src-cx, the checkout component library. Kept apart from
 * `.storybook` (src/): src-cx is styled by UnoCSS (`uno.config.ts`), whose
 * preflight would leak into src's CSS-module components.
 *
 * @type { import('@storybook/svelte-vite').StorybookConfig }
 */
const config = {
  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  stories: ['../src-cx/stories/**/*.stories.svelte'],
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
  viteFinal: async (config) => {
    config.plugins = [
      ...(config.plugins ?? []),
      // The Icon gallery imports the whole set, so the font holds every glyph.
      ...bladeIconFontPlugin(),
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
