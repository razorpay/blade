import styled from 'styled-components';
import getBaseButtonStyles from './getBaseButtonStyles';

const StyledBaseText = styled.button(
  ({ color, hoverColor }: { color: string; hoverColor: string }) =>
    getBaseButtonStyles({ color, hoverColor }),
);

export default StyledBaseText;
