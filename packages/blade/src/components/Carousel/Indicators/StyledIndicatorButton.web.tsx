import styled from 'styled-components';
import { getIndicatorButtonStyles } from './getIndicatorButtonStyles';
import type { IndicatorButtonProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledIndicatorButton = styled(BaseBox)<Omit<IndicatorButtonProps, 'accessibilityLabel'>>(
  ({ theme, variant, isActive }) => {
    return getIndicatorButtonStyles({ theme, isActive, variant });
  },
);

export { StyledIndicatorButton };
