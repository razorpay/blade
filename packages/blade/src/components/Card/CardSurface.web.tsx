import styled from 'styled-components';
import Box from '~components/Box';

const CardSurface = styled(Box)(({ theme }) => {
  const offsetX = theme.shadows.offsetX.level[1];
  const offsetY = theme.shadows.offsetY.level[1];
  const blur = theme.shadows.blurRadius.level[1];
  const shadowColor = theme.shadows.color.level[1];

  const shadow1 = `${offsetX}px ${offsetY}px ${blur}px 0px ${shadowColor}`;
  const shadow2 = `0px 0px 1px 0px ${shadowColor}`;

  return {
    boxShadow: `${shadow1}, ${shadow2}`,
  };
});

export { CardSurface };
