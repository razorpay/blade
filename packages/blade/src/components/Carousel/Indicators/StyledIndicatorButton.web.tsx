import styled from 'styled-components';
import { getIndicatorButtonStyles } from './getIndicatorButtonStyles';
import type { IndicatorButtonProps } from './types';

const StyledIndicatorButton = styled.button<IndicatorButtonProps>(
  ({ theme, variant, isActive }) => {
    return getIndicatorButtonStyles({ theme, isActive, variant });
  },
);

export { StyledIndicatorButton };
