import type { CSSObject, DefaultTheme } from 'styled-components';
import type { IndicatorButtonProps } from './types';
import { size } from '~tokens/global';
import { castWebType, isReactNative, makeMotionTime, makeSize, makeSpace } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const getIndicatorButtonStyles = ({
  theme,
  isActive,
  variant,
}: {
  theme: DefaultTheme;
} & Pick<IndicatorButtonProps, 'isActive' | 'variant'>): CSSObject => {
  const backgroundColor = {
    gray: theme.colors.interactive.icon.gray.muted,
    white: theme.colors.interactive.icon.staticWhite.normal,
    blue: theme.colors.interactive.icon.primary.subtle,
  };

  const easing = castWebType(theme.motion.easing.standard);
  const duration = castWebType(makeMotionTime(theme.motion.duration.gentle));

  return {
    border: 'none',
    cursor: 'pointer',
    padding: makeSpace(theme.spacing[0]),
    borderRadius: theme.border.radius.max,
    backgroundColor: isActive ? backgroundColor[variant] : theme.colors.overlay.background.moderate,
    width: isActive ? makeSize(size[18]) : makeSize(size[6]),
    height: makeSize(size[6]),

    ...(isReactNative() && {
      width: undefined,
    }),

    ...(!isReactNative() && {
      transitionProperty: 'width',
      transitionDuration: duration,
      transitionTimingFunction: easing,
      '&:before': {
        content: `""`,
        // increasing the hit area, just random numbers
        padding: makeSize(size[10]),
        paddingTop: makeSize(size[20]),
      },
      '&:focus-visible': {
        ...getFocusRingStyles({ theme }),
      },
    }),
  };
};

export { getIndicatorButtonStyles };
