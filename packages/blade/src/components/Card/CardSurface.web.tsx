import styled from 'styled-components';
import { size } from '~tokens/global';
import type { ColorSchemeNames } from '~tokens/theme';
import { makeSpace } from '~utils';
import { getSurfaceBoxShadowString, getSurfaceGradients } from '~utils/makeSurfaceBoxShadow';
import BaseBox from '~components/Box/BaseBox';

type CardSurfaceProps = {
  colorScheme: ColorSchemeNames;
};
const CardSurface = styled(BaseBox)<CardSurfaceProps>(({ theme, colorScheme }) => {
  const isDarkMode = colorScheme === 'dark';
  const boxShadow = getSurfaceBoxShadowString(theme, colorScheme);
  const { top: topGradientColor, bottom: bottomGradientColor } = getSurfaceGradients(colorScheme);

  return {
    width: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    boxShadow,
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
      height: makeSpace(size[16]),
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
      bottom: isDarkMode ? 1 : 2,
      left: 1,
      right: 1,
      height: makeSpace(size[16]),
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
