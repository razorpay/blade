import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getCommonStyles } from './styles';

import type { StyledAlertProps } from './types';

export const StyledAlert = styled(BaseBox)<StyledAlertProps>(getCommonStyles);
