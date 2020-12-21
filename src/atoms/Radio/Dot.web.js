import styled from 'styled-components';
import View from '../View';

const Dot = styled(View)(
  (props) =>
    `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 50%;
    background-color: ${props.backgroundColor};
  `,
);

export default Dot;
