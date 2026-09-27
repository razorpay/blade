## Component Name

DatePicker

## Description

DatePicker is a component for selecting dates or date ranges with an intuitive calendar interface. It supports single date selection or date range selection modes, with features such as date constraints, presets for quick selection, and validation states. Users can also type dates directly into the input field with automatic formatting and validation. The component also offers a FilterChipDatePicker variant for use in filtering interfaces, making it versatile for various date selection scenarios.

## Important Constraints

- Range DatePicker (`selectionType="range"`) only supports `pickerType="day"` - other picker types like "month" or "year" cannot be used with range selection

## TypeScript Types

The following types represent the props that the DatePicker component and its variants accept. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Selection types for DatePicker
 */
type DateSelectionType = 'single' | 'range';

/**
 * Type for single date value
 */
type DateValue = Date | null;

/**
 * Type for date range value
 */
type DatesRangeValue = [DateValue, DateValue];

/**
 * Picker view type
 */
type PickerType = 'day' | 'month' | 'year';

/**
 * Calendar level used in navigation callbacks
 */
type Level = 'month' | 'year' | 'decade';

/**
 * Props of the DatePicker component.
 * Pass `selectionType` as the generic: `DatePickerProps<'single'>` or `DatePickerProps<'range'>`.
 */
type DatePickerProps<Type extends DateSelectionType> = {
  /**
   * Sets the selection mode of the calendar
   * @default 'single'
   */
  selectionType?: Type;

  /**
   * Selected value (controlled)
   */
  value?: Type extends 'single' ? DateValue : DatesRangeValue;

  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: Type extends 'single' ? DateValue : DatesRangeValue;

  /**
   * Callback which fires when the selected value changes
   */
  onChange?: (value: Type extends 'single' ? DateValue : DatesRangeValue) => void;

  /**
   * Callback which fires when apply button is clicked
   */
  onApply?: (value: Type extends 'single' ? DateValue : DatesRangeValue) => void;

  /**
   * Callback which fires when a month is selected
   */
  onMonthSelect?: (date: Date) => void;

  /**
   * Callback which fires when a year is selected
   */
  onYearSelect?: (date: Date) => void;

  /**
   * Sets the picker type
   * @default 'day'
   */
  picker?: PickerType;

  /**
   * Sets the default picker type
   */
  defaultPicker?: PickerType;

  /**
   * Callback which fires when picker type changes
   */
  onPickerChange?: (picker: PickerType) => void;

  /**
   * Controlled month that the calendar renders, independent of the selected `value`.
   * When you control it, also handle `onVisibleMonthChange`.
   */
  visibleMonth?: Date;

  /**
   * Uncontrolled variant of `visibleMonth`. Sets the initial month that the calendar renders.
   */
  defaultVisibleMonth?: Date;

  /**
   * Callback which fires when the rendered month changes
   */
  onVisibleMonthChange?: (date: Date) => void;

  /**
   * Controlled isOpen state
   */
  isOpen?: boolean;

  /**
   * Uncontrolled isOpen state
   */
  defaultIsOpen?: boolean;

  /**
   * Callback which fires when isOpen state changes
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;

  /**
   * Presets for quick selection
   */
  presets?: Array<{
    /**
     * Label for the preset
     */
    label: string;
    /**
     * Function that returns a date range based on current date
     */
    value: (date: Date) => DatesRangeValue;
  }>;

  /**
   * Sets the first day of the week in the calendar (0 = Sunday, 1 = Monday, etc.)
   * @default 1
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Sets the minimum date that can be selected
   */
  minDate?: Date;

  /**
   * Sets the maximum date that can be selected
   */
  maxDate?: Date;

  /**
   * Disables dates that do not pass the function
   */
  excludeDate?: (date: Date) => boolean;

  /**
   * Lets the user select a single date as range. Applies only when selectionType is 'range'
   * @default false
   */
  allowSingleDateInRange?: boolean;

  /**
   * Callback which fires when the next button is clicked
   */
  onNext?: ({ date, type }: { date: Date; type: Level }) => void;

  /**
   * Callback which fires when the previous button is clicked
   */
  onPrevious?: ({ date, type }: { date: Date; type: Level }) => void;

  /**
   * Whether to show the footer with apply/cancel buttons
   * @default true
   */
  showFooterActions?: boolean;

  /**
   * Custom React element to render in the footer above/side of action buttons
   */
  footer?: React.ReactElement;

  /**
   * Overrides the calendar popup header title (for i18n)
   */
  headerLabel?: string;

  /**
   * Overrides the Apply button label in the calendar footer
   * @default 'Apply'
   */
  applyLabel?: string;

  /**
   * Overrides the Cancel button label in the calendar footer
   * @default 'Cancel'
   */
  cancelLabel?: string;

  /**
   * Controls how the selected date is displayed in the input field.
   * - `compact`: Shows only the preset label (e.g., "Last 7 days") instead of the actual dates.
   * - `default`: Shows the actual date values in the input field.
   * @default 'default'
   */
  displayFormat?: 'compact' | 'default';

  /**
   * Sets the date format to be displayed in the input field
   * @default 'DD/MM/YYYY' ('MMMM' when picker is 'month', 'YYYY' when picker is 'year')
   */
  format?: 'DD/MM/YYYY' | 'MMM' | 'MMMM' | 'YYYY';

  /**
   * Placeholder text for the input when no date is selected
   */
  inputPlaceHolder?: string;

  /**
   * Label for the input. Range selection can have separate start and end labels
   */
  label?: Type extends 'single' ? string : string | { start: string; end?: string };

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;

  /**
   * Position of the label
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';

  /**
   * Element to render after the label (e.g. a Tooltip trigger)
   */
  labelSuffix?: React.ReactNode;

  /**
   * Element to render at the trailing end of the label row
   */
  labelTrailing?: React.ReactNode;

  /**
   * Name attribute of the input elements, for form submission
   */
  name?: Type extends 'single' ? string : { start: string; end?: string };

  /**
   * Input size
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Whether the input is disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the input is required
   */
  isRequired?: boolean;

  /**
   * Whether to display the necessity indicator
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Auto focus the input on mount
   */
  autoFocus?: boolean;

  /**
   * Help text to display below the input
   */
  helpText?: Type extends 'single' ? string : string | { start: string; end?: string };

  /**
   * Error text to display when validationState is 'error'
   */
  errorText?: Type extends 'single' ? string : string | { start: string; end?: string };

  /**
   * Success text to display when validationState is 'success'
   */
  successText?: Type extends 'single' ? string : string | { start: string; end?: string };

  /**
   * Validation state of the input
   * @default 'none'
   */
  validationState?: 'error' | 'success' | 'none';

  /**
   * Position of the validation text
   * @default 'outside'
   */
  validationTextPlacement?: 'outside' | 'inside';

  /**
   * Shows a clear (cross) button in the input field
   */
  showClearButton?: boolean;

  /**
   * Callback fired when the clear button is clicked. Used when `showClearButton` is `true`
   */
  onClearButtonClick?: () => void;
};

