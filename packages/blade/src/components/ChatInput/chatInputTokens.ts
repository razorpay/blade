const chatInputBorderRadius = 'large' as const;

const chatInputMaxTextAreaHeight = 200;

const chatInputSuggestionCycleInterval = 4000;

const chatInputFilePreviewItemWidth = '200px';

const chatInputFilePreviewItemWidthNative = 200;

/**
 * How long the ambient border's streak takes to go once around the box. This is a slow, steady
 * loop rather than a transition, so it is a component constant instead of a motion token (Blade's
 * duration tokens stop at 640 ms).
 */
const chatInputAmbientBorderLoopDuration = 12000;

/**
 * Radius, in px, of the hover glow that follows the pointer along the border
 */
const chatInputHoverGlowRadius = 140;

/**
 * Width of the slash command list, matching the AI Elements design.
 */
const chatInputCommandMenuWidth = '360px';

export {
  chatInputBorderRadius,
  chatInputMaxTextAreaHeight,
  chatInputSuggestionCycleInterval,
  chatInputFilePreviewItemWidth,
  chatInputFilePreviewItemWidthNative,
  chatInputAmbientBorderLoopDuration,
  chatInputCommandMenuWidth,
  chatInputHoverGlowRadius,
};
