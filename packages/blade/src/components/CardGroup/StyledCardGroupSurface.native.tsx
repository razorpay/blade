import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';

type StyledCardGroupSurfaceProps = {
  colorScheme: ColorSchemeNames;
};

/**
 * Native surface. React Native cannot parse the CSS gradient bands used on web
 * (getSurfaceStyles), so the surface here is a flat elevated card: intense gray
 * fill, subtle border, rounded corners, clipped so end rows meet the edge.
 */
const StyledCardGroupSurface = styled(BaseBox)<StyledCardGroupSurfaceProps>(({ theme }) => ({
  width: '100%',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: makeBorderSize(theme.border.radius.medium),
  borderWidth: makeBorderSize(theme.border.width.thin),
  borderColor: theme.colors.surface.border.gray.subtle,
  backgroundColor: theme.colors.surface.background.gray.intense,
}));

export { StyledCardGroupSurface };
