import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getSurfaceStyles } from '~utils/makeSurfaceStyles';
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
  ({ theme, colorScheme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderRadius: makeBorderSize(theme.border.radius.medium),
    ...getSurfaceStyles(theme, colorScheme),
  }),
);

export { StyledCardGroupSurface };
