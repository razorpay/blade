import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';

const CardSurface = styled(BaseBox)<{ surfaceLevel: 2 | 3 }>(({ surfaceLevel, theme }) => {
  const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: castWebType(theme.elevation.lowRaised),
    backgroundColor,
    boxSizing: 'border-box',
  };
});

export { CardSurface };
