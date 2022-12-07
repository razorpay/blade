import type { ReactElement } from 'react';
import styled from 'styled-components';
import { ProgressBarFilled } from './ProgressBarFilled';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';
import { makeSize } from '~utils';
import { FormLabel } from '~components/Form';

type ProgressBarCommonProps = {
  accessibilityLabel?: string;
  contrast?: ColorContrastTypes;
  intent?: Feedback;
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'medium';
  value?: number;
};

type ProgressBarVariant = 'progress' | 'meter';

type ProgressBarProgressProps = ProgressBarCommonProps & {
  variant?: Extract<ProgressBarVariant, 'progress'>;
  isIndeterminate?: boolean;
};

type ProgressBarMeterProps = ProgressBarCommonProps & {
  variant?: Extract<ProgressBarVariant, 'meter'>;
  isIndeterminate?: undefined;
};

type ProgressBarProps<T> = T extends {
  variant: infer Variant;
}
  ? Variant extends 'progress'
    ? ProgressBarProgressProps
    : Variant extends 'meter'
    ? ProgressBarMeterProps
    : T
  : T;

type ProgressBarUnfilledProps = {
  backgroundColor: string;
};

const ProgressBarUnfilled = styled(Box)<ProgressBarUnfilledProps>(({ backgroundColor }) => ({
  backgroundColor,
}));

const getProgress = (value: number): number => {
  return Math.floor(Math.min(100, Math.max(0, value)));
};

const progressBarHeight: Record<NonNullable<ProgressBarCommonProps['size']>, 2 | 4> = {
  small: 2,
  medium: 4,
};

const ProgressBar = <T extends { variant: ProgressBarVariant }>({
  accessibilityLabel,
  contrast = 'low',
  intent,
  isIndeterminate,
  label,
  showPercentage = false,
  size = 'small',
  value = 0,
  variant = 'progress',
}: ProgressBarProps<T>): ReactElement => {
  console.log(accessibilityLabel, isIndeterminate);
  if (variant === 'meter' && isIndeterminate) {
    console.warn(`[Blade: BaseLink]: `);
  }

  const { theme } = useTheme();
  const unfilledBackgroundColor = theme.colors.brand.gray.a100[`${contrast}Contrast`];
  const filledBackgroundColor = intent
    ? theme.colors.feedback.background[intent].highContrast
    : theme.colors.brand.primary[500];
  const hasLabel = label && label.trim()?.length > 0;

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent={hasLabel ? 'space-between' : 'flex-end'}
      >
        {hasLabel ? (
          <FormLabel as="label" htmlFor="progressbar" contrast={contrast} spacingBottom="spacing.2">
            {label}
          </FormLabel>
        ) : null}
        {showPercentage ? (
          <FormLabel as="span" contrast={contrast} spacingBottom="spacing.2">{`${getProgress(
            value,
          )}%`}</FormLabel>
        ) : null}
      </Box>
      <Box id="progressbar">
        <ProgressBarUnfilled
          backgroundColor={unfilledBackgroundColor}
          height={makeSize(progressBarHeight[size])}
        >
          <ProgressBarFilled
            backgroundColor={filledBackgroundColor}
            progress={getProgress(value)}
            fillMotionDuration="duration.xgentle"
            pulseMotionDuration="duration.2xgentle"
            pulseMotionDelay="delay.long"
            motionEasing="easing.standard.revealing"
            variant={variant}
          />
        </ProgressBarUnfilled>
      </Box>
    </Box>
  );
};

export { ProgressBar, ProgressBarProps, ProgressBarVariant };
