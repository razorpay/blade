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
      default: theme.colors.interactive.icon.gray.normal,
      hover: theme.colors.interactive.icon.gray.normal,
      focus: theme.colors.interactive.icon.gray.normal,
      active: theme.colors.interactive.icon.gray.normal,
    },
    stroked: {
      default: theme.colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'",
      hover: theme.colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'",
      focus: theme.colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'",
      active: theme.colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'",
    },
  };

  const backgroundColor = {
    filled: {
      default: theme.colors.interactive.background.staticWhite.default,
      hover: theme.colors.interactive.background.staticWhite.default,
      focus: theme.colors.interactive.background.staticWhite.default,
      active: theme.colors.interactive.background.staticWhite.default,
    },
    stroked: {
      default: theme.colors.interactive.background.gray.default,
      hover: theme.colors.interactive.background.gray.default,
      focus: theme.colors.interactive.background.gray.default,
      active: theme.colors.interactive.background.gray.default,
    },
  };

  const borderColors = {
    filled: theme.colors.surface.border.gray.normal,
    stroked: theme.colors.brand.gray[400].lowContrast,
  } as const;

  const borderColor = borderColors[variant];
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
    borderColor,
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
          transitionTimingFunction: castWebType(motionToken.easing.standard.effective),
          boxShadow: variant === 'filled' ? castWebType(theme.elevation.midRaised) : undefined,

          '&:hover': {
            color: iconColor[variant].hover,
            backgroundColor: backgroundColor[variant].hover,
          },

          '&:focus-visible': {
            // TODO: refactor to use focus ring token
            outline: 'none',
            boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
            color: iconColor[variant].focus,
            backgroundColor: backgroundColor[variant].focus,
          },

          '&:active': {
            color: iconColor[variant].active,
            backgroundColor: backgroundColor[variant].active,
          },
        }),
  };
};

export { getNavigationButtonStyles };