/**
 * Props for FilterChipDatePicker component
 */
type FilterChipDatePickerProps = Omit<DatePickerProps<'single' | 'range'>, 'label'> & {
  /**
   * Label for the filter chip
   */
  label: string;

  /**
   * Callback when clear button is clicked. Clearing also fires `onChange` with an empty value.
   * The clear button shows by default. Pass `showClearButton={false}` to hide it.
   */
  onClearButtonClick?: () => void;
};
```

## Usage Guidelines

**Do**

- Use `DatePicker` for date selection with a calendar interface — supports single date and date range modes.
- Use `presets` prop with range selection to offer quick options like "Last 7 days", "This month".
- Use `minDate`/`maxDate` to constrain selectable dates to valid ranges.
- Use `excludeDate` function to disable specific dates (holidays, unavailable slots).
- Use object syntax for `label` and `name` in range mode: `label={{ start: 'From', end: 'To' }}`.
- The component auto-converts to BottomSheet on mobile — no manual handling needed.

**Don't**

- Don't use `picker="month"` or `picker="year"` with `selectionType="range"` — range only supports day-level selection.
- Don't combine date and time selection in one component — use `DatePicker` + `TimePicker` separately.
- Don't use `presets` with single date selection — presets are designed for range mode only.
- Don't forget to handle state updates in controlled mode — `onChange` won't auto-update the value.
- Don't use a generic `TextInput` for date entry — `DatePicker` provides calendar UI, validation, and formatting.

## Examples

### Single Date Selection

This example demonstrates a comprehensive single date picker with validation, constraints, and date exclusion.

```tsx
import React, { useState } from 'react';
import { DatePicker, Box, Text } from '@razorpay/blade/components';
import dayjs from 'dayjs';

