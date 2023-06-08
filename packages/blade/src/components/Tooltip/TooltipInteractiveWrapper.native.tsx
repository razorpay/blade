import React from 'react';
import type { PressableProps, View } from 'react-native';
import { Pressable } from 'react-native';

const TooltipInteractiveWrapper = React.forwardRef<View, PressableProps>((props, ref) => {
  return (
    <Pressable ref={ref} style={{ alignSelf: 'flex-start' }} collapsable={false} {...props}>
      {props.children}
    </Pressable>
  );
});

export { TooltipInteractiveWrapper };
