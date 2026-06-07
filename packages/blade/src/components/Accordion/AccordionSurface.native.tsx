import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

type AccordionSurfaceProps = {
  colorScheme?: string;
};

const AccordionSurface = styled(BaseBox)<AccordionSurfaceProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderWidth: makeBorderSize(theme.border.width.thin),
  borderStyle: 'solid',
  borderColor: `${theme.colors.surface.border.gray.muted}`,
}));

export { AccordionSurface };
