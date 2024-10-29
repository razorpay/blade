import { size } from '~tokens/global';

const highlightedButtonSizeMap = {
  small: size['24'],
  medium: size['32'],
} as const;

const highlightedHoverColorMap = {
  intense: 'interactive.background.gray.fadedHighlighted',
  subtle: 'interactive.background.staticWhite.faded',
} as const;

export { highlightedButtonSizeMap, highlightedHoverColorMap };
