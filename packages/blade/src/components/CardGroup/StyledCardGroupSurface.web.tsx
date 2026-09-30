import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getSurfaceBoxShadow, getSurfaceStyles } from '~utils/makeSurfaceStyles';
import { makeBorderSize } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';

type StyledCardGroupSurfaceProps = {
  colorScheme: ColorSchemeNames;
};

/**
 * The single surface for the run. Owns border, radius, elevation and the
 * top/bottom gradient (via getSurfaceStyles, shared with Card). `overflow:
 * hidden` clips + rounds the end rows so rows never set their own corner radius.
 */
const StyledCardGroupSurface = styled(BaseBox)<StyledCardGroupSurfaceProps>(
  ({ theme, colorScheme }) => {
    const { border, top } = getSurfaceBoxShadow(theme, colorScheme);
    const radius = makeBorderSize(theme.border.radius.medium);

    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      isolation: 'isolate',
      boxSizing: 'border-box',
      overflow: 'hidden',
      borderRadius: radius,
      ...getSurfaceStyles(theme, colorScheme),
      // The surface's border ring + bottom lip are inset box-shadows, painted
      // *under* children, so row hover/selected fills and the collapsible body
      // cover them. Re-draw them above the rows; selected/focused rows lift to
      // z-index 2 so their own ring replaces this border along that row.
      '&::after': {
        content: "''",
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 1,
        boxShadow: `${border}, ${top}`,
      },
      // End rows take the group radius so inset rings curve with the surface
      // instead of being clipped square by `overflow: hidden`.
      '& > :first-child': {
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
      },
      '& > :last-child': {
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
      },
    };
  },
);

export { StyledCardGroupSurface };
