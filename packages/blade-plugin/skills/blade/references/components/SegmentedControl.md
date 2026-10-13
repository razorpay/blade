# SegmentedControl

## Component Name

SegmentedControl, SegmentedControlItem

## Description

SegmentedControl lets the user select one value from a small set of options shown side by side. It is a form field: it supports a label, help text, error text, and required state, like `RadioGroup`. Each option is a `SegmentedControlItem` with text, an icon and text, or only an icon. It works controlled or uncontrolled.

## Usage Guidelines

- Use SegmentedControl for 2 to 5 short options, for example a time period or a view mode.
- Use `Tabs` when each option shows a different content panel. SegmentedControl only selects a value.
- Use `RadioGroup` or `Dropdown` when there are many options or labels are long.
- Give a `label` or an `accessibilityLabel`. Icon-only items must have an `accessibilityLabel`.

## TypeScript Types

```typescript
type SegmentedControlProps = (
  | {
      /**
       * Label of the segmented control
       */
      label: string;
      /**
       * Accessibility label for the segmented control
       */
      accessibilityLabel?: string;
    }
  | {
      label?: undefined;
      /**
       * Accessibility label. Required when there is no visible label.
       */
      accessibilityLabel: string;
    }
) & {
  /**
   * SegmentedControlItem components
   */
  children: React.ReactNode;
  /**
   * The selected value (controlled)
   */
  value?: string;
  /**
   * The default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Called when the selected value changes
   */
  onChange?: ({ name, value }: { name: string | undefined; value: string }) => void;
  /**
   * Size of the segmented control
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Disables all items
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Name for form identification
   */
  name?: string;
  /**
   * Position of the label
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Help text below the control
   */
  helpText?: string;
  /**
   * Error text shown when `validationState` is 'error'
   */
  errorText?: string;
  /**
   * Validation state
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Necessity indicator after the label
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the required state
   * @default false
   */
  isRequired?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type SegmentedControlItemProps = (
  | {
      /**
       * Leading icon component
       */
      leading: React.ComponentType<any>;
      /**
       * Label of the item
       */
      children: React.ReactNode;
      accessibilityLabel?: string;
    }
  | {
      leading: React.ComponentType<any>;
      /**
       * Omit for icon-only items
       */
      children?: undefined;
      /**
       * Required for icon-only items
       */
      accessibilityLabel: string;
    }
  | {
      leading?: undefined;
      children: React.ReactNode;
      accessibilityLabel?: string;
    }
) & {
  /**
   * Unique value of the item
   */
  value: string;
  /**
   * Disables this item
   * @default false
   */
  isDisabled?: boolean;
} & TestID &
  DataAnalyticsAttribute;
```

## Examples

### Controlled SegmentedControl with Validation

```tsx
import React, { useState } from 'react';
import { SegmentedControl, SegmentedControlItem, Box, Text } from '@razorpay/blade/components';

function TimePeriodExample(): React.ReactElement {
  const [period, setPeriod] = useState('');

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <SegmentedControl
        label="Time Period"
        name="timePeriod"
        value={period}
        onChange={({ value }) => setPeriod(value)}
        necessityIndicator="required"
        isRequired
        helpText="Select a period for the report"
        validationState={period ? 'none' : 'error'}
        errorText="Select a time period"
      >
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly" isDisabled>
          Monthly
        </SegmentedControlItem>
      </SegmentedControl>
      <Text>Selected: {period || 'none'}</Text>
    </Box>
  );
}

export default TimePeriodExample;
```

### Sizes and Icons

```tsx
import React from 'react';
import {
  SegmentedControl,
  SegmentedControlItem,
  Box,
  CalendarIcon,
  ClockIcon,
  ListIcon,
  LayoutIcon,
} from '@razorpay/blade/components';

function SegmentedControlIconsExample(): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <SegmentedControl size="small" defaultValue="day" accessibilityLabel="Time view">
        <SegmentedControlItem value="day" leading={CalendarIcon}>
          Day
        </SegmentedControlItem>
        <SegmentedControlItem value="hour" leading={ClockIcon}>
          Hour
        </SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl size="large" defaultValue="list" accessibilityLabel="Layout">
        <SegmentedControlItem value="list" leading={ListIcon} accessibilityLabel="List view" />
        <SegmentedControlItem value="grid" leading={LayoutIcon} accessibilityLabel="Grid view" />
      </SegmentedControl>
    </Box>
  );
}

export default SegmentedControlIconsExample;
```
