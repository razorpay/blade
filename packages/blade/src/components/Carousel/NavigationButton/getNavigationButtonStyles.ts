import type { CSSObject, DefaultTheme } from 'styled-components';
import type { NavigationButtonProps } from './types';
import { castWebType, isReactNative, makeMotionTime, makeSpace } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const getNavigationButtonStyles = (props: {
  theme: DefaultTheme;
  isPressed?: boolean;
  variant: NavigationButtonProps['variant'];
}): CSSObject => {
  const { theme, isPressed = false, variant = 'filled' } = props;
  const motionToken = theme.motion;

  const iconColor = {
    filled: {
      default: theme.colors.interactive.icon.staticBlack.muted,
      highlighted: theme.colors.interactive.icon.staticBlack.muted,
    },
    stroked: {
      default: theme.colors.interactive.icon.gray.normal,
      highlighted: theme.colors.interactive.icon.gray.normal,
    },
  };

  const backgroundColor = {
    filled: {
      default: theme.colors.interactive.background.staticWhite.default,
      highlighted: theme.colors.interactive.background.staticWhite.highlighted,
    },
    stroked: {
      default: theme.colors.interactive.background.staticWhite.faded,
      highlighted: theme.colors.interactive.background.staticWhite.fadedHighlighted,
    },
  };

  const borderColors = {
    filled: theme.colors.transparent,
    stroked: theme.colors.interactive.border.gray.faded,
  } as const;

  const borderColor = borderColors[variant];
  const borderWidth = theme.border.width.thin;
  const borderRadius = theme.border.radius.max;
  // on react-native isPressed will be passed
  const state = isPressed ? 'highlighted' : 'default';

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
          transitionTimingFunction: castWebType(motionToken.easing.standard),
          boxShadow: variant === 'filled' ? castWebType(theme.elevation.midRaised) : undefined,

          '&:hover': {
            color: iconColor[variant].highlighted,
            backgroundColor: backgroundColor[variant].highlighted,
          },

          '&:focus-visible': {
            ...getFocusRingStyles({ theme }),
            color: iconColor[variant].highlighted,
            backgroundColor: backgroundColor[variant].highlighted,
          },

          '&:active': {
            color: iconColor[variant].highlighted,
            backgroundColor: backgroundColor[variant].highlighted,
          },
        }),
  };
};

export { getNavigationButtonStyles };
