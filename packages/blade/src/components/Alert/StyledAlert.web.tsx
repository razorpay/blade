import styled from 'styled-components';

import type { StyledAlertProps } from './StyledAlert.d';
import { getCommonStyles } from './styles';

export const StyledAlert = styled.div<StyledAlertProps>(getCommonStyles);
