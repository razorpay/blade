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
  medium: 'small',
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
    default: 'interactive.border.gray.highlighted',
    // While a file is dragged over the area (web) or the area is pressed (native)
    active: 'interactive.border.primary.faded',
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

const fileUploadItemColorTokens = {
  background: 'surface.background.gray.intense',
  border: {
    default: 'surface.border.gray.subtle',
    error: 'interactive.border.negative.faded',
  },
} as const;

// Leading tile of an uploaded file row
const fileUploadItemIconTokens = {
  size: size['40'],
  background: {
    default: 'surface.background.gray.subtle',
    error: 'feedback.background.negative.subtle',
  },
  icon: {
    default: 'surface.icon.gray.muted',
    error: 'interactive.icon.negative.normal',
  },
} as const;

// File icon above the drop area text when size="variable"
const fileUploadDropAreaIconTokens = {
  size: size['56'],
  background: 'surface.background.gray.intense',
  border: {
    default: 'surface.border.gray.muted',
    disabled: 'interactive.border.gray.disabled',
  },
  icon: {
    default: 'surface.icon.gray.muted',
    disabled: 'surface.icon.gray.disabled',
  },
} as const;

export {
  getFileUploadInputHoverTokens,
  fileUploadMotionTokens,
  fileUploadColorTokens,
  fileUploadItemColorTokens,
  fileUploadItemIconTokens,
  fileUploadDropAreaIconTokens,
  fileUploadHeightTokens,
  fileUploadItemHeightTokens,
  fileUploadBorderRadiusTokens,
  fileUploadDropAreaTextSizeTokens,
  fileUploadLinkIconSizeTokens,
};
