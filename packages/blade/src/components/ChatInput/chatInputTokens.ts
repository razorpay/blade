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
const chatInputAmbientBorderLoopDuration = 15000;

/**
 * Size, in px, of the elliptical hover glow that follows the pointer along the border
 */
const chatInputHoverGlowSize = { width: 200, height: 94 } as const;

/**
 * How near, in px, the pointer must be for the hover glow. Within `full` of the box it is at full
 * strength; it fades in over the next `fade` px as the pointer approaches.
 */
const chatInputHoverGlowReach = { full: 24, fade: 90 } as const;

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
  chatInputHoverGlowSize,
  chatInputHoverGlowReach,
};
