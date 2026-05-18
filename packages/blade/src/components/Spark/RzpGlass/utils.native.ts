import type { RzpGlassPreset } from './presets';

const DEFAULT_CDN_PATH = 'https://cdn.jsdelivr.net/npm/@razorpay/blade@latest/assets/spark';

async function preloadRazorSenseAssets(
  _preset: RzpGlassPreset = 'default',
  _assetsPath: string = DEFAULT_CDN_PATH,
): Promise<void> {
  // no-op on native
}

export { DEFAULT_CDN_PATH, preloadRazorSenseAssets };
