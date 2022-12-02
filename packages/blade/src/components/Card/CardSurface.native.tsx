import styled from 'styled-components/native';
import Box from '~components/Box';

const CardSurface = styled(Box)(() => {
  return {
    shadowOpacity: 1,
    shadowRadius: '5px',
    shadowColor: 'blue',
    shadowOffset: '0px 0px',
  };
});

export { CardSurface };
