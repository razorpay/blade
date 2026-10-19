import bladeUnoConfig from '@razorpay/blade-svelte/configs/uno';

// Blade's config: its token classes, the `d:` desktop variant at 62.5rem,
// and Blade's preflights.
export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }),
  content: {
    // The modules the build bundles, Blade's included: only the components
    // the app imports reach the CSS. Blade's class maps are plain `.ts`
    // (`styles.ts`), which the default pipeline does not read.
    pipeline: { include: [/\.(svelte|[jt]s)($|\?)/] },
  },
};
