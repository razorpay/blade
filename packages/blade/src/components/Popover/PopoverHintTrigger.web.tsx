import React from 'react';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography/Text';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { HintTriggerIntent, PopoverHintTriggerProps } from './types';

const _PopoverHintTrigger = (
  {
    intent = 'neutral',
    size = 'medium',
    weight = 'regular',
    children,
    ...rest
  }: PopoverHintTriggerProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const borderColor = theme.colors.feedback.border[intent].intense;

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      style={{
        borderBottom: `1px dotted ${borderColor}`,
        cursor: 'help',
        display: 'inline',
      }}
      {...rest}
      {...metaAttribute({ name: MetaConstants.PopoverHintTrigger })}
    >
      <Text as="span" color={`feedback.text.${intent}.intense`} size={size} weight={weight}>
        {children}
      </Text>
    </span>
  );
};

const PopoverHintTrigger = assignWithoutSideEffects(React.forwardRef(_PopoverHintTrigger), {
  displayName: 'PopoverHintTrigger',
  componentId: 'PopoverHintTrigger',
});

export { PopoverHintTrigger };
export type { PopoverHintTriggerProps, HintTriggerIntent };
