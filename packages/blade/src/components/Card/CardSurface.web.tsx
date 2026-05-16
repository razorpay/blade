import styled from 'styled-components';
import { getSurfaceStyles } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

import type { ColorSchemeNames } from '~tokens/theme';

type CardSurfaceProps = {
  colorScheme: ColorSchemeNames;
  isSelected?: boolean;
};

const CardSurface = styled(BaseBox)<CardSurfaceProps>(({ theme, colorScheme, isSelected }) => ({
  width: '100%',
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  boxSizing: 'border-box',
  ...getSurfaceStyles(theme, colorScheme, { hideBorder: isSelected }),
}));

export { CardSurface };
