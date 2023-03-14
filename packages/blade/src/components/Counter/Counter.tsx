import { StyledCounter } from './StyledCounter';
import type { StyledCounterProps } from './types';
import { horizontalPadding, verticalPadding } from './counterTokens';
import type { Feedback } from '~tokens/theme/theme';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { metaAttribute, MetaConstants } from '~utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';

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
   * Sets the intent of the counter.
   *
   * @default 'neutral'
   */
  intent?: Feedback;
  /**
   * Sets the contrast of the counter.
   *
   * @default 'low'
   */
  contrast?: 'high' | 'low';
  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & StyledPropsBlade;

type ColorProps = {
  textColor: BaseTextProps['color'];
  backgroundColor: StyledCounterProps['backgroundColor'];
};

const getColorProps = ({
  intent = 'neutral',
  contrast = 'low',
}: {
  intent: NonNullable<CounterProps['intent']>;
  contrast: NonNullable<CounterProps['contrast']>;
}): ColorProps => {
  const props: ColorProps = {
    textColor: `feedback.text.${intent}.${contrast}Contrast`,
    backgroundColor: `feedback.background.${intent}.${contrast}Contrast`,
  };
  return props;
};

const Counter = ({
  value,
  max,
  intent = 'neutral',
  contrast = 'low',
  size = 'medium',
  ...styledProps
}: CounterProps): React.ReactElement => {
  let content = `${value}`;
  if (max && value > max) {
    content = `${max}+`;
  }

  const { platform } = useTheme();
  const { backgroundColor, textColor } = getColorProps({
    intent,
    contrast,
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
    <StyledCounter
      backgroundColor={backgroundColor}
      size={size}
      platform={platform}
      {...getStyledProps(styledProps)}
    >
      <BaseBox
        paddingRight={horizontalPadding[size]}
        paddingLeft={horizontalPadding[size]}
        paddingTop={verticalPadding[size]}
        paddingBottom={verticalPadding[size]}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        {...metaAttribute(MetaConstants.Component, MetaConstants.Counter)}
      >
        <Text
          {...counterTextSizes[size]}
          type="normal"
          weight="regular"
          truncateAfterLines={1}
          color={textColor}
        >
          {content}
        </Text>
      </BaseBox>
    </StyledCounter>
  );
};

export { Counter };
