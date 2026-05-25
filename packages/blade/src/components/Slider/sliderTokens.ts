import { size } from '~tokens/global';

const sliderTrackHeight = {
  small: size[2],
  medium: size[4],
} as const;

const sliderThumbSize = {
  small: size[16],
  medium: size[20],
} as const;

const sliderTrackColor = {
  filled: 'interactive.background.primary.default',
  unfilled: 'surface.background.gray.moderate',
  disabled: 'interactive.background.gray.disabled',
} as const;

const sliderThumbColor = {
  default: 'interactive.background.primary.default',
  disabled: 'interactive.background.gray.disabled',
  hovered: 'interactive.background.primary.highlighted',
} as const;

export { sliderTrackHeight, sliderThumbSize, sliderTrackColor, sliderThumbColor };