const SingleDatePickerExample = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Standard Configuration
        </Text>
        <DatePicker
          selectionType="single"
          label="Event date"
          labelPosition="left" // Left position for label
          size="medium"
          value={date}
          onChange={setDate}
          necessityIndicator="required"
          isRequired
          helpText="Choose a date for the event"
          // Date constraints
          minDate={dayjs().subtract(1, 'month').toDate()}
          maxDate={dayjs().add(1, 'month').toDate()}
          // Weekend exclusion
          excludeDate={(date) => {
            const day = dayjs(date).day();
            return day === 0 || day === 6; // Exclude weekends
          }}
        />

        <Text size="small" marginTop="spacing.2">
          Selected: {date ? dayjs(date).format('DD MMM YYYY') : 'None'}
        </Text>
      </Box>
    </Box>
  );
};

export default SingleDatePickerExample;
```

### Size Variants and Controlled State

This example shows different size variants of the DatePicker (small, medium, large) and how to control the DatePicker's open state programmatically.

```tsx
import React, { useState } from 'react';
import { DatePicker, Box, Text, Button } from '@razorpay/blade/components';
import dayjs from 'dayjs';

const SizeVariantsExample = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [disabledDate, setDisabledDate] = useState<Date | null>(
    dayjs().subtract(1, 'week').toDate(),
  );
  const [isSingleOpen, setIsSingleOpen] = useState(false);

  return (
    <Box>
      <Text weight="semibold" marginBottom="spacing.3">
        Size Variants, Controlled DatePicker and showFooterActions as false
      </Text>
      <Box display="flex" gap="spacing.4" alignItems="flex-start">
        <DatePicker
          selectionType="single"
          label="Small"
          size="medium"
          value={date}
          onChange={setDate}
          isOpen={isSingleOpen}
          onOpenChange={({ isOpen }) => setIsSingleOpen(isOpen)}
          showFooterActions={false}
          footer={
            <Text size="small" color="surface.text.gray.muted">
              This section only displays records from the last 45 days. For earlier data, please
              download a report from the Reports section.
            </Text>
          }
        />

        <DatePicker
          selectionType="single"
          label="Large (Disabled)"
          size="large"
          isDisabled
          value={disabledDate}
        />
      </Box>

      <Box display="flex" gap="spacing.4" marginTop="spacing.3">
        <Button size="small" variant="secondary" onClick={() => setIsSingleOpen(!isSingleOpen)}>
          {isSingleOpen ? 'Close Calendar' : 'Open Calendar'}
        </Button>

        <Button
          size="small"
          variant="secondary"
          onClick={() => setDate(dayjs().add(1, 'week').toDate())}
        >
          Set to Next Week
        </Button>
      </Box>
    </Box>
  );
};

export default SizeVariantsExample;
```

### DatePicker with Clear Button

This example demonstrates the `showClearButton` prop which renders a clear icon button in the input field.

```tsx
import React, { useState } from 'react';
import { DatePicker, Box, Text } from '@razorpay/blade/components';
import dayjs from 'dayjs';

const ClearButtonExample = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Box>
      <Text weight="semibold" marginBottom="spacing.3">
        DatePicker with Clear Button
      </Text>
      <DatePicker
        selectionType="single"
        label="Select date"
        value={date}
        onChange={setDate}
        showClearButton
        onClearButtonClick={() => console.log('Date cleared!')}
      />

      <Text size="small" marginTop="spacing.2">
        Selected: {date ? dayjs(date).format('DD MMM YYYY') : 'None'}
      </Text>
    </Box>
  );
};

export default ClearButtonExample;
```

### Month and Year Pickers

This example demonstrates alternative picker views for selecting months and years instead of specific dates.

```tsx
import React, { useState } from 'react';
import { DatePicker, Box, Text } from '@razorpay/blade/components';
import dayjs from 'dayjs';

const MonthYearPickerExample = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Box>
      <Text weight="semibold" marginBottom="spacing.3">
        Month and Year Pickers
      </Text>
      <Box display="flex" gap="spacing.6">
        <DatePicker
          selectionType="single"
          label="Month"
          picker="month"
          value={date}
          onChange={(selectedDate) => {
            console.log('Selected month:', dayjs(selectedDate).format('MMMM YYYY'));
            setDate(selectedDate);
          }}
        />

        <DatePicker
          selectionType="single"
          label="Year"
          picker="year"
          value={date}
          onChange={(selectedDate) => {
            console.log('Selected year:', dayjs(selectedDate).format('YYYY'));
            setDate(selectedDate);
          }}
        />
      </Box>

      <Text size="small" marginTop="spacing.3">
        Selected: {date ? dayjs(date).format('MMMM YYYY') : 'None'}
      </Text>
    </Box>
  );
};

