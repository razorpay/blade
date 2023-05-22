import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import type { Elevation } from '~tokens/global';
import { castWebType } from '~utils';

const CardSurface = styled(BaseBox)<{ surfaceLevel: 2 | 3; elevation: keyof Elevation }>(
  ({ surfaceLevel, elevation, theme }) => {
    const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: castWebType(theme.elevation[elevation]),
      backgroundColor,
      boxSizing: 'border-box',
    };
  },
);

export { CardSurface };
