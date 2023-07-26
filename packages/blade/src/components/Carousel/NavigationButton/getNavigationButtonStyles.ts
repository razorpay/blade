import type { CSSObject, DefaultTheme } from 'styled-components';
import type { NavigationButtonProps } from './types';
import { castWebType, isReactNative, makeMotionTime, makeSpace } from '~utils';

const getNavigationButtonStyles = (props: {
  theme: DefaultTheme;
  isPressed?: boolean;
  variant: NavigationButtonProps['variant'];
}): CSSObject => {
  const { theme, isPressed = false, variant = 'filled' } = props;
  const motionToken = theme.motion;

  const iconColor = {
    filled: {
      default: theme.colors.action.icon.tertiary.default,
      hover: theme.colors.action.icon.tertiary.hover,
      focus: theme.colors.action.icon.tertiary.focus,
      active: theme.colors.action.icon.tertiary.active,
    },
    stroke: {
      default: theme.colors.surface.action.icon.active.highContrast,
      hover: theme.colors.surface.action.icon.active.highContrast,
      focus: theme.colors.surface.action.icon.active.highContrast,
      active: theme.colors.surface.action.icon.active.highContrast,
    },
  };

  const backgroundColor = {
    filled: {
      default: theme.colors.action.background.tertiary.default,
      hover: theme.colors.action.background.tertiary.hover,
      focus: theme.colors.action.background.tertiary.focus,
      active: theme.colors.action.background.tertiary.active,
    },
    stroke: {
      default: 'transparent',
      hover: theme.colors.brand.gray.a50.highContrast,
      focus: theme.colors.brand.gray.a100.highContrast,
      active: theme.colors.brand.gray.a100.highContrast,
    },
  };

  const borderColorToken = theme.colors.action.border.tertiary;
  const borderWidth = theme.border.width.thin;
  const borderRadius = theme.border.radius.max;
  // on react-native isPressed will be passed
  const state = isPressed ? 'active' : 'default';

  return {
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    borderStyle: 'solid',
    borderWidth,
    borderRadius,
    borderColor: borderColorToken[state],
    backgroundColor: backgroundColor[variant][state],
    color: iconColor[variant][state],

    padding: makeSpace(theme.spacing[3]),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

    ...(isReactNative()
      ? {}
      : {
          transitionProperty: 'color, box-shadow',
          transitionDuration: castWebType(makeMotionTime(motionToken.duration.xquick)),
          transitionTimingFunction: motionToken.easing.standard.effective as string,
          boxShadow: variant === 'filled' ? castWebType(theme.elevation.midRaised) : undefined,

          '&:hover': {
            color: iconColor[variant].hover,
            borderColor: borderColorToken.hover,
            backgroundColor: backgroundColor[variant].hover,
          },

          '&:focus': {
            // TODO: refactor to use focus ring token
            outline: 'none',
            boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
            color: iconColor[variant].focus,
            borderColor: borderColorToken.focus,
            backgroundColor: backgroundColor[variant].focus,
          },

          '&:active': {
            color: iconColor[variant].active,
            borderColor: borderColorToken.active,
            backgroundColor: backgroundColor[variant].active,
          },
        }),
  };
};

export { getNavigationButtonStyles };
