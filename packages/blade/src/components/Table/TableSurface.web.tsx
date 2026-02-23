import styled from 'styled-components';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceBoxShadow, getSurfaceStyles } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

type TableSurfaceProps = {
  colorScheme: ColorSchemeNames;
  isInsideListView: boolean;
};

const TableSurface = styled(BaseBox)<TableSurfaceProps>(({ theme, colorScheme, isInsideListView }) => {
  const isDarkMode = colorScheme === 'dark';
  const { elevation, top } = getSurfaceBoxShadow(theme, colorScheme);
  const borderColor = theme.colors.interactive.border.gray.disabled;

  return {
    width: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    boxSizing: 'border-box',
    // The inset box-shadow border from getSurfaceStyles is covered by child elements
    // (e.g. ReactTable) that have opaque backgrounds and fill edge-to-edge.
    // We use real CSS border instead, which stays visible because overflow:hidden
    // clips children to the padding box (inside the border).
    ...(!isInsideListView && {
      ...getSurfaceStyles(theme, colorScheme),
      boxShadow: `${elevation}, ${top}`,
      borderLeft: `1px solid ${borderColor}`,
      borderRight: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
      ...(!isDarkMode && { borderTop: `1px solid ${borderColor}` }),
    }),
  };
});

export { TableSurface };
