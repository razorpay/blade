import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.stories.@(js|ts|svelte)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-svelte-csf",
  ],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Resolve blade-core imports directly to source files for better re-export handling
    // Note: We use a custom resolve function to handle exact matches only
    const bladeCoreRoot = resolve(__dirname, '../../blade-core/src');
    config.resolve = config.resolve || {};
    config.resolve.alias = [
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
      // Only match exact paths (not sub-paths like tokens/theme.css)
      {
        find: /^@razorpay\/blade-core\/utils$/,
        replacement: resolve(bladeCoreRoot, 'utils/index.ts'),
      },
      {
        find: /^@razorpay\/blade-core\/styles$/,
        replacement: resolve(bladeCoreRoot, 'styles/index.ts'),
      },
      {
        find: /^@razorpay\/blade-core\/tokens$/,
        replacement: resolve(bladeCoreRoot, 'tokens/index.ts'),
      },
      // Internal blade-core aliases (needed when resolving source files)
      {
        find: /^~utils(\/.*)?$/,
        replacement: resolve(bladeCoreRoot, 'utils$1'),
      },
      {
        find: /^~tokens(\/.*)?$/,
        replacement: resolve(bladeCoreRoot, 'tokens$1'),
      },
      {
        find: /^~src(\/.*)?$/,
        replacement: resolve(bladeCoreRoot, '$1'),
      },
    ];
    return config;
  },
};

export default config;