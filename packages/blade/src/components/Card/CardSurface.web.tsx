import styled from 'styled-components';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceStyles } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

type CardSurfaceProps = {
  colorScheme: ColorSchemeNames;
};

const CardSurface = styled(BaseBox)<CardSurfaceProps>(({ theme, colorScheme }) => ({
  width: '100%',
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  boxSizing: 'border-box',
  ...getSurfaceStyles(theme, colorScheme),
}));

export { CardSurface };
