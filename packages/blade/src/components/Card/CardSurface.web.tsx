import styled from 'styled-components';
import Box from '~components/Box';

const CardSurface = styled(Box)(() => {
  return {
    boxShadow: '0px 1px 2px 0 blue',
  };
});

export { CardSurface };
