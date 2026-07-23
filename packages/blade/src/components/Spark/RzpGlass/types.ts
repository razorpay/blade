/**
 * RzpGlass Types
 *
 * TypeScript types for the RzpGlass WebGL shader component.
 * Uniforms are organized into logical groups matching the shader structure.
 */

import type { RzpGlassPreset } from './presets';
import type { RazorSenseMode } from './modes';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { ColorSchemeNames } from '~tokens/theme';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

// ============================================
// COLORAMA CONFIG (Adobe AE v5 Pipeline)
// ============================================
type RzpGlassColoramaConfig = {
  /** Input range min (default: 0.0) */
  inputMin?: number;
  /** Input range max (default: 1.0) */
  inputMax?: number;
  /** Gamma curve: <1 = brights, >1 = darks (default: 1.05) */
  modifyGamma?: number;
  /** 0 = off, >0 = number of discrete steps (default: 0.0) */
  posterizeLevels?: number;
  /** Stretch/compress the index (default: 1.0) */
  cycleRepetitions?: number;
  /** Static offset (default: 0.0) */
  phaseShift?: number;
  /** Cycling animation speed (default: 0.0) */
  cycleSpeed?: number;
  /** false = clamp, true = wrap/fract (default: false) */
  wrapMode?: boolean;
  /** false = normal, true = reverse gradient (default: true) */
  reverse?: boolean;
  /** 0 = full effect, 1 = original (default: 0.0) */
  blendWithOriginal?: number;
  /** Cross-fade between gradientMapSrc (0.0) and gradientMap2Src (1.0). Animates smoothly. (default: 0.0) */
  gradientMapBlend?: number;
  /** Duration of gradientMapBlend transition in seconds (default: 0.6) */
  gradientMapBlendDuration?: number;
};

// ============================================
// DISPLACEMENT CONFIG
// ============================================
type RzpGlassDisplacementConfig = {
  /** Number of glass slits (default: 45.0) */
  numSegments?: number;
  /** Angle of slits in radians (default: 0.15) */
  slitAngle?: number;
  /** X displacement amount in pixels (default: -12.0) */
  displacementX?: number;
  /** Y displacement amount in pixels (default: 20.0) */
  displacementY?: number;
};

// ============================================
// CENTER ELEMENT CONFIG
// ============================================
type RzpGlassCenterElementConfig = {
  /** Toggle center element (default: true) */
  enableCenterElement?: boolean;
  /** Duration of one animation cycle in seconds (default: 6.0) */
  centerAnimDuration?: number;
};

// ============================================
// COLOR CORRECTION CONFIG
// ============================================
type RzpGlassColorCorrectionConfig = {
  /** Levels black point (default: 0.0) */
  ccBlackPoint?: number;
  /** Levels white point (default: 0.9) */
  ccWhitePoint?: number;
  /** Midtone gamma (default: 1.2) */
  ccMidtoneGamma?: number;
  /** Output gamma (default: 1.2) */
  ccGamma?: number;
  /** Contrast boost (default: 0.0) */
  ccContrast?: number;
};

// ============================================
// CANVAS CONFIG
// ============================================
type RzpGlassCanvasConfig = {
  /**
   * Target aspect ratio (width / height) for the canvas cover behavior.
   * The canvas will fill the container while maintaining this ratio, cropping overflow.
   * Defaults to 3/2 (matching the default base video at 4500x3000).
   * Override for videos with different native aspect ratios (e.g. 16/9).
   */
  aspectRatio?: number;
};

// ============================================
// ZOOM & PAN CONFIG
// ============================================
type RzpGlassZoomPanConfig = {
  /** Zoom level (1.0 = normal, 2.0 = 2x zoom) (default: 1.0) */
  zoom?: number;
  /** Horizontal pan offset (-1 to 1) (default: 0.0) */
  panX?: number;
  /** Vertical pan offset (-1 to 1) (default: 0.0) */
  panY?: number;
  /** Per-side edge feathering: [top, right, bottom, left] clockwise (0 = none, 1 = max) (default: [0, 0, 0, 0]) */
  edgeFeather?: [number, number, number, number];
};

// ============================================
// BACKGROUND COLOR CONFIG
// ============================================
type RzpGlassBackgroundConfig = {
  /** Background color to blend bright areas with. RGB array [0-1, 0-1, 0-1]. When not provided, no blending occurs. */
  backgroundColor?: [number, number, number];
};

// ============================================
// EFFECT TOGGLES
// ============================================
type RzpGlassEffectToggles = {
  /** Enable displacement effect (default: true) */
  enableDisplacement?: boolean;
  /** Enable colorama effect (default: true) */
  enableColorama?: boolean;
  /** Enable bloom effect (default: true) */
  enableBloom?: boolean;
  /** Enable light sweep effect (default: true) */
  enableLightSweep?: boolean;
};

// ============================================
// LIGHT EFFECT CONFIG
// ============================================
type RzpGlassLightConfig = {
  /** Strength of light sweep effect (default: 0.2) */
  lightIntensity?: number;
  /** Frame when light effect starts (default: 140) */
  lightStartFrame?: number;
};

// ============================================
// PLAYBACK CONFIG
// ============================================
type RzpGlassPlaybackConfig = {
  /** Whether video is paused (default: false) */
  paused?: boolean;
  /** Video start time in seconds (default: 0) */
  startTime?: number;
  /** Video end time in seconds (default: 14) */
  endTime?: number;
  /** Animate light effect independently of video (default: true) */
  animateLightIndependently?: boolean;
  /** Video playback rate multiplier — 1.0 = normal, 0.5 = half speed, 2.0 = double speed (default: 1.0) */
  playbackRate?: number;
};

