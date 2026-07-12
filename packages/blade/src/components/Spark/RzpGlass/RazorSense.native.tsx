/**
 * React Native keeps the existing compatibility renderer. The declarative
 * motion-state host is currently a responsive-web API because its authored
 * media, WebGL transitions, and lifecycle contracts are browser-specific.
 */
import type { LegacyRzpGlassProps, RzpGlassProps, SemanticRazorSenseProps } from './types';
export { RzpGlass as RazorSense } from './RzpGlass';

/** Declarative motion orchestration is a responsive-web API in this release. */
type RazorSenseControlledProps = never;
/** Declarative controller ownership is a responsive-web API in this release. */
type RazorSenseControllerOwnedProps = never;
type RazorSenseLegacyProps = LegacyRzpGlassProps;
type RazorSenseSemanticCompatibilityProps = SemanticRazorSenseProps;
type RazorSenseProps = RzpGlassProps;

export type {
  RazorSenseControllerOwnedProps,
  RazorSenseControlledProps,
  RazorSenseLegacyProps,
  RazorSenseProps,
  RazorSenseSemanticCompatibilityProps,
};
