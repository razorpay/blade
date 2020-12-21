import styled from 'styled-components';
import View from '../View';

const Circle = styled(View)<any>(
  (props) =>
    `
    position: relative;
    border-radius: 50%;
    border: ${props.borderWidth} solid ${props.color};'
  `,
);

export default Circle;
