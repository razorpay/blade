import styled from 'styled-components';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceBoxShadow, getSurfaceStyles } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

type TableSurfaceProps = {
  colorScheme: ColorSchemeNames;
  isInsideListView: boolean;
};

const TableSurface = styled(BaseBox)<TableSurfaceProps>(
  ({ theme, colorScheme, isInsideListView }) => {
    const isDarkMode = colorScheme === 'dark';
    const { elevation, top, border } = getSurfaceBoxShadow(theme, colorScheme);

    return {
      width: '100%',
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      boxSizing: 'border-box',
      // The inset box-shadow border from getSurfaceStyles is covered by child elements
      // (e.g. ReactTable) that have opaque backgrounds and fill edge-to-edge.
      // We override boxShadow to exclude the border layer and use outline instead,
      // which renders on top of children and stays visible.
      ...(!isInsideListView && {
        ...getSurfaceStyles(theme, colorScheme),
        boxShadow: `${elevation}, ${top}`,
        outline: isDarkMode ? 'none' : `1px solid ${theme.colors.interactive.border.gray.default}`,
      }),
    };
  },
);

export { TableSurface };
