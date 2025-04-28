## Component Name

ProgressBar

## Description

A ProgressBar is a visual indicator that displays the progress of a process or task. It can be used to show determinate progress (with a known completion percentage) or indeterminate progress (when the completion time is unknown). The component offers different variants including linear and circular styles, and can be configured as either a progress indicator or a meter depending on the use case.

## TypeScript Types

These types represent the props that the component accepts. When using the ProgressBar component, you'll need to understand these types to properly configure it.

```typescript
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
```

## Example

### Basic Usage

```tsx
import { ProgressBar } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function BasicProgressBarExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Simple progress bar */}
      <ProgressBar label="Loading data" value={60} size="medium" />

      {/* Circular progress bar */}
      <ProgressBar label="Upload progress" value={75} variant="circular" size="medium" />
    </Box>
  );
}
```

### Dynamic Progress

```tsx
import { ProgressBar } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { useState, useEffect } from 'react';

function DynamicProgressExample() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <ProgressBar
        label={`File upload (${progress}%)`}
        value={progress}
        color="positive"
        size="medium"
      />

      <ProgressBar
        label="Circular progress"
        value={progress}
        variant="circular"
        color="information"
        size="large"
      />
    </Box>
  );
}
```
