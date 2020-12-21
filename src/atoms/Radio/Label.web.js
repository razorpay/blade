import styled from 'styled-components';
import View from '../View';

const Label = styled(View)`
  position: relative;
  cursor: pointer;
  pointer-events: ${(props: any) => (props.disabled ? 'none' : '')};
`;

export default Label;
