import styled from 'styled-components';
import View from '../View';

const Label = styled(View)`
  position: relative;
  display: flex;
  cursor: pointer;
  overflow: hidden;
  pointer-events: ${(props) => (props.disabled ? 'none' : '')};
`;

export default Label;
