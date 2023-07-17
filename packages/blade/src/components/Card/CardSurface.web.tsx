import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';

const CardSurface = styled(BaseBox)<{ surfaceLevel: 2 | 3 }>(
  ({ surfaceLevel, elevation, theme }) => {
    const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderWidth: elevation === 'none' ? `${theme.border.width.thin}` : undefined,
      borderStyle: elevation === 'none' ? 'solid' : undefined,
      borderColor:
        elevation === 'none' ? `${theme.colors.surface.border.normal.lowContrast}` : undefined,
      backgroundColor,
      boxSizing: 'border-box',
    };
  },
);

export { CardSurface };
