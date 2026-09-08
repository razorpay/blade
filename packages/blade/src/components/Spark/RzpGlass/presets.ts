import type { RzpGlassConfig, RzpGlassPresetDefinition } from './types';

// ============================================
// DEFAULT CONFIG VALUES
// ============================================
const DEFAULT_CONFIG: Required<RzpGlassConfig> = {
  // Input Phase
  inputMin: 0.0,
  inputMax: 1.0,
  // Modify Phase
  modifyGamma: 1.05,
  posterizeLevels: 0.0,
  cycleRepetitions: 1.0,
  phaseShift: 0.0,
  cycleSpeed: 0.0,
  // Output Cycle
  wrapMode: false,
  reverse: true,
  // Composite
  blendWithOriginal: 0.0,
  gradientMapBlend: 0.0,
  gradientMapBlendDuration: 0.6,

  // Center Element
  enableCenterElement: true,
  centerAnimDuration: 6.0,

  // Color Correction
  ccBlackPoint: 0.0,
  ccWhitePoint: 0.9,
  ccMidtoneGamma: 1.2,
  ccGamma: 1.2,
  ccContrast: 0.0,

  // Displacement
  numSegments: 45.0,
  slitAngle: 0.15,
  displacementX: -12.0,
  displacementY: -20.0,

  // Playback
  paused: false,
  startTime: 0,
  endTime: 14,
  animateLightIndependently: false,
  playbackRate: 1.0,

  // Light Effect
  lightIntensity: 0.2,
  specularTint: [1, 1, 1],
  lightStartFrame: 140,

  // Effect Toggles
  enableDisplacement: true,
  enableColorama: true,
  enableBloom: true,
  enableLightSweep: true,

  // Canvas
  aspectRatio: 3 / 2,

  // Zoom & Pan
  zoom: 1,
  panX: 0,
  panY: 0,
  edgeFeather: [0, 0, 0, 0],

  // Background Color
  backgroundColor: [-1, -1, -1],

  // Cycle Animation
  animateCycleReps: true,
  cycleRepetitionsStart: 1.0,
  cycleRepetitionsEnd: 1.15,
  cycleRepetitionsStartFrame: 0,
  cycleRepetitionsDuration: 140,
};

// ============================================
// PRESETS
// ============================================
export type RzpGlassPreset = 'default' | 'zoomed' | 'bottomWave' | 'rippleWave' | 'circleSlideUp';

/**
 * Get preset definitions with dynamic CDN path support.
 * Asset URLs in presets will use the provided assetsPath.
 */
const getPresets = (assetsPath: string): Record<RzpGlassPreset, RzpGlassPresetDefinition> => ({
  /** Baseline — identical to DEFAULT_CONFIG, no overrides */
  default: {},

  /**
   * Zoomed-in closeup: high zoom, fine segments, edge feathering.
   * Good for a tight card/badge usage.
   */
  zoomed: {
    lightIntensity: 0.2,
    lightStartFrame: 0,
    // Color Correction
    ccBlackPoint: 0.0,
    ccWhitePoint: 0.9,
    ccMidtoneGamma: 1.2,
    ccGamma: 1.62,
    ccContrast: 0.0,
    // Displacement
    numSegments: 20.0,
    slitAngle: (15 * Math.PI) / 180,
    displacementX: -12.0,
    displacementY: -20.0,
    // Playback
    paused: true,
    startTime: 10,
    endTime: 14,
    animateLightIndependently: true,
    // Zoom & Pan
    zoom: 5,
    panX: -0.01,
    panY: 0.1,
    edgeFeather: [3, 5, 3, 3],
    // Animation
    animateCycleReps: true,
    cycleRepetitionsStart: 1.0,
    cycleRepetitionsEnd: 1.15,
    cycleRepetitionsStartFrame: 0,
    cycleRepetitionsDuration: 140,
  },
  bottomWave: {
    imageSrc: `${assetsPath}/bottom-frame.jpg`,
    gradientMapSrc: `${assetsPath}/colorama-gradient-map-green.jpg`,
    gradientMap2Src: `${assetsPath}/colorama-gradient-map-blue.jpg`,
    gradientMapBlend: 0,
    modifyGamma: 0.97,
    edgeFeather: [0.3, 0, 3, 0],
    panY: 0.03,
    numSegments: 30,
    enableBloom: false,
    slitAngle: (15 * Math.PI) / 180,
  },
  rippleWave: {
    videoSrc: `${assetsPath}/ray-pulse.mp4`,
    aspectRatio: 1.61,
    playbackRate: 0.7,
    slitAngle: (15 * Math.PI) / 180,
    numSegments: 35,
    ccGamma: 2.0,
    displacementX: -2.0,
    displacementY: -11.0,
    enableDisplacement: true,
    enableCenterElement: false,
    enableLightSweep: false,
    enableBloom: false,
    animateCycleReps: false,
    zoom: 2,
  },
  circleSlideUp: {
    videoSrc: `${assetsPath}/success-animation-circle.mp4`,
    aspectRatio: 1.61,
    playbackRate: 0.85,
    slitAngle: (15 * Math.PI) / 180,
    numSegments: 25,
    enableDisplacement: true,
    enableCenterElement: false,
    enableLightSweep: false,
    enableBloom: false,
    animateCycleReps: false,
    zoom: 1,
  },
});

/**
 * Dark-mode overlay, applied on top of the resolved preset whenever Blade's
 * colorScheme is `dark`. This is not a preset of its own — every preset gets its
 * dark counterpart by layering these values over it.
 *
 * Swaps in the dark gradient maps (a near-black centre ramp so the centre dome
 * doesn't glow, plus a darkened outer map) and tunes the passes for a black
 * background: bloom off, a damped light sweep, and a black `specularTint` that
 * suppresses the centre element's hard-coded white specular highlight.
 *
 * `ccWhitePoint` has to be lifted above 1.0 or the darkened maps clip. The guard
 * depends on the preset's gamma product, so it is derived from the config the
 * preset actually resolved to rather than hardcoded.
 */
const getDarkOverlay = (
  assetsPath: string,
  config: Pick<RzpGlassConfig, 'ccMidtoneGamma' | 'ccGamma'>,
): RzpGlassPresetDefinition => {
  const gammaProduct =
    (config.ccMidtoneGamma ?? DEFAULT_CONFIG.ccMidtoneGamma) *
    (config.ccGamma ?? DEFAULT_CONFIG.ccGamma);

  return {
    gradientMapSrc: `${assetsPath}/colorama-gradient-map-dark.png`,
    centerGradientMapSrc: `${assetsPath}/colorama-center-gradient-map-dark.jpg`,
    backgroundColor: [0, 0, 0],
    ccWhitePoint: Math.round(0.94 ** -gammaProduct * 1.02 * 1000) / 1000,
    enableBloom: false,
    lightIntensity: -0.35,
    specularTint: [0, 0, 0],
  };
};

export { DEFAULT_CONFIG, getPresets, getDarkOverlay };
