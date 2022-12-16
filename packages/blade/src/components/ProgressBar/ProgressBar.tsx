import type { ReactElement } from 'react';
import clamp from 'lodash/clamp';
import { ProgressBarFilled } from './ProgressBarFilled';
import { ProgressBarFilledIndeterminate } from './ProgressBarFilledIndeterminate.web';
import { FormLabel } from '~components/Form';
import { makeAccessible, makeSize } from '~utils';
import { Text } from '~components/Typography/Text';
import { useId } from '~src/hooks/useId';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';

type ProgressBarCommonProps = {
  /**
   * Sets aria-label to help users know what the progress bar is for. Default value is the same as the `label` passed.
   */
  accessibilityLabel?: string;
  /**
   * Sets the contrast for the progress bar
   * @default 'low'
   */
  contrast?: ColorContrastTypes;
  /**
   * Sets the intent of the progress bar which changes the feedback color.
   */
  intent?: Feedback;
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
};

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
   * @default false
   */
  hidePercentage?: boolean;
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
  hidePercentage?: undefined;
};

type ProgressBarProps = ProgressBarProgressProps | ProgressBarMeterProps;

const progressBarHeight: Record<NonNullable<ProgressBarCommonProps['size']>, 2 | 4> = {
  small: 2,
  medium: 4,
};

const ProgressBar = ({
  accessibilityLabel,
  contrast = 'low',
  intent,
  isIndeterminate,
  label,
  hidePercentage = false,
  size = 'small',
  value = 0,
  variant = 'progress',
}: ProgressBarProps): ReactElement => {
  const { theme } = useTheme();
  const id = useId(variant);

  if (variant === 'meter' && isIndeterminate) {
    throw new Error(
      `[Blade: ProgressBar]: Cannot set 'isIndeterminate' when 'variant' is 'meter'.`,
    );
  }

  if (variant === 'meter' && hidePercentage) {
    throw new Error(
      `[Blade: ProgressBar]: Cannot set 'hidePercentage' when 'variant' is 'meter'. Percentage is always hidden for meter.`,
    );
  }

  const unfilledBackgroundColor = theme.colors.brand.gray.a100[`${contrast}Contrast`];
  const filledBackgroundColor = intent
    ? theme.colors.feedback.background[intent].highContrast
    : theme.colors.brand.primary[500];
  const hasLabel = label && label.trim()?.length > 0;
  const isMeter = variant === 'meter';
  const progressValue = clamp(value, 0, 100);

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent={hasLabel ? 'space-between' : 'flex-end'}
      >
        {hasLabel ? (
          <FormLabel as="label" htmlFor={id} contrast={contrast}>
            {label}
          </FormLabel>
        ) : null}
        {hidePercentage || isMeter ? null : (
          <Box marginBottom="spacing.2">
            <Text
              type="subdued"
              variant="body"
              contrast={contrast}
              size="small"
            >{`${progressValue}%`}</Text>
          </Box>
        )}
      </Box>
      <Box
        id={id}
        {...makeAccessible({
          role: variant === 'meter' ? 'meter' : 'progressbar',
          label: accessibilityLabel ?? label,
          valueNow: progressValue,
          valueText: `${progressValue}${isMeter ? '' : '%'}`,
          valueMin: 0,
          valueMax: 100,
        })}
      >
        <Box
          backgroundColor={unfilledBackgroundColor}
          height={makeSize(progressBarHeight[size])}
          overflow="hidden"
          position="relative"
        >
          <ProgressBarFilledIndeterminate
            backgroundColor={filledBackgroundColor}
            fillMotionDuration="duration.2xgentle"
            pulseMotionDuration="duration.2xgentle"
            pulseMotionDelay="delay.long"
            motionEasing="easing.standard.revealing"
            variant={variant}
          />
          {/* <ProgressBarFilled
            backgroundColor={filledBackgroundColor}
            progress={progressValue}
            fillMotionDuration="duration.2xgentle"
            pulseMotionDuration="duration.2xgentle"
            pulseMotionDelay="delay.long"
            motionEasing="easing.standard.revealing"
            variant={variant}
          /> */}
        </Box>
      </Box>
    </>
  );
};

export { ProgressBar, ProgressBarProps, ProgressBarVariant };
