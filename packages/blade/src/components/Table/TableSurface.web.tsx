import styled from 'styled-components';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceBoxShadow } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

type TableSurfaceProps = {
  colorScheme: ColorSchemeNames;
};

const TableSurface = styled(BaseBox)<TableSurfaceProps>(({ theme, colorScheme }) => {
  const { border: insetBorder, elevation, top } = getSurfaceBoxShadow(theme, colorScheme);
  return {
    // Unlike CardSurface, we don't use the full box-shadow (border + elevation + top) on the main
    // element. Table has opaque backgrounds on toolbar, table body, and pagination—they sit on top
    // of the element's box-shadow and hide the inset "border" layer. So we put elevation + top here,
    // and draw the inset border on ::after with z-index so it stacks above the content and stays visible.
    boxShadow: `${elevation}, ${top}`,
    isolation: 'isolate',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      boxShadow: insetBorder, // Inset border layer, drawn on top so it isn't covered by child backgrounds
      pointerEvents: 'none',
      zIndex: 1,
    },
  };
});

export { TableSurface };
