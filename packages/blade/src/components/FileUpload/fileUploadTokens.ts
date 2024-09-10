import type { BladeFile, FileUploadItemBackgroundColors } from './types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { DurationString, EasingString } from '~tokens/global';
import { size } from '~tokens/global';

const getFileUploadInputHoverTokens = (): SelectorInputHoverTokens => {
  return {
    default: {
      background: {
        checked: 'colors.transparent',
        unchecked: 'colors.transparent',
      },
      border: {
        checked: 'colors.interactive.border.gray.default',
        unchecked: 'colors.interactive.border.gray.default',
      },
    },
  };
};

const fileUploadMotionTokens: Record<'duration' | 'easing', DurationString | EasingString> = {
  duration: 'duration.2xquick',
  easing: 'easing.standard',
};

const fileUploadHeightTokens = {
  medium: size['56'],
  large: size['64'],
};

const fileUploadColorTokens = {
  text: {
    default: 'surface.text.gray.subtle',
    disabled: 'surface.text.gray.disabled',
  },
  border: {
    default: 'interactive.border.gray.default',
    disabled: 'interactive.border.gray.disabled',
  },
  background: {
    hover: 'interactive.background.gray.highlighted',
    active: 'interactive.background.primary.faded',
  },
  icon: {
    default: 'interactive.icon.primary.subtle',
    disabled: 'interactive.icon.primary.disabled',
  },
  link: {
    default: 'interactive.text.primary.subtle',
    disabled: 'interactive.text.primary.disabled',
  },
} as const;

const fileUploadItemBackgroundColors: Record<
  NonNullable<BladeFile['status']>,
  Record<'default' | 'hover', FileUploadItemBackgroundColors>
> = {
  success: {
    default: 'interactive.background.gray.faded',
    hover: 'interactive.background.gray.fadedHighlighted',
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

const fileUploadLinkBorderTokens = {
  color: {
    default: 'surface.border.primary.normal',
    disabled: 'surface.border.primary.muted',
  },
  width: {
    default: 'thin',
  },
} as const;

export {
  getFileUploadInputHoverTokens,
  fileUploadMotionTokens,
  fileUploadItemBackgroundColors,
  fileUploadColorTokens,
  fileUploadLinkBorderTokens,
  fileUploadHeightTokens,
};
