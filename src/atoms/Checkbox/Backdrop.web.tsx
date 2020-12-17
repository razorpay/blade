import styled from 'styled-components';
import View from '../View';

const Backdrop = styled(View)`
  display: flex;
  background-color: transparent;
  border-radius: ${(props) => props.borderRadius};
  outline: none;
`;

export default Backdrop;
