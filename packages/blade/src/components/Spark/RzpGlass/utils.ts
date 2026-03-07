/**
 * RzpGlass Utility Functions
 */

import type { RzpGlassPreset } from './presets';
import { getPresets } from './presets';
import { RzpGlassAssets, RzpGlassConfig, RzpGlassPresetDefinition, RzpGlassProps } from './types';

const DEFAULT_CDN_PATH = 'https://cdn.jsdelivr.net/npm/@razorpay/blade/assets/spark';

const getDefaultAssets = (assetsPath: string): Required<RzpGlassAssets> => ({
  videoSrc: `${assetsPath}/spark-base-video.mp4`,
  imageSrc: `${assetsPath}/bottom-frame.jpg`,
  gradientMapSrc: `${assetsPath}/colorama-gradient-map-green.jpg`,
  gradientMap2Src: `${assetsPath}/colorama-gradient-map-blue.jpg`,
  centerGradientMapSrc: `${assetsPath}/colorama-center-gradient-map.jpg`,
});

/**
 * Extract config from props (exclude non-config props).
 * Strips undefined values so they don't clobber preset defaults.
 */
function extractConfig(props: RzpGlassProps): Partial<RzpGlassConfig> {
  const {
    width: _width,
    height: _height,
    className: _className,
    style: _style,
    onLoad: _onLoad,
    onError: _onError,
    preset: _preset,
    assetsPath: _assetsPath,
    gradientMapSrc: _gradientMapSrc,
    gradientMap2Src: _gradientMap2Src,
    gradientMapCanvas: _gradientMapCanvas,
    imageSrc: _imageSrc,
    ...config
  } = props;

  // Drop keys with undefined values so preset config isn't overridden by unset props
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    Object.entries(config).filter(([, v]) => v !== undefined),
  ) as Partial<RzpGlassConfig>;
}

const ASSET_KEYS = new Set<string>([
  'videoSrc',
  'imageSrc',
  'gradientMapSrc',
  'gradientMap2Src',
  'centerGradientMapSrc',
]);

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
function getPresetDefinition(
  preset: RzpGlassPreset | undefined,
  assetsPath: string,
): RzpGlassPresetDefinition {
  const presets = getPresets(assetsPath);
  if (preset && preset in presets) return { ...presets[preset] };
  return {};
}

function getPresetConfig(
  preset: RzpGlassPreset | undefined,
  assetsPath: string,
): Partial<RzpGlassConfig> {
  const def = getPresetDefinition(preset, assetsPath) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(def).filter(([k]) => !ASSET_KEYS.has(k)),
  ) as Partial<RzpGlassConfig>;
}

function getPresetAssets(
  preset: RzpGlassPreset | undefined,
  assetsPath: string,
): Partial<RzpGlassAssets> {
  const def = getPresetDefinition(preset, assetsPath) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(def).filter(([k]) => ASSET_KEYS.has(k)),
  ) as Partial<RzpGlassAssets>;
}

/**
 * Merge preset config with user-provided config.
 * Preset values are used as base; any explicit prop overrides them.
 */
function resolveConfig(props: RzpGlassProps, assetsPath: string): Partial<RzpGlassConfig> {
  return {
    ...getPresetConfig(props.preset, assetsPath),
    ...extractConfig(props),
  };
}

/**
 * Load an image from URL
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Load a video from URL
 */
function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.oncanplaythrough = () => resolve(video);
    video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
    video.load();
  });
}

/**
 * Check if browser is Safari
 */
function isSafari(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android');
}

/**
 * Best guess browser zoom level (for Safari which doesn't include zoom in devicePixelRatio)
 */
function bestGuessBrowserZoom(): number {
  const viewportScale = visualViewport?.scale ?? 1;
  const viewportWidth = visualViewport?.width ?? window.innerWidth;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const innerWidth = viewportScale * viewportWidth + scrollbarWidth;

  const ratio = outerWidth / innerWidth;
  const zoomPercentageRounded = Math.round(100 * ratio);

  // Common zoom levels divisible by 5%
  if (zoomPercentageRounded % 5 === 0) {
    return zoomPercentageRounded / 100;
  }

  // Handle special zoom levels
  if (zoomPercentageRounded === 33) return 1 / 3;
  if (zoomPercentageRounded === 67) return 2 / 3;
  if (zoomPercentageRounded === 133) return 4 / 3;

  return ratio;
}

/**
 * Preload all assets for a given RazorSense preset.
 * This ensures videos and images are fully loaded before the component mounts,
 * preventing frame skipping in one-shot animations.
 *
 * @param preset - The preset name to preload assets for
 * @param assetsPath - Optional CDN path for assets (defaults to Blade CDN)
 * @returns Promise that resolves when all assets are loaded
 *
 * @example
 * ```tsx
 * // Preload before showing the animation
 * await preloadRazorSenseAssets('circleSlideUp');
 *
 * // Now mount the component - assets are already cached
 * <RazorSense preset="circleSlideUp" />
 * ```
 */
async function preloadRazorSenseAssets(
  preset: RzpGlassPreset = 'default',
  assetsPath: string = DEFAULT_CDN_PATH,
): Promise<void> {
  const presets = getPresets(assetsPath);
  const presetDef = presets[preset] || {};
  const defaultAssets = getDefaultAssets(assetsPath);

  const videoSrc = presetDef.videoSrc ?? defaultAssets.videoSrc;
  const imageSrc = presetDef.imageSrc;
  const gradientMapSrc = presetDef.gradientMapSrc ?? defaultAssets.gradientMapSrc;
  const gradientMap2Src = presetDef.gradientMap2Src ?? defaultAssets.gradientMap2Src;
  const centerGradientMapSrc = presetDef.centerGradientMapSrc ?? defaultAssets.centerGradientMapSrc;

  const loadPromises: Promise<unknown>[] = [];

  if (imageSrc) {
    loadPromises.push(loadImage(imageSrc));
  } else if (videoSrc) {
    loadPromises.push(loadVideo(videoSrc));
  }

  loadPromises.push(
    loadImage(gradientMapSrc),
    loadImage(gradientMap2Src),
    loadImage(centerGradientMapSrc),
  );

  await Promise.all(loadPromises);
}

export {
  DEFAULT_CDN_PATH,
  getDefaultAssets,
  loadImage,
  loadVideo,
  isSafari,
  bestGuessBrowserZoom,
  preloadRazorSenseAssets,
  getPresetAssets,
  resolveConfig,
};
