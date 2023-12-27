import type { ReactElement } from 'react';
import { ProgressBarFilled } from './ProgressBarFilled';
import clamp from '~utils/lodashButBetter/clamp';
import { FormLabel } from '~components/Form';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { Text } from '~components/Typography/Text';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import type { FeedbackColors } from '~tokens/theme/theme';
import { size } from '~tokens/global';
import type { TestID } from '~utils/types';
import { makeSize } from '~utils/makeSize';
import type { AccessibilityProps } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';
import { throwBladeError } from '~utils/logger';

type ProgressBarCommonProps = {
  /**
   * Sets aria-label to help users know what the progress bar is for. Default value is the same as the `label` passed.
   */
  accessibilityLabel?: string;
  /**
   * Sets the color of the progress bar which changes the feedback color.
   */
  color?: FeedbackColors;
  /**
   * Sets the label to be rendered for the progress bar. This value will also be used as default for `accessibilityLabel`.
   */
  label?: string;
  /**
   * Sets the size of the progress bar.
   * @default 'small'
   */
  size?: 'small' | 'medium';
  /**
   * Sets the progress value of the progress bar.
   * @default 'small'
   */
  value?: number;
  /**
   * Sets the minimum value for the progress bar.
   * @default 0
   */
  min?: number;
  /**
   * Sets the maximum value for the progress bar.
   * @default 100
   */
  max?: number;
} & TestID &
  StyledPropsBlade;

type ProgressBarVariant = 'progress' | 'meter';

type ProgressBarProgressProps = ProgressBarCommonProps & {
  /**
   * Sets the variant to be rendered for the progress bar.
   * @default 'progress'
   */
  variant?: Extract<ProgressBarVariant, 'progress'>;
  /**
   * Sets whether the progress bar is in an indeterminate state.
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * Sets whether or not to show the progress percentage for the progress bar. Percentage is hidden by default for the `meter` variant.
   * @default true
   */
  showPercentage?: boolean;
};

type ProgressBarMeterProps = ProgressBarCommonProps & {
  /**
   * Sets the variant to be rendered for thr progress bar.
   * @default 'progress'
   */
  variant?: Extract<ProgressBarVariant, 'meter'>;
  /**
   * Sets whether the progress bar is in an indeterminate state.
   * @default false
   */
  isIndeterminate?: undefined;
  /**
   * Sets whether or not to show the progress percentage for the progress bar. Percentage is hidden by default for the `meter` variant.
   * @default false
   */
  showPercentage?: undefined;
};

type ProgressBarProps = ProgressBarProgressProps | ProgressBarMeterProps;

const progressBarHeight: Record<NonNullable<ProgressBarCommonProps['size']>, 2 | 4> = {
  small: size[2],
  medium: size[4],
};

const ProgressBar = ({
  accessibilityLabel,
  color,
  isIndeterminate = false,
  label,
  showPercentage = true,
  size = 'small',
  value = 0,
  variant = 'progress',
  min = 0,
  max = 100,
  testID,
  ...styledProps
}: ProgressBarProps): ReactElement => {
  const { theme } = useTheme();
  const id = useId(variant);

  if (__DEV__) {
    if (variant === 'meter' && isIndeterminate) {
      throwBladeError({
        moduleName: 'ProgressBar',
        message: `Cannot set 'isIndeterminate' when 'variant' is 'meter'.`,
      });
    }
  }

  const unfilledBackgroundColor = theme.colors.feedback.background.neutral.subtle;
  const filledBackgroundColor = color
    ? theme.colors.feedback.background[color].intense
    : theme.colors.surface.background.primary.intense;
  const hasLabel = label && label.trim()?.length > 0;
  const isMeter = variant === 'meter';
  const progressValue = clamp(value, min, max);
  const percentageProgressValue = Math.floor(((progressValue - min) * 100) / (max - min));
  const shouldShowPercentage = showPercentage && !isMeter && !isIndeterminate;
  const accessibilityProps: Pick<
    AccessibilityProps,
    'role' | 'label' | 'valueMax' | 'valueNow' | 'valueMin' | 'valueText'
  > = {
    role: 'progressbar',
    label: accessibilityLabel ?? label,
    valueNow: percentageProgressValue,
    valueText: `${percentageProgressValue}%`,
    valueMin: min,
    valueMax: max,
  };

  if (isMeter) {
    accessibilityProps.role = 'meter';
    accessibilityProps.valueNow = progressValue;
    accessibilityProps.valueText = `${progressValue}`;
  }

  if (isIndeterminate) {
    accessibilityProps.valueNow = undefined;
    accessibilityProps.valueMin = undefined;
    accessibilityProps.valueMax = undefined;
    accessibilityProps.valueText = undefined;
  }

  return (
    <BaseBox
      {...getStyledProps(styledProps)}
      {...metaAttribute({ name: MetaConstants.ProgressBar, testID })}
    >
      <BaseBox display="flex" flexDirection="column" width="100%">
        <BaseBox
          display="flex"
          flexDirection="row"
          justifyContent={hasLabel ? 'space-between' : 'flex-end'}
        >
          {hasLabel ? (
            <FormLabel as="label" htmlFor={id}>
              {label}
            </FormLabel>
          ) : null}
          {shouldShowPercentage ? (
            <BaseBox marginBottom="spacing.2">
              <Text
                variant="body"
                size="small"
                color="surface.text.gray.subtle"
              >{`${percentageProgressValue}%`}</Text>
            </BaseBox>
          ) : null}
        </BaseBox>
        <BaseBox
          id={id}
          {...makeAccessible({
            role: accessibilityProps.role,
            label: accessibilityProps.label,
            valueNow: accessibilityProps.valueNow,
            valueText: accessibilityProps.valueText,
            valueMin: accessibilityProps.valueMin,
            valueMax: accessibilityProps.valueMax,
          })}
        >
          <BaseBox
            backgroundColor={unfilledBackgroundColor}
            height={makeSize(progressBarHeight[size])}
            overflow="hidden"
            position="relative"
          >
            <ProgressBarFilled
              backgroundColor={filledBackgroundColor}
              progress={percentageProgressValue}
              fillMotionDuration="duration.2xgentle"
              pulseMotionDuration="duration.2xgentle"
              indeterminateMotionDuration="duration.2xgentle"
              pulseMotionDelay="delay.long"
              motionEasing="easing.standard.revealing"
              variant={variant}
              isIndeterminate={isIndeterminate}
            />
          </BaseBox>
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export type { ProgressBarProps, ProgressBarVariant };
export { ProgressBar };
