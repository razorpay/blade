import React from 'react';
import type { ReactElement, Ref } from 'react';
import { ProgressBarFilled } from './ProgressBarFilled';
import { CircularProgressBarFilled } from './CircularProgressBar';
import clamp from '~utils/lodashButBetter/clamp';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { Text } from '~components/Typography/Text';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type { FeedbackColors } from '~tokens/theme/theme';
import { size } from '~tokens/global';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';
import { makeSize } from '~utils/makeSize';
import type { AccessibilityProps } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
   * Sets the type of the progress bar.
   * @default 'progress'
   */
  type?: 'meter' | 'progress';
  /**
   * Sets the label to be rendered for the progress bar. This value will also be used as default for `accessibilityLabel`.
   */
  label?: string;
  /**
   * Sets the size of the progress bar.
   * Note: 'large' size isn't available when the variant is 'linear'.
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
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
  DataAnalyticsAttribute &
  StyledPropsBlade;

type ProgressBarVariant = 'progress' | 'meter' | 'linear' | 'circular';

type ProgressBarProgressProps = ProgressBarCommonProps & {
  /**
   * Sets the variant to be rendered for the progress bar.
   * @default 'progress'
   */
  variant?: Extract<ProgressBarVariant, 'progress' | 'linear' | 'circular'>;
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
  variant?: Extract<ProgressBarVariant, 'meter' | 'linear' | 'circular'>;
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

const progressBarHeight: Record<NonNullable<ProgressBarProps['size']>, 2 | 4 | 0> = {
  small: size[2],
  medium: size[4],
  // Large size isn't available when variant is 'linear'
  large: size[0],
};

const _ProgressBar = (
  {
    accessibilityLabel,
    color,
    type,
    isIndeterminate = false,
    label,
    showPercentage = true,
    size = 'small',
    value = 0,
    variant = 'progress',
    min = 0,
    max = 100,
    testID,
    ...rest
  }: ProgressBarProps,
  ref: Ref<BladeElementRef>,
): ReactElement => {
  const { theme } = useTheme();
  const progressType = !type && (variant === 'meter' || variant === 'progress') ? variant : type;
  const progressVariant = variant === 'meter' || variant === 'progress' ? 'linear' : variant;
  const id = useId(`${progressType}-${progressVariant}`);

  if (__DEV__) {
    if (progressType === 'meter' && isIndeterminate) {
      throwBladeError({
        moduleName: 'ProgressBar',
        message: `Cannot set 'isIndeterminate' when 'type' or 'variant' is 'meter'.`,
      });
    }

    if (progressVariant === 'circular' && isIndeterminate) {
      throwBladeError({
        moduleName: 'ProgressBar',
        message: `Cannot set 'isIndeterminate' when 'variant' is 'circular'.`,
      });
    }

    if (progressVariant === 'linear' && size === 'large') {
      throwBladeError({
        moduleName: 'ProgressBar',
        message: `Large size isn't available when 'variant' is 'linear'.`,
      });
    }

    if (type && (variant === 'progress' || variant === 'meter')) {
      throwBladeError({
        moduleName: 'ProgressBar',
        message: `variant can only be 'linear' or 'circular' when 'type=${type}'.`,
      });
    }
  }

  const unfilledBackgroundColor = theme.colors.feedback.background.neutral
    .subtle as BaseBoxProps['backgroundColor'];
  const filledBackgroundColor = color
    ? theme.colors.feedback.background[color].intense
    : theme.colors.surface.background.primary.intense;
  const hasLabel = label && label.trim()?.length > 0;
  const isMeter = progressType === 'meter';
  const isCircular = progressVariant === 'circular';
  const progressValue = clamp(value, min, max);
  const percentageValue = ((progressValue - min) * 100) / (max - min);
  const percentageProgressValue = isMeter
    ? parseFloat(percentageValue.toFixed(1))
    : Math.floor(percentageValue);
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
      ref={ref as never}
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.ProgressBar, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox display="flex" flexDirection="column" width="100%">
        {!isCircular ? (
          <BaseBox
            display="flex"
            flexDirection="row"
            justifyContent={hasLabel ? 'space-between' : 'flex-end'}
          >
            {hasLabel ? (
              <Text as="label" variant="body" size="small" color="surface.text.gray.subtle">
                {label}
              </Text>
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
        ) : null}

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
          {isCircular ? (
            <CircularProgressBarFilled
              size={size}
              label={label}
              progressPercent={percentageProgressValue}
              isMeter={isMeter}
              showPercentage={showPercentage}
              backgroundColor={unfilledBackgroundColor as string}
              fillColor={filledBackgroundColor}
              pulseMotionDuration="duration.2xgentle"
              fillMotionDuration="duration.2xgentle"
              pulseMotionDelay="delay.long"
              motionEasing="easing.emphasized"
            />
          ) : (
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
                motionEasing="easing.emphasized"
                type={progressType}
                isIndeterminate={isIndeterminate}
              />
            </BaseBox>
          )}
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

const ProgressBar = React.forwardRef(_ProgressBar);

export type { ProgressBarProps, ProgressBarVariant };
export { ProgressBar };
