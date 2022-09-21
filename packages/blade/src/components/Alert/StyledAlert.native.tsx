import styled from 'styled-components/native';
import type { StyledAlertProps } from './types';
import { getCommonStyles } from './styles';

export const StyledAlert = styled.View<StyledAlertProps>(getCommonStyles);
