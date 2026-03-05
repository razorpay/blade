import type { RzpGlassConfig, RzpGlassPresetDefinition } from './types';

export const DEFAULT_CDN_PATH =
  'https://cdn.jsdelivr.net/gh/razorpay/blade@feat/expose-assets-folder/packages/blade/assets/spark';

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

  // Light Effect
  lightIntensity: 0.2,
  lightStartFrame: 140,

  // Effect Toggles
  enableDisplacement: true,
  enableColorama: true,
  enableBloom: true,
  enableLightSweep: true,

  // Zoom & Pan
  zoom: 1,
  panX: 0,
  panY: 0,
  edgeFeather: [0, 0, 0, 0],

  // Cycle Animation
  animateCycleReps: true,
  cycleRepetitionsStart: 1.0,
  cycleRepetitionsEnd: 1.15,
  cycleRepetitionsStartFrame: 0,
  cycleRepetitionsDuration: 140,

  // Ripple Wave
  enableRippleWave: false,
  // Ripple parameters
  rippleSpeed: 1.5, // expansion duration: seconds for ring to fully expand
  rippleWaitTime: 0.1, // silence duration at end of each burst (seconds)
  rippleBlend: 0.05, // gaussian ring thickness
  rippleAngularPower: 3.0, // lobe sharpness (higher = narrower beams)
  rippleRadialFalloff: 0.3, // max radius a ring expands to
};

// ============================================
// PRESETS
// ============================================
export type RzpGlassPreset = 'default' | 'zoomed' | 'bottomWave' | 'circular' | 'rippleWave';

export const getPresets = (
  cdnPath: string = DEFAULT_CDN_PATH,
): Record<RzpGlassPreset, RzpGlassPresetDefinition> => ({
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
    // imageSrc: '/bottom-frame-4.jpg',
    // gradientMapSrc: '/colorama-gradient-map-green.jpg',
    // gradientMap2Src: '/colorama-gradient-map-2.jpg',
    imageSrc: `${cdnPath}/bottom-frame.jpg`,
    gradientMapSrc: `${cdnPath}/colorama-gradient-map-green.jpg`,
    gradientMap2Src: `${cdnPath}/colorama-gradient-map-blue.jpg`,
    gradientMapBlend: 0,
    edgeFeather: [0.3, 0, 3, 0],
    panY: -0.04,
    numSegments: 30,
    enableBloom: false,
    slitAngle: (15 * Math.PI) / 180,
  },
  circular: {
    imageSrc: '/circular-shape.jpg',
    gradientMapSrc: `${cdnPath}/colorama-gradient-map-green.jpg`,
    edgeFeather: [1, 1, 1, 1],
    panY: 0,
    numSegments: 12,
    enableBloom: false,
    enableCenterElement: false,
    enableLightSweep: false,
    animateLightIndependently: false,
    animateCycleReps: false,
    slitAngle: (15 * Math.PI) / 180,
  },
  /**
   * Procedural four-way ripple wave effect.
   * Diagonal ring pulses expand from center with cubic ease-out timing.
   * Uses colorama for colorization — pair with a gradient map for best results.
   */
  rippleWave: {
    slitAngle: (15 * Math.PI) / 180,
    numSegments: 40,
    displacementX: -10.0,
    displacementY: -10.0,
    ccGamma: 2.0,

    enableRippleWave: true,
    // Disable standard pipeline layers that don't apply to the procedural ripple
    enableDisplacement: true,
    enableCenterElement: false,
    enableLightSweep: false,
    enableBloom: false,
    animateCycleReps: false,

    // Ripple parameters
    rippleSpeed: 1.5, // expansion duration: seconds for ring to fully expand
    rippleWaitTime: 0.1, // silence duration at end of each burst (seconds)
    rippleBlend: 0.1, // gaussian ring thickness
    rippleAngularPower: 1.0, // lobe sharpness (higher = narrower beams)
    rippleRadialFalloff: 0.3, // max radius a ring expands to
  },
});

// For backward compatibility, export PRESETS with default CDN path
export const PRESETS = getPresets();

export { DEFAULT_CONFIG };
