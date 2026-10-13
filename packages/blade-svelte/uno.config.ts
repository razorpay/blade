// The package's own UnoCSS config (Storybook, the tests): Blade's defaults.
// An app imports `bladeUnoConfig` from `@razorpay/blade-svelte/configs/uno`
// (`./uno/config.ts`) and spreads it into its own.
import bladeUnoConfig from './uno/config';

export default bladeUnoConfig();
