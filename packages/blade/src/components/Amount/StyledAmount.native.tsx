import styled from 'styled-components/native';
import type { BaseBoxProps } from '../Box/BaseBox/types';
import { getAmountStyles } from './getAmountBadgeStyles';

const StyledAmount = styled.View<BaseBoxProps>((props) => ({
  ...getAmountStyles(props),
}));
export { StyledAmount };
