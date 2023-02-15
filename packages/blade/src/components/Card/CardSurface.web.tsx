import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';

const CardSurface = styled(BaseBox)<{ surfaceLevel: 2 | 3 }>(({ surfaceLevel, theme }) => {
  const offsetX = theme.shadows.offsetX.level[1];
  const offsetY = theme.shadows.offsetY.level[1];
  const blur = theme.shadows.blurRadius.level[1];
  const shadowColor = theme.shadows.color.level[1];

  const shadow1 = `${offsetX}px ${offsetY}px ${blur}px 0px ${shadowColor}`;
  const shadow2 = `0px 0px 1px 0px ${shadowColor}`;
  const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: `${shadow1}, ${shadow2}`,
    backgroundColor,
  };
});

export { CardSurface };
