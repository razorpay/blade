import type { BladeFile, FileUploadItemBackgroundColors } from './types';
import { size } from '~tokens/global';
import type { DurationString, EasingString } from '~tokens/global';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';

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
  small: size['32'],
  medium: size['56'],
  large: size['64'],
};

// Uploaded file items keep the medium height in the small size, so their actions stay tappable
const fileUploadItemHeightTokens = {
  small: size['56'],
  medium: size['56'],
  large: size['64'],
  variable: size['64'],
};

const fileUploadBorderRadiusTokens = {
  small: 'small',
  medium: 'medium',
  large: 'medium',
  variable: 'medium',
} as const;

// Text and icon sizes inside the drop area. Only the small size shrinks them.
const fileUploadDropAreaTextSizeTokens = {
  small: 'small',
  medium: 'medium',
  large: 'medium',
  variable: 'medium',
} as const;

const fileUploadLinkIconSizeTokens = {
  small: 'small',
  medium: 'medium',
  large: 'medium',
  variable: 'medium',
} as const;

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
    hover: 'interactive.background.gray.default',
    active: 'interactive.background.primary.faded',
  },
  icon: {
    default: 'interactive.icon.primary.subtle',
    disabled: 'interactive.icon.primary.disabled',
  },
  // The upload action matches Blade Link with color="neutral" and a leading icon
  link: {
    default: 'interactive.text.neutral.normal',
    disabled: 'interactive.text.neutral.disabled',
  },
  linkIcon: {
    default: 'interactive.icon.neutral.normal',
    disabled: 'interactive.icon.neutral.disabled',
  },
} as const;

const fileUploadItemBackgroundColors: Record<
  NonNullable<BladeFile['status']>,
  Record<'default' | 'hover', FileUploadItemBackgroundColors>
> = {
  success: {
    default: 'surface.background.gray.intense',
    hover: 'surface.background.gray.intense',
  },
  error: {
    default: 'interactive.background.negative.faded',
    hover: 'interactive.background.negative.fadedHighlighted',
  },
  uploading: {
    default: 'surface.background.gray.intense',
    hover: 'surface.background.gray.intense',
  },
};

const getFileIconExtension = (acceptValue?: string): string => {
  if (!acceptValue) return 'example.xyz';

  const extensions = acceptValue
    .split(',')
    .map((ext) => ext.trim())
    .filter((ext) => ext.startsWith('.'));

  return extensions.length === 1 ? `example${extensions[0]}` : 'example.xyz';
};

export {
  getFileUploadInputHoverTokens,
  fileUploadMotionTokens,
  fileUploadItemBackgroundColors,
  fileUploadColorTokens,
  fileUploadHeightTokens,
  fileUploadItemHeightTokens,
  fileUploadBorderRadiusTokens,
  fileUploadDropAreaTextSizeTokens,
  fileUploadLinkIconSizeTokens,
  getFileIconExtension,
};
