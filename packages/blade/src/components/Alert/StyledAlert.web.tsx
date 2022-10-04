import styled from 'styled-components';
import type { StyledAlertProps } from './types';
import { getCommonStyles } from './styles';

export const StyledAlert = styled.div<StyledAlertProps>(getCommonStyles);
