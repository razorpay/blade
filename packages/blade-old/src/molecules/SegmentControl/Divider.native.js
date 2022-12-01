import styled from 'styled-components/native';
import View from '../../atoms/View';
import { makePxValue } from '../../_helpers/theme';

const Divider = styled(View)`
  position: absolute;
  right: 0px;
  top: ${makePxValue(1)};
  bottom: ${makePxValue(1)};
  width: 1px;
  background-color: ${(props) => props.theme.bladeOld.colors.shade[930]};
`;

export default Divider;
