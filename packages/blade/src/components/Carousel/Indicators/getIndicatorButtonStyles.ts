import type { CSSObject, DefaultTheme } from 'styled-components';
import type { IndicatorButtonProps } from './types';
import { size } from '~tokens/global';
import { castWebType, isReactNative, makeMotionTime, makeSize, makeSpace } from '~utils';

const getIndicatorButtonStyles = ({
  theme,
  isActive,
  variant,
}: {
  theme: DefaultTheme;
} & Pick<IndicatorButtonProps, 'isActive' | 'variant'>): CSSObject => {
  const backgroundColor = {
    gray: theme.colors.brand.gray[600].highContrast,
    white: theme.colors.brand.gray[700].highContrast,
    blue: theme.colors.brand.primary[500],
  };

  const easing = castWebType(theme.motion.easing.standard.effective);
  const duration = castWebType(makeMotionTime(theme.motion.duration.gentle));

  return {
    border: 'none',
    cursor: 'pointer',
    padding: makeSpace(theme.spacing[0]),
    borderRadius: theme.border.radius.max,
    backgroundColor: isActive
      ? backgroundColor[variant]
      : theme.colors.surface.overlay.background[400],
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
        // TODO: refactor to use focus ring token
        outline: 'none',
        boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      },
    }),
  };
};

export { getIndicatorButtonStyles };
