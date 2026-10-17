const chatInputBorderRadius = 'medium' as const;

const chatInputMaxTextAreaHeight = 200;

const chatInputSuggestionCycleInterval = 4000;

const chatInputFilePreviewItemWidth = '200px';

const chatInputFilePreviewItemWidthNative = 200;

// ChatInput-only visual tokens, matching Slash's shipped breathing outline.
const chatInputAmbientBorder = {
  light: 'linear-gradient(110deg, #5a81f1, #87d0ff, #c0f8fc, #87d0ff, #5a81f1)',
  dark: 'linear-gradient(110deg, #152349, #395eb7, #7894d9, #284694, #152349)',
  width: 1,
  focusWidth: 1.5,
  glowBlur: 6,
} as const;

export {
  chatInputAmbientBorder,
  chatInputBorderRadius,
  chatInputMaxTextAreaHeight,
  chatInputSuggestionCycleInterval,
  chatInputFilePreviewItemWidth,
  chatInputFilePreviewItemWidthNative,
};