export default MonthYearPickerExample;
```

### Date Range Selection

This example demonstrates date range selection with presets and validation.

```tsx
import React, { useState } from 'react';
import { DatePicker, Box, Text, Button } from '@razorpay/blade/components';
import dayjs from 'dayjs';

const DateRangeExample = () => {
  // Date range with validation
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(7, 'days').toDate(),
    new Date(),
  ]);
  const [hasRangeError, setHasRangeError] = useState(false);
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  // Define preset options for quick selection
  const datePresets = [
    {
      label: 'Last 7 days',
      value: (today: Date): [Date, Date] => {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return [sevenDaysAgo, today];
      },
    },
    {
      label: 'Last 30 days',
      value: (today: Date): [Date, Date] => {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return [thirtyDaysAgo, today];
      },
    },
    {
      label: 'This month',
      value: (today: Date): [Date, Date] => {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return [firstDayOfMonth, today];
      },
    },
  ];

  // Handle range change with validation
  const handleRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);

    // Validate: range cannot be more than 7 days
    if (dates[0] && dates[1]) {
      const daysDiff = dayjs(dates[1]).diff(dates[0], 'day');
      setHasRangeError(daysDiff > 7);
    } else {
      setHasRangeError(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Comprehensive date range picker */}
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Complete Range DatePicker
        </Text>
        <DatePicker
          selectionType="range"
          label={{ start: 'Start Date', end: 'End Date' }}
          value={dateRange}
          onChange={handleRangeChange}
          validationState={hasRangeError ? 'error' : 'none'}
          errorText={{
            start: 'Range cannot exceed 7 days',
            end: 'Please select a shorter range',
          }}
          helpText={{ start: 'Select a date range or use preset options' }}
          presets={datePresets}
          isOpen={isRangeOpen}
          onOpenChange={({ isOpen }) => setIsRangeOpen(isOpen)}
          isRequired
          necessityIndicator="required"
          size="medium"
        />

        <Text
          size="small"
          marginTop="spacing.3"
          color={hasRangeError ? 'feedback.text.negative.intense' : undefined}
        >
          Selected: {dateRange[0] ? dayjs(dateRange[0]).format('DD MMM YYYY') : 'None'} -
          {dateRange[1] ? dayjs(dateRange[1]).format('DD MMM YYYY') : 'None'}
          {hasRangeError && ' (Error: Range too long)'}
        </Text>

        <Box display="flex" gap="spacing.4" marginTop="spacing.3">
          <Button size="small" variant="secondary" onClick={() => setIsRangeOpen(!isRangeOpen)}>
            {isRangeOpen ? 'Close Calendar' : 'Open Calendar'}
          </Button>

          <Button
            size="small"
            variant="secondary"
            onClick={() =>
              setDateRange([dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()])
            }
          >
            Set to Current Month
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DateRangeExample;
```

### Presets with Compact Display Format

The `displayFormat="compact"` prop changes how the DatePicker input displays selected values when using presets:

- **When closed (not focused):** If a preset is selected, the input shows the preset label (e.g., "Last 7 days") instead of the actual date range
- **When focused or picker is open:** The input switches to show the actual date values in DD-MM-YY format, allowing users to see and edit the dates
- **Custom date selection:** When the user selects custom dates that don't match any preset, the input always shows the date values regardless of focus state

This is useful when the preset label provides more context than showing raw dates (e.g., "Last quarter" is more meaningful than "01-10-2024 - 31-12-2024").

```tsx
import React, { useState } from 'react';
import { DatePicker, Box, Text } from '@razorpay/blade/components';
import dayjs from 'dayjs';

const PresetsCompactDisplayExample = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(7, 'days').toDate(),
    new Date(),
  ]);

  // Define presets
  const datePresets = [
    {
      label: 'Today',
      value: (today: Date): [Date, Date] => [today, today],
    },
    {
      label: 'Yesterday',
      value: (today: Date): [Date, Date] => {
        const yesterday = dayjs(today).subtract(1, 'day').toDate();
        return [yesterday, yesterday];
      },
    },
    {
      label: 'Last 7 days',
      value: (today: Date): [Date, Date] => [dayjs(today).subtract(7, 'days').toDate(), today],
    },
    {
      label: 'Last 30 days',
      value: (today: Date): [Date, Date] => [dayjs(today).subtract(30, 'days').toDate(), today],
    }
  ];

  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Presets with Compact Display Format
        </Text>
        <DatePicker
          selectionType="range"
          label={{ start: 'Start Date', end: 'End Date' }}
          value={dateRange}
          onChange={setDateRange}
          presets={datePresets}
          displayFormat="compact"
          helpText={{ start: 'Select a preset or choose custom dates' }}
          size="medium"
        />

        <Text size="small" marginTop="spacing.3">
          {/* With displayFormat="compact", input shows preset label (e.g., "Last 7 days") instead of dates */}
          Selected: {dateRange[0] ? dayjs(dateRange[0]).format('DD MMM YYYY') : 'None'} -{' '}
          {dateRange[1] ? dayjs(dateRange[1]).format('DD MMM YYYY') : 'None'}
        </Text>
      </Box>
    </Box>
  );
};

