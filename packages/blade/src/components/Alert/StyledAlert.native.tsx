import styled from 'styled-components/native';

import type { StyledAlertProps } from './StyledAlert.d';
import { getCommonStyles } from './styles';

const StyledAlert = styled.View<StyledAlertProps>(getCommonStyles);

export default StyledAlert;
