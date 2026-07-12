import type { RzpGlassPreset } from './presets';
import type { RazorSenseMode } from './modes';
import type { PreloadRazorSenseOptions } from './types';
import type { ColorSchemeNames } from '~tokens/theme';

const DEFAULT_CDN_PATH = `https://cdn.jsdelivr.net/npm/@razorpay/blade@${__BLADE_VERSION__}/assets/spark`;

async function preloadRazorSense(_options: PreloadRazorSenseOptions): Promise<void> {
  // no-op on native
}

async function preloadRazorSenseAssets(
  _preset: RzpGlassPreset = 'default',
  _assetsPath: string = DEFAULT_CDN_PATH,
): Promise<void> {
  // no-op on native
}

async function preloadRazorSenseModeAssets(
  modesOrModes: RazorSenseMode | readonly RazorSenseMode[] = 'neutral',
  assetsPath: string = DEFAULT_CDN_PATH,
  colorScheme: ColorSchemeNames = 'light',
): Promise<void> {
  await preloadRazorSense({
    modes: modesOrModes,
    assetsPath,
    colorSchemes: colorScheme,
  });
}

// no-op stubs for web-only utilities — not available on native.
// Return Promise<never> since these always reject and HTMLImageElement/HTMLVideoElement
// are DOM types that don't exist in React Native's type environment.
async function loadImage(_src: string): Promise<never> {
  return Promise.reject(new Error('loadImage is not supported on native'));
}

async function loadVideo(_src: string): Promise<never> {
  return Promise.reject(new Error('loadVideo is not supported on native'));
}

function captureVideoCoverFrame(
  _video: unknown,
  _canvas: unknown,
  _container: unknown,
  _verticalAlignment?: 'center' | 'bottom',
  _opacity?: number,
  _clearCanvas?: boolean,
): void {
  // no-op on native
}

function isSafari(): boolean {
  return false;
}

function bestGuessBrowserZoom(): number {
  return 1;
}

function getDefaultAssets(_assetsPath: string): Record<string, string> {
  return {};
}

function getPresetAssets(_preset: string | undefined, _assetsPath: string): Record<string, string> {
  return {};
}

function resolveConfig(
  _props: Record<string, unknown>,
  _assetsPath: string,
): Record<string, unknown> {
  return {};
}

export {
  DEFAULT_CDN_PATH,
  preloadRazorSense,
  preloadRazorSenseAssets,
  preloadRazorSenseModeAssets,
  captureVideoCoverFrame,
  loadImage,
  loadVideo,
  isSafari,
  bestGuessBrowserZoom,
  getDefaultAssets,
  getPresetAssets,
  resolveConfig,
};