// ============================================
// CYCLE REPETITIONS ANIMATION CONFIG
// ============================================
type RzpGlassCycleAnimConfig = {
  /** Whether to animate cycle repetitions (default: true) */
  animateCycleReps?: boolean;
  /** Starting value for cycle repetitions animation (default: 1.0) */
  cycleRepetitionsStart?: number;
  /** Ending value for cycle repetitions animation (default: 1.15) */
  cycleRepetitionsEnd?: number;
  /** Frame when cycle repetitions animation starts (default: 0) */
  cycleRepetitionsStartFrame?: number;
  /** Duration of cycle repetitions animation in frames (default: 140) */
  cycleRepetitionsDuration?: number;
};

// ============================================
// COMBINED CONFIG
// ============================================
type RzpGlassConfig = RzpGlassColoramaConfig &
  RzpGlassDisplacementConfig &
  RzpGlassCenterElementConfig &
  RzpGlassColorCorrectionConfig &
  RzpGlassCanvasConfig &
  RzpGlassZoomPanConfig &
  RzpGlassBackgroundConfig &
  RzpGlassEffectToggles &
  RzpGlassLightConfig &
  RzpGlassPlaybackConfig &
  RzpGlassCycleAnimConfig;

// ============================================
// ASSETS
// ============================================
type RzpGlassAssets = {
  /** URL to the video source (default: '/base_video.mp4'). Mutually exclusive with imageSrc. */
  videoSrc?: string;
  /**
   * URL to a static image to use as the base texture instead of a video.
   * When provided, videoSrc is ignored and no video element is created.
   */
  imageSrc?: string;
  /** URL to the gradient map image for colorama effect (default: '/colorama-gradient-map-2.jpg') */
  gradientMapSrc?: string;
  /** URL to a second gradient map for cross-fade blending via gradientMapBlend prop */
  gradientMap2Src?: string;
  /** URL to the center gradient map image for center ellipse effect (default: '/colorama-center-gradient-map.jpg') */
  centerGradientMapSrc?: string;
};

// ============================================
// PRESET DEFINITION
// A preset can specify both config values and asset URLs.
// Props always take priority over preset values.
// ============================================
type RzpGlassPresetDefinition = Partial<RzpGlassConfig> & Partial<RzpGlassAssets>;

// ============================================
// UNIFORM TYPES (for internal WebGL mapping)
// ============================================
type RzpGlassUniforms = {
  [key: string]: boolean | number | number[] | HTMLVideoElement | HTMLImageElement | undefined;
};

// ============================================
// COMPONENT PROPS
// ============================================
type RzpGlassCommonProps = {
  /** CSS width (default: '100%') */
  width?: string | number;
  /** CSS height (default: '100%') */
  height?: string | number;
  /** Base CDN path for loading packaged assets. */
  assetsPath?: string;
  /** Callback when assets are loaded */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
};

type LegacyRzpGlassProps = RzpGlassCommonProps &
  StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute &
  RzpGlassConfig &
  RzpGlassAssets & {
    mode?: never;
    isPaused?: never;
    isInteractive?: never;
    accessibilityLabel?: never;
    modeTransitionDuration?: never;
    /**
     * Named preset that provides a base configuration.
     * Any explicit props you pass will override the preset values.
     * - `default` — authored Neutral program unless shader-tuning props are supplied
     * - `zoomed` — authored Thinking crop unless shader-tuning props are supplied
     * - `bottomWave` — authored Typing horizon unless shader-tuning props are supplied
     * - `rippleWave` and `circleSlideUp` — legacy specialized programs
     * - `legacy` — explicit escape hatch for the original default shader
     */
    preset?: RzpGlassPreset;
    /**
     * A canvas generated by `generateGradientCanvas()` for a runtime legacy
     * colorama-map swap without reinitializing WebGL.
     */
    gradientMapCanvas?: HTMLCanvasElement | null;
  };

type SemanticRazorSenseProps = RzpGlassCommonProps &
  StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute &
  Pick<RzpGlassPlaybackConfig, 'startTime' | 'endTime' | 'playbackRate'> & {
    /**
     * Semantic RazorSense state.
     *
     * Operational states (`neutral`, `typing`, `thinking`, `loading`) use the
     * authored glass motion programs. Emotional states (`calm`, `joyful`,
     * `caution`, `regret`) use the responsive mood material renderer.
     */
    mode?: RazorSenseMode;
    preset?: never;
    /** Whether RazorSense motion is paused (default: false). */
    isPaused?: boolean;
    /** Whether emotional modes respond to pointer input (default: true). */
    isInteractive?: boolean;
    /** Accessible name for a meaningful RazorSense visual. Omit for decorative usage. */
    accessibilityLabel?: string;
    /** Duration in seconds for semantic state transitions (1s emotional, 0.4s operational). */
    modeTransitionDuration?: number;
  };

type RzpGlassProps = LegacyRzpGlassProps | SemanticRazorSenseProps;

type PreloadRazorSenseOptions = {
  modes: RazorSenseMode | readonly RazorSenseMode[];
  colorSchemes?: ColorSchemeNames | readonly ColorSchemeNames[];
  assetsPath?: string;
};

export type {
  RzpGlassConfig,
  RzpGlassAssets,
  RzpGlassPresetDefinition,
  RzpGlassUniforms,
  RzpGlassProps,
  LegacyRzpGlassProps,
  SemanticRazorSenseProps,
  PreloadRazorSenseOptions,
};
