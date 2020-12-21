import styled from 'styled-components';
import View from '../View';

const Label = styled(View)`
  position: relative;
  display: flex;
  cursor: pointer;
  overflow: hidden;
  pointer-events: ${(props: any) => (props.disabled ? 'none' : '')};
`;

export default Label;
