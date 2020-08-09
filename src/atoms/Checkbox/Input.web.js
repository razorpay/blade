import styled from 'styled-components';
import Backdrop from './Backdrop';

const Input = styled.input.attrs({
  type: 'checkbox',
})`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border: 0;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(1px 0 0 0);

  &:hover {
    + ${Backdrop} {
      background-color: ${(props) =>
        props.backdropStyles.backgroundColor({ ...props, state: 'hover' })};
    }
  }

  &:focus {
    + ${Backdrop} {
      background-color: ${(props) =>
        props.backdropStyles.backgroundColor({ ...props, state: 'focus' })};
    }
  }

  &:active {
    + ${Backdrop} {
      background-color: ${(props) =>
        props.backdropStyles.backgroundColor({ ...props, state: 'active' })};
    }
  }
`;

export default Input;
