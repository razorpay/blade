import React from 'react';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography/Text';
import type { BaseTextSizes } from '~components/Typography/BaseText/types';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

type HintTriggerIntent = 'positive' | 'negative' | 'notice' | 'neutral' | 'information';

type PopoverHintTriggerProps = {
  /**
   * The semantic intent of the hint — maps to Blade's feedback color tokens.
   * Controls both the text color and dotted underline color.
   *
   * @default 'neutral'
   */
  intent?: HintTriggerIntent;
  /**
   * Size of the text, matching Blade's Text body sizes.
   *
   * @default 'medium'
   */
  size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
  /**
   * Font weight of the text.
   *
   * @default 'regular'
   */
  weight?: 'regular' | 'medium' | 'semibold';
  children: React.ReactNode;
};

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
      <Text
        as="span"
        color={`feedback.text.${intent}.intense`}
        size={size}
        weight={weight}
      >
        {children}
      </Text>
    </span>
  );
};

const PopoverHintTrigger = assignWithoutSideEffects(
  React.forwardRef(_PopoverHintTrigger),
  {
    displayName: 'PopoverHintTrigger',
    componentId: 'PopoverHintTrigger',
  },
);

export { PopoverHintTrigger };
export type { PopoverHintTriggerProps, HintTriggerIntent };
