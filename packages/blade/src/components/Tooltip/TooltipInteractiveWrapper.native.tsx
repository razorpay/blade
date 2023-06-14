import React from 'react';
import type { PressableProps, View } from 'react-native';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

const StyledPressable = styled(Pressable)(() => {
  return { alignSelf: 'flex-start' };
});

const TooltipInteractiveWrapper = React.forwardRef<View, PressableProps>((props, ref) => {
  return (
    <StyledPressable ref={ref} collapsable={false} testID="tooltip-interactive-wrapper" {...props}>
      {props.children}
    </StyledPressable>
  );
});

export { TooltipInteractiveWrapper };
