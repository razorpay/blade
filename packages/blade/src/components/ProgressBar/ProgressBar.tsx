import type { ReactElement } from 'react';
import styled from 'styled-components';
import { useTheme } from '..';
import Box from '~components/Box';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';
import { makeSize } from '~utils';

type ProgressBarProps = {
  accessibilityLabel?: string;
  contrast?: ColorContrastTypes;
  intent?: Feedback;
  isIndeterminate?: boolean;
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'medium';
  value?: number;
};

type ProgressBarUnfilledProps = {
  backgroundColor: string;
};

const ProgressBarUnfilled = styled(Box)<ProgressBarUnfilledProps>(({ backgroundColor }) => ({
  backgroundColor,
}));

type ProgressBarFilledProps = {
  backgroundColor: string;
};

const ProgressBarFilled = styled(Box)<ProgressBarFilledProps>(({ backgroundColor }) => ({
  backgroundColor,
}));

const getProgress = (value: number): number => {
  return Math.floor(Math.min(100, Math.max(0, value)));
};

const progressBarHeight: Record<NonNullable<ProgressBarProps['size']>, 2 | 4> = {
  small: 2,
  medium: 4,
};

const ProgressBar = ({
  accessibilityLabel,
  contrast = 'low',
  intent,
  isIndeterminate,
  label,
  showPercentage,
  size = 'small',
  value = 0,
}: ProgressBarProps): ReactElement => {
  console.log(
    accessibilityLabel,
    contrast,
    intent,
    isIndeterminate,
    label,
    showPercentage,
    size,
    value,
  );

  const { theme } = useTheme();
  const unfilledBackgroundColor = theme.colors.brand.gray.a100[`${contrast}Contrast`];
  const filledBackgroundColor = theme.colors.brand.primary[500];

  return (
    <Box>
      <ProgressBarUnfilled
        backgroundColor={unfilledBackgroundColor}
        height={makeSize(progressBarHeight[size])}
        flex={1}
      >
        <ProgressBarFilled
          backgroundColor={filledBackgroundColor}
          height="100%"
          width={`${getProgress(value)}%`}
        />
      </ProgressBarUnfilled>
    </Box>
  );
};

export { ProgressBar, ProgressBarProps };
