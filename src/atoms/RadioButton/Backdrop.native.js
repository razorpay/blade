import styled from 'styled-components/native';
import View from '../View';

const Backdrop = styled(View)(
  (props) => `width: ${props.width};
height: ${props.height};
border-radius: ${props.borderRadius};
background-color: ${props.backgroundColor};
padding: ${'7px'};`,
);

export default Backdrop;
