import styled from 'styled-components';
import type { StyledAlertProps } from './types';
import { getCommonStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';

export const StyledAlert = styled(BaseBox)<StyledAlertProps>(getCommonStyles);
