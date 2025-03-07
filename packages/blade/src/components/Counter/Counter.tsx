import React from 'react';
import { StyledCounter } from './StyledCounter';
import type { StyledCounterProps } from './types';
import { counterHeight, horizontalPadding } from './counterTokens';
import type { FeedbackColors, SubtleOrIntense } from '~tokens/theme/theme';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';
import { isReactNative, makeSize } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

export type CounterProps = {
  /**
   * Sets the value for the counter.
   */
  value: number;
  /**
   * Sets the max value for the counter.
   * If value exceedes `max` it will render `value+`
   */
  max?: number;
  /**
   * Sets the color of the counter.
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  /**
   * Sets the contrast of the counter.
   *
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;
  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type ColorProps = {
  textColor: BaseTextProps['color'];
  backgroundColor: StyledCounterProps['backgroundColor'];
};

const getColorProps = ({
  color = 'neutral',
  emphasis = 'subtle',
}: {
  color: NonNullable<CounterProps['color']>;
  emphasis: NonNullable<CounterProps['emphasis']>;
}): ColorProps => {
  const props: ColorProps = {
    textColor: 'feedback.text.neutral.intense',
    backgroundColor: 'feedback.background.neutral.subtle',
  };

  if (color === 'primary') {
    // primary color badge
    props.textColor =
      emphasis === 'intense' ? `surface.text.staticWhite.normal` : `surface.text.primary.normal`;
    props.backgroundColor = `surface.background.primary.${emphasis}`;
  } else {
    // feedback colors badge
    props.textColor =
      emphasis === 'intense' ? `surface.text.staticWhite.normal` : `feedback.text.${color}.intense`;
    props.backgroundColor = `feedback.background.${color}.${emphasis}`;
  }
  return props;
};

const _Counter = (
  {
    value,
    max,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    testID,
    ...rest
  }: CounterProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  let content = `${value}`;
  if (max && value > max) {
    content = `${max}+`;
  }

  const { platform } = useTheme();
  const { backgroundColor, textColor } = getColorProps({
    color,
    emphasis,
  });

  const counterTextSizes = {
    small: {
      variant: 'body',
      size: 'xsmall',
    },
    medium: {
      variant: 'body',
      size: 'small',
    },
    large: {
      variant: 'body',
      size: 'medium',
    },
  } as const;

  return (
    <BaseBox
      ref={ref as never}
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      {...metaAttribute({ name: MetaConstants.Counter, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <StyledCounter
        minHeight={makeSize(counterHeight[size])}
        backgroundColor={backgroundColor}
        size={size}
        platform={platform}
      >
        <BaseBox
          paddingX={horizontalPadding[size]}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <Text
            {...counterTextSizes[size]}
            textAlign="center"
            weight="medium"
            truncateAfterLines={1}
            color={textColor}
          >
            {content}
          </Text>
        </BaseBox>
      </StyledCounter>
    </BaseBox>
  );
};

const Counter = assignWithoutSideEffects(React.forwardRef(_Counter), {
  displayName: 'Counter',
  componentId: 'Counter',
});

export { Counter };
