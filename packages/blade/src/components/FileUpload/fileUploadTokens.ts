import type { DotNotationSpacingStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { IconProps } from '~components/Icons';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { DurationString, EasingString } from '~tokens/global';
import { size } from '~tokens/global';
import { BladeFile, FileUploadItemBackgroundColors } from './types';

const getFileUploadInputHoverTokens = (): SelectorInputHoverTokens => {
  return {
    default: {
      background: {
        checked: 'transparent',
        unchecked: 'transparent',
      },
      border: {
        checked: 'colors.interactive.border.gray.default',
        unchecked: 'colors.interactive.border.gray.default',
      },
    },
  };
};

const fileUploadMotionTokens: Record<'duration' | 'easing', DurationString | EasingString> = {
  duration: 'duration.xquick',
  easing: 'easing.standard.effective',
};

const fileUploadBackgroundColors = {
  hover: 'interactive.background.gray.highlighted',
  active: 'interactive.background.primary.faded',
} as const;

const fileUploadBorderColors = {
  default: 'interactive.border.gray.default',
  disabled: 'interactive.border.gray.disabled',
} as const;

const fileUploadItemBackgroundColors: Record<
  NonNullable<BladeFile['status']>,
  Record<'default' | 'hover', FileUploadItemBackgroundColors>
> = {
  success: {
    default: 'interactive.background.gray.default',
    hover: 'interactive.background.gray.highlighted',
  },
  error: {
    default: 'feedback.background.negative.subtle',
    hover: 'interactive.background.negative.fadedHighlighted',
  },
  uploading: {
    default: 'surface.background.gray.intense',
    hover: 'surface.background.gray.intense',
  },
};

export {
  getFileUploadInputHoverTokens,
  fileUploadMotionTokens,
  fileUploadBorderColors,
  fileUploadBackgroundColors,
  fileUploadItemBackgroundColors,
};
