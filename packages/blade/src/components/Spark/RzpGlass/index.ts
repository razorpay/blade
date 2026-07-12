/**
 * RzpGlass - WebGL Glass Refraction Effect
 *
 * A React component for rendering a glass refraction shader effect
 * with video texture support, colorama, displacement, and more.
 *
 * @example
 * ```tsx
 * import { RzpGlass } from '@/components/RzpGlass';
 *
 * function MyComponent() {
 *   // Uses default assets (video and gradient maps)
 *   return (
 *     <RzpGlass
 *       width="100%"
 *       height="100vh"
 *     />
 *   );
 * }
 * ```
 */

// React component
export { RzpGlass as RazorSense } from './RzpGlass';

export type {
  RzpGlassProps as RazorSenseProps,
  LegacyRzpGlassProps as LegacyRazorSenseProps,
  SemanticRazorSenseProps,
} from './types';
export type { RazorSenseMode, RazorSenseEmotionalMode, RazorSenseOperationalMode } from './modes';
export {
  RAZOR_SENSE_MODES,
  RAZOR_SENSE_EMOTIONAL_MODES,
  RAZOR_SENSE_OPERATIONAL_MODES,
  RAZOR_SENSE_MODE_LABELS,
} from './modes';

// Preload utilities
export { preloadRazorSenseAssets, preloadRazorSenseModeAssets } from './utils';

// Preset types
export type { RzpGlassPreset as RazorSensePreset } from './presets';
