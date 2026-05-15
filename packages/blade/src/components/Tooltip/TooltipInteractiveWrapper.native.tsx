import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { useTooltipContext } from './TooltipContext';

import type { PressableProps, View } from 'react-native';

const StyledPressable = styled(Pressable)(() => {
  return { alignSelf: 'flex-start' };
});

const TooltipInteractiveWrapper = React.forwardRef<View, PressableProps>((props, ref) => {
  useTooltipContext();

  return (
    <StyledPressable ref={ref} collapsable={false} testID="tooltip-interactive-wrapper" {...props}>
      {props.children}
    </StyledPressable>
  );
});

export { TooltipInteractiveWrapper };
