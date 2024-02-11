import type { DotNotationSpacingStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { IconProps } from '~components/Icons';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { DurationString, EasingString } from '~tokens/global';
import { size } from '~tokens/global';

const getFileUploadInputHoverTokens = (): SelectorInputHoverTokens => {
  return {
    default: {
      background: {
        checked: 'colors.interactive.background.staticWhite.default',
        unchecked: 'colors.interactive.background.staticWhite.default',
      },
      border: {
        checked: `colors.interactive.border.gray.default`,
        unchecked: 'colors.interactive.border.gray.default',
      },
    },
  };
};

const fileUploadMotionTokens: Record<'duration' | 'easing', DurationString | EasingString> = {
  duration: 'duration.xquick',
  easing: 'easing.standard.effective',
};

export { getFileUploadInputHoverTokens, fileUploadMotionTokens };
