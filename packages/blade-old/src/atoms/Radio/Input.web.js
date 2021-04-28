import styled from 'styled-components';
import Backdrop from './Backdrop';

const Input = styled.input.attrs({
  type: 'radio',
})`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  clip-path: inset(2px 2px 2px 0);
  outline: none;
  &:hover {
    + ${Backdrop} {
      background-color: ${(props) =>
        props.backdropStyles.backgroundColor({
          ...props,
          state: 'hover',
        })};
    }
  }
  &:focus {
    + ${Backdrop} {
      background-color: ${(props) =>
        props.backdropStyles.backgroundColor({
          ...props,
          state: 'focus',
        })};
    }
  }
  &:active {
    + ${Backdrop} {
      background-color: ${(props) =>
        props.backdropStyles.backgroundColor({
          ...props,
          state: 'active',
        })};
    }
  }
`;

export default Input;
