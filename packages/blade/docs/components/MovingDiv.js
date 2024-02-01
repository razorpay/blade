import styled from 'styled-components';
import { makeBorderSize } from '../../src/utils';

const MovingDiv = styled.div`
  height: 40px;
  width: 40px;
  background-color: ${(props) => props.theme.colors.surface.background.primary.subtle};
  border-radius: ${(props) => makeBorderSize(props.theme.border.radius.medium)};
  animation: ${(props) => `move 3s ${props.easing || 'linear'}  infinite`};
  @keyframes move {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(0px);
    }
  }
`;

export default MovingDiv;