export default PresetsCompactDisplayExample;
```

### FilterChipDatePicker

This example demonstrates the FilterChipDatePicker variant for filters and data selection interfaces.

**Note:** When using `onClearButtonClick`, the clear behavior differs based on selection type:
- `selectionType="single"` → clears to `null`
- `selectionType="range"` → clears to `[null, null]`

```tsx
import React, { useState } from 'react';
import { FilterChipDatePicker, Box, Text } from '@razorpay/blade/components';
import dayjs from 'dayjs';

const FilterChipDatePickerExample = () => {
  // FilterChip states
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // Common presets
  const datePresets = [
    {
      label: 'Last 7 days',
      value: (date: Date): [Date, Date] => [dayjs(date).subtract(7, 'days').toDate(), date],
    },
    {
      label: 'This month',
      value: (date: Date): [Date, Date] => [
        dayjs(date).startOf('month').toDate(),
        dayjs(date).endOf('month').toDate(),
      ],
    },
  ];

  return (
    <Box>
      <Text weight="semibold" marginBottom="spacing.3">
        FilterChipDatePicker Variants
      </Text>
      <Box display="flex" gap="spacing.4" alignItems="flex-start">
        <Box>
          <Text size="small" marginBottom="spacing.2">
            Single Selection
          </Text>
          <FilterChipDatePicker
            label="Created Date"
            selectionType="single"
            value={singleDate}
            onChange={(date) => setSingleDate(date as Date)}
            onClearButtonClick={() => setSingleDate(null)}
          />
        </Box>

        <Box>
          <Text size="small" marginBottom="spacing.2">
            Range Selection with Presets
          </Text>
          <FilterChipDatePicker
            label="Date Range"
            selectionType="range"
            value={dateRange}
            onChange={(date) => setDateRange(date as [Date | null, Date | null])}
            presets={datePresets}
            onClearButtonClick={() => setDateRange([null, null])}
          />
        </Box>
      </Box>

      <Box marginTop="spacing.3">
        <Text size="small">
          Single Date: {singleDate ? dayjs(singleDate).format('DD MMM YYYY') : 'None'}
        </Text>
        <Text size="small">
          Date Range: {dateRange[0] ? dayjs(dateRange[0]).format('DD MMM YYYY') : 'None'} -
          {dateRange[1] ? dayjs(dateRange[1]).format('DD MMM YYYY') : 'None'}
        </Text>
      </Box>
    </Box>
  );
};

export default FilterChipDatePickerExample;
```

### Localization

This example demonstrates how to use the DatePicker with different locales for international applications.

```tsx
import React from 'react';
import { DatePicker, Box, Text } from '@razorpay/blade/components';
import { I18nProvider } from '@razorpay/i18nify-react';

const LocalizationExample = () => {
  return (
    <Box>
      <Text weight="semibold" marginBottom="spacing.3">
        DatePicker Localization
      </Text>
      <Box display="flex" gap="spacing.6" flexWrap="wrap">
        {/* Hindi locale */}
        <Box width="250px">
          <Text size="small" marginBottom="spacing.2">
            Hindi
          </Text>
          <I18nProvider initData={{ locale: 'hi-IN' }}>
            <DatePicker selectionType="single" label="तारीख चुनें" size="medium" />
          </I18nProvider>
        </Box>

        {/* Malay locale */}
        <Box width="250px">
          <Text size="small" marginBottom="spacing.2">
            Malay
          </Text>
          <I18nProvider initData={{ locale: 'ms-MY' }}>
            <DatePicker selectionType="single" label="Pilih Tarikh" size="medium" />
          </I18nProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default LocalizationExample;
```
