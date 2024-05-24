import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const CardSurface = styled(BaseBox)(({ elevation, theme }) => {
  return {
    width: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    borderWidth: elevation === 'none' ? makeBorderSize(theme.border.width.thin) : undefined,
    borderStyle: elevation === 'none' ? 'solid' : undefined,
    borderColor: elevation === 'none' ? `${theme.colors.surface.border.gray.muted}` : undefined,
    boxSizing: 'border-box',
  };
});

export { CardSurface };
