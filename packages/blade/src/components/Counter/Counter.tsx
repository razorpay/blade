import { StyledCounter } from './StyledCounter';
import type { StyledCounterProps } from './types';
import { horizontalPadding, verticalPadding } from './counterTokens';
import type { Feedback } from '~tokens/theme/theme';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';
import { isReactNative } from '~utils';

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
   * @deprecated Use `variant` instead
   */
  intent?: Feedback;
  /**
   * Sets the variant of the counter.
   *
   * @default 'neutral'
   */
  variant?: Feedback | 'blue';
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
} & TestID &
  StyledPropsBlade;

type ColorProps = {
  textColor: BaseTextProps['color'];
  backgroundColor: StyledCounterProps['backgroundColor'];
};

const isFeedbackVariant = (variant: string): variant is Feedback => {
  const feedbackVariants = ['information', 'negative', 'neutral', 'notice', 'positive'];
  return feedbackVariants.includes(variant);
};

const getColorProps = ({
  variant = 'neutral',
  contrast = 'low',
}: {
  variant: NonNullable<CounterProps['variant']>;
  contrast: NonNullable<CounterProps['contrast']>;
}): ColorProps => {
  const props: ColorProps = {
    textColor: 'feedback.text.neutral.lowContrast',
    backgroundColor: 'feedback.background.neutral.lowContrast',
  };
  if (isFeedbackVariant(variant)) {
    props.textColor = `feedback.text.${variant}.${contrast}Contrast`;
    props.backgroundColor = `feedback.background.${variant}.${contrast}Contrast`;
  } else {
    props.textColor = `badge.text.${variant}.${contrast}Contrast`;
    props.backgroundColor = `badge.background.${variant}.${contrast}Contrast`;
  }
  return props;
};

const Counter = ({
  value,
  max,
  intent,
  variant = 'neutral',
  contrast = 'low',
  size = 'medium',
  testID,
  ...styledProps
}: CounterProps): React.ReactElement => {
  let content = `${value}`;
  if (max && value > max) {
    content = `${max}+`;
  }

  const { platform } = useTheme();
  const { backgroundColor, textColor } = getColorProps({
    variant: intent ?? variant,
    contrast,
  });

  if (intent) {
    console.warn(
      '[Blade: Counter] The prop `intent` is deprecated and will be removed in a future release. Please use `variant` instead.',
    );
  }

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
      {...metaAttribute({ name: MetaConstants.Counter, testID })}
      {...getStyledProps(styledProps)}
    >
      <StyledCounter backgroundColor={backgroundColor} size={size} platform={platform}>
        <BaseBox
          paddingRight={horizontalPadding[size]}
          paddingLeft={horizontalPadding[size]}
          paddingTop={verticalPadding[size]}
          paddingBottom={verticalPadding[size]}
          display={(isReactNative() ? 'flex' : 'inline-flex') as never}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <Text
            {...counterTextSizes[size]}
            textAlign="center"
            type="normal"
            weight="regular"
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

export { Counter };
