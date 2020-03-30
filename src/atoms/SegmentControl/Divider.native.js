import styled from 'styled-components/native';
import View from '../View';
import { makePxValue } from '../../_helpers/theme';

const Divider = styled(View)`
  position: absolute;
  right: 0px;
  top: ${makePxValue(1)};
  bottom: ${makePxValue(1)};
  width: 1px;
  background-color: ${(props) => props.theme.colors.shade[930]};
`;

export default Divider;
