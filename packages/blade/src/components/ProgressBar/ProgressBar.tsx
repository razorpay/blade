import type { ReactElement } from 'react';
import Box from '~components/Box';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';

type ProgressBarProps = {
  accessibilityLabel?: string;
  contrast?: ColorContrastTypes;
  intent?: Feedback;
  isIndeterminate?: boolean;
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'large';
  value?: number;
};

const ProgressBar = ({
  accessibilityLabel,
  contrast,
  intent,
  isIndeterminate,
  label,
  showPercentage,
  size,
  value,
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
  return (
    <Box>
      <Box />
    </Box>
  );
};

export { ProgressBar, ProgressBarProps };
