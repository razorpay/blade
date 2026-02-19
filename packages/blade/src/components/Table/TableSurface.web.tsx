import styled from 'styled-components';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceBoxShadow } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

type TableSurfaceProps = {
  colorScheme: ColorSchemeNames;
  isInsideListView: boolean;
};

const TableSurface = styled(BaseBox)<TableSurfaceProps>(({ theme, colorScheme, isInsideListView }) => {
  const { border: insetBorder, elevation, top } = getSurfaceBoxShadow(theme, colorScheme);
  const isDarkMode = colorScheme === 'dark';

  return {
    // Table children (toolbar, body, pagination) have opaque backgrounds that cover inset
    // box-shadow layers on the main element. We keep only the outer elevation shadow here
    // and draw inset layers (border + top) on ::after with z-index so they stay visible
    // above child backgrounds — particularly pagination which covers the top inset shadow.
    boxShadow: `${elevation}`,
    isolation: 'isolate',
    position: 'relative',
    borderTop: isDarkMode ? `1px solid ${theme.colors.surface.border.gray.subtle}` : '',
    border: isDarkMode && isInsideListView ? `1px solid ${theme.colors.surface.border.gray.subtle}` : '',

    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      boxShadow: `${insetBorder}, ${top}`,
      pointerEvents: 'none',
      zIndex: 2,
    },
  };
});

export { TableSurface };
