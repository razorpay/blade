import { dirname } from "path";
import { fileURLToPath } from "url";

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
};

export default config;