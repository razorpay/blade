import styled from 'styled-components';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceStyles } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

type AccordionSurfaceProps = {
  colorScheme: ColorSchemeNames;
};

const AccordionSurface = styled(BaseBox)<AccordionSurfaceProps>(({ theme, colorScheme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  ...getSurfaceStyles(theme, colorScheme),
}));

export { AccordionSurface };
