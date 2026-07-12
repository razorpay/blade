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

// React components
export { RazorSense } from './RazorSense';
export { RazorSenseSequence } from './RazorSenseSequence';

// Declarative motion-state APIs
export { defineRazorSenseSequence } from './defineRazorSenseSequence';
export { RazorSenseError } from './razorSenseMotionTypes';
export { RAZOR_SENSE_BRANDED_PRESETS, RAZOR_SENSE_STATES } from './razorSensePrograms';
export {
  razorSenseLoginToDashboardJourney,
  razorSenseThreePhaseLoadingJourney,
} from './razorSenseBuiltInSequences';
export {
  useRazorSenseController,
  useRazorSenseSequenceController,
} from './useRazorSenseController';
export {
  createRazorSenseController,
  createRazorSenseSequenceController,
  disposeRazorSenseController,
} from './RazorSenseControllerPublic';

export type {
  LegacyRzpGlassProps as LegacyRazorSenseProps,
  SemanticRazorSenseProps,
  PreloadRazorSenseOptions,
} from './types';
export type {
  RazorSenseControllerOwnedProps,
  RazorSenseControlledProps,
  RazorSenseLegacyProps,
  RazorSenseProps,
  RazorSenseSemanticCompatibilityProps,
} from './RazorSense';
export type { RazorSenseSequenceProps } from './RazorSenseSequence';
export type {
  RazorSenseLoginCue,
  RazorSenseLoginForegroundSlot,
} from './razorSenseBuiltInSequences';
export type {
  RazorSenseBrandedPreset,
  RazorSenseCancelEvent,
  RazorSenseCompletionReason,
  RazorSenseController,
  RazorSenseControllerEvent,
  RazorSenseControllerOptions,
  RazorSenseControllerSnapshot,
  RazorSenseCueEvent,
  RazorSenseEndBehavior,
  RazorSenseErrorEvent,
  RazorSenseInterruptionPolicy,
  RazorSenseIterationEvent,
  RazorSensePlayback,
  RazorSensePlaybackCommand,
  RazorSensePlaybackEvent,
  RazorSensePreset,
  RazorSenseReadyEvent,
  RazorSenseRunId,
  RazorSenseSequenceCancelEvent,
  RazorSenseSequenceCommand,
  RazorSenseSequenceCompleteEvent,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
  RazorSenseSequenceErrorEvent,
  RazorSenseSequenceEvent,
  RazorSenseSequenceStep,
  RazorSenseState,
  RazorSenseStepEvent,
  RazorSenseTarget,
  RazorSenseTransition,
  RazorSenseTransitionCommand,
  RazorSenseTransitionCompleteEvent,
  RazorSenseTransitionStartEvent,
} from './razorSenseMotionTypes';
export type { RazorSenseMode, RazorSenseEmotionalMode, RazorSenseOperationalMode } from './modes';
export {
  RAZOR_SENSE_MODES,
  RAZOR_SENSE_EMOTIONAL_MODES,
  RAZOR_SENSE_OPERATIONAL_MODES,
  RAZOR_SENSE_MODE_LABELS,
} from './modes';

// Preload utilities
export {
  preloadRazorSense,
  preloadRazorSenseAssets,
  preloadRazorSenseModeAssets,
  preloadRazorSenseTarget,
} from './utils';
