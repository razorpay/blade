import type { StyledComponent } from 'styled-components';
import styled from 'styled-components';
import type { StyledAlertProps } from './types';
import { getCommonStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';

export const StyledAlert: StyledComponent<typeof BaseBox, any, StyledAlertProps> = styled(
  BaseBox,
)<StyledAlertProps>(getCommonStyles);
