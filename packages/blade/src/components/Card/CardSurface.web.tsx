import styled from 'styled-components';
import { colors } from '~tokens/global';
import type { ColorSchemeNames } from '~tokens/theme';
import BaseBox from '~components/Box/BaseBox';

type CardSurfaceProps = {
  colorScheme: ColorSchemeNames;
};
const CardSurface = styled(BaseBox)<CardSurfaceProps>(({ theme, colorScheme }) => {
  const isDarkMode = colorScheme === 'dark';
  const boxShadow = {
    light: {
      elevation: `0px 6px 32px 4px ${colors.neutral.blueGrayLight.a406}`,
      border: `inset 0px 0px 0px 1px ${theme.colors.interactive.border.gray.default}`,
      top: `inset 0px -1.5px 0px 1px ${theme.colors.surface.background.gray.intense}`,
    },
    dark: {
      elevation: `0px 6px 12px 4px ${colors.neutral.black[5]}`,
      border: `inset 0px 0px 0px 0px ${theme.colors.interactive.border.gray.default}`,
      top: `inset 0px 0px 0px 1px ${theme.colors.surface.background.gray.intense}`,
    },
  };

  const borderShadow = boxShadow[colorScheme].border;
  const topInnerShadow = boxShadow[colorScheme].top;
  const elevationShadow = boxShadow[colorScheme].elevation;

  const topGradient = {
    light: {
      start: colors.neutral.blueGrayLight[0],
      end: colors.neutral.blueGrayLight[0],
    },
    dark: {
      start: colors.neutral.blueGrayDark[1000],
      end: colors.neutral.blueGrayDark[1100],
    },
  };

  const bottomGradient = {
    light: {
      start: colors.neutral.blueGrayLight[0],
      end: colors.neutral.blueGrayLight[50],
    },
    dark: {
      start: colors.neutral.blueGrayDark[1100],
      end: colors.neutral.blueGrayDark[1300],
    },
  };

  const topGradientColor = topGradient[colorScheme];
  const bottomGradientColor = bottomGradient[colorScheme];

  return {
    width: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    boxShadow: `${borderShadow}, ${elevationShadow}, ${topInnerShadow}`,
    boxSizing: 'border-box',
    border: 'none',
    borderTop: isDarkMode ? `1px solid ${theme.colors.surface.border.gray.subtle}` : '',
    isolation: 'isolate', // Create stacking context
    // Top gradient overlay
    '&::before': {
      content: '""',
      position: 'absolute',
      top: isDarkMode ? 0 : 1,
      left: 1,
      right: 1,
      height: '16px',
      background: `linear-gradient(${topGradientColor.start} 0%, ${topGradientColor.end} 100%)`,
      pointerEvents: 'none',
      borderRadius: 'inherit',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      zIndex: -1,
    },
    // Bottom gradient overlay
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 1,
      left: 1,
      right: 1,
      height: '16px',
      background: `linear-gradient(${bottomGradientColor.start} 0%, ${bottomGradientColor.end} 100%)`,
      pointerEvents: 'none',
      borderRadius: 'inherit',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      zIndex: -1,
    },
  };
});

export { CardSurface };
