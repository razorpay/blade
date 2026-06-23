import React from 'react';
import { View } from 'react-native';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography/Text';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { HintTriggerIntent, PopoverHintTriggerProps } from './types';

const _PopoverHintTrigger = ({
  intent = 'neutral',
  size = 'medium',
  weight = 'regular',
  children,
}: PopoverHintTriggerProps): React.ReactElement => {
  const { theme } = useTheme();
  const borderColor = theme.colors.feedback.border[intent].intense;

  return (
    // React Native doesn't support border-style: dotted — use solid underline as closest affordance
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        as="span"
        color={`feedback.text.${intent}.intense`}
        size={size}
        weight={weight}
      >
        {children}
      </Text>
    </View>
  );
};

const PopoverHintTrigger = assignWithoutSideEffects(_PopoverHintTrigger, {
  displayName: 'PopoverHintTrigger',
  componentId: 'PopoverHintTrigger',
});

export { PopoverHintTrigger };
export type { PopoverHintTriggerProps, HintTriggerIntent };
