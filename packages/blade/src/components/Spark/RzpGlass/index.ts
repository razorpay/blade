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

export type { RzpGlassProps as RazorSenseProps } from './types';

// Preload utilities
export { preloadRazorSenseAssets } from './utils';

// Preset types
export type { RzpGlassPreset as RazorSensePreset } from './presets';
