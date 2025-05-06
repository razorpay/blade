## Component Name

DatePicker

## Description

DatePicker is a component for selecting dates or date ranges with an intuitive calendar interface. It supports single date selection or date range selection modes, with features such as date constraints, presets for quick selection, and validation states. The component also offers a FilterChipDatePicker variant for use in filtering interfaces, making it versatile for various date selection scenarios.

## TypeScript Types

The following types represent the props that the DatePicker component and its variants accept. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Selection types for DatePicker
 */
type DatePickerSelectionType = 'single' | 'range';

/**
 * Type for single date value
 */
type DateValue = Date | null;

/**
 * Type for date range value
 */
type DatesRangeValue = [DateValue, DateValue];

/**
 * Common props for both single and range DatePicker
 */
type DatePickerCommonProps<T extends DatePickerSelectionType> = {
  /**
   * Selection type for the date picker
   */
  selectionType: T;

  /**
   * Callback fired when date selection changes
   */
  onChange?: (date: T extends 'single' ? DateValue : DatesRangeValue) => void;

  /**
   * Whether the calendar is open
   */
  isOpen?: boolean;

  /**
   * Default open state (uncontrolled)
   */
  defaultIsOpen?: boolean;

  /**
   * Callback fired when the open state changes
   */
  onOpenChange?: (e: { isOpen: boolean }) => void;

  /**
   * Presets for quick selection (only applicable for range selection)
   */
  presets?: Array<{
    /**
     * Display label for the preset
     */
    label: string;
    /**
     * Function that returns a date range based on current date
     */
    value: (currentDate: Date) => [Date, Date];
  }>;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Function to determine if a date should be excluded from selection
   */
  excludeDate?: (date: Date) => boolean;

  /**
   * Type of picker view (default: 'date')
   */
  picker?: 'date' | 'month' | 'year';

  /**
   * Default picker view (uncontrolled)
   */
  defaultPicker?: 'date' | 'month' | 'year';

  /**
   * Callback when picker view changes
   */
  onPickerChange?: (picker: 'date' | 'month' | 'year') => void;

  /**
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Allow selecting a single date in range mode
   */
  allowSingleDateInRange?: boolean;

  /**
   * Locale for date formatting and calendar text
   */
  locale?: string;

  /**
   * Events for navigation
   */
  onNext?: () => void;
  onNextDecade?: () => void;
  onNextMonth?: () => void;
  onNextYear?: () => void;
  onPrevious?: () => void;
  onPreviousDecade?: () => void;
  onPreviousMonth?: () => void;
  onPreviousYear?: () => void;
  onMonthSelect?: (month: Date) => void;
  onYearSelect?: (year: Date) => void;
} & StyledPropsBlade &
  TestID;

/**
 * Props for single selection DatePicker
 */
type SingleDatePickerProps = DatePickerCommonProps<'single'> & {
  /**
   * Selected date (controlled)
   */
  value?: DateValue;

  /**
   * Default selected date (uncontrolled)
   */
  defaultValue?: DateValue;

  /**
   * Label for the input
   */
  label?: string;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;

  /**
   * Input size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether the input is disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the input is required
   */
  isRequired?: boolean;

  /**
   * Auto focus the input on mount
   */
  autoFocus?: boolean;

  /**
   * Position of the label
   */
  labelPosition?: 'top' | 'left';

  /**
   * Whether to display the necessity indicator
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Help text to display below the input
   */
  helpText?: string;

  /**
   * Error text to display when validation state is 'error'
   */
  errorText?: string;

  /**
   * Success text to display when validation state is 'success'
   */
  successText?: string;

  /**
   * Validation state of the input
   */
  validationState?: 'error' | 'success' | 'none';

  /**
   * Name for the input for form submission
   */
  name?: string;
};

/**
 * Props for range selection DatePicker
 */
type RangeDatePickerProps = DatePickerCommonProps<'range'> & {
  /**
   * Selected date range (controlled)
   */
  value?: DatesRangeValue;

  /**
   * Default selected date range (uncontrolled)
   */
  defaultValue?: DatesRangeValue;

  /**
   * Labels for the start and end date inputs
   */
  label?: { start: string; end?: string };

  /**
   * Accessibility labels for screen readers
   */
  accessibilityLabel?: { start: string; end?: string };

  /**
   * Input size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether the inputs are disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the inputs are required
   */
  isRequired?: boolean;

  /**
   * Auto focus the input on mount
   */
  autoFocus?: boolean;

  /**
   * Position of the label
   */
  labelPosition?: 'top' | 'left';

  /**
   * Whether to display the necessity indicator
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Help text to display below the inputs
   */
  helpText?: string | { start: string; end?: string };

  /**
   * Error text to display when validation state is 'error'
   */
  errorText?: string | { start: string; end?: string };

  /**
   * Success text to display when validation state is 'success'
   */
  successText?: string | { start: string; end?: string };

  /**
   * Validation state of the inputs
   */
  validationState?: 'error' | 'success' | 'none';

  /**
   * Names for the inputs for form submission
   */
  name?: { start: string; end?: string };
};

/**
 * Union type for DatePicker props based on selection type
 */
type DatePickerProps<T extends DatePickerSelectionType = 'single'> = T extends 'single'
  ? SingleDatePickerProps
  : RangeDatePickerProps;

/**
 * Props for FilterChipDatePicker component
 */
type FilterChipDatePickerProps<T extends DatePickerSelectionType = 'single'> = Omit<
  DatePickerProps<T>,
  'label' | 'accessibilityLabel' | 'size' | 'labelPosition'
> & {
  /**
   * Label for the filter chip
   */
  label: string;

  /**
   * Callback when clear button is clicked
   */
  onClearButtonClick?: () => void;
};
```

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
        Size Variants and Controlled DatePicker
      </Text>
      <Box display="flex" gap="spacing.4" alignItems="flex-start">
        <DatePicker
          selectionType="single"
          label="Small"
          size="small"
          value={date}
          onChange={setDate}
          isOpen={isSingleOpen}
          onOpenChange={({ isOpen }) => setIsSingleOpen(isOpen)}
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
      value: (date: Date) => [dayjs(date).subtract(7, 'days').toDate(), date],
    },
    {
      label: 'Last 30 days',
      value: (date: Date) => [dayjs(date).subtract(30, 'days').toDate(), date],
    },
    {
      label: 'This month',
      value: (date: Date) => [
        dayjs(date).startOf('month').toDate(),
        dayjs(date).endOf('month').toDate(),
      ],
    },
    {
      label: 'Last month',
      value: (date: Date) => [
        dayjs(date).subtract(1, 'month').startOf('month').toDate(),
        dayjs(date).subtract(1, 'month').endOf('month').toDate(),
      ],
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
          helpText="Select a date range or use preset options"
          presets={datePresets}
          isOpen={isRangeOpen}
          onOpenChange={({ isOpen }) => setIsRangeOpen(isOpen)}
          isRequired
          necessityIndicator="required"
          size="medium"
        />

        <Text size="small" marginTop="spacing.3" color={hasRangeError ? 'text.error' : undefined}>
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

### FilterChipDatePicker

This example demonstrates the FilterChipDatePicker variant for filters and data selection interfaces.

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
      value: (date: Date) => [dayjs(date).subtract(7, 'days').toDate(), date],
    },
    {
      label: 'This month',
      value: (date: Date) => [
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
            <DatePicker selectionType="single" label="तारीख चुनें" size="small" />
          </I18nProvider>
        </Box>

        {/* Malay locale */}
        <Box width="250px">
          <Text size="small" marginBottom="spacing.2">
            Malay
          </Text>
          <I18nProvider initData={{ locale: 'ms-MY' }}>
            <DatePicker selectionType="single" label="Pilih Tarikh" size="small" />
          </I18nProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default LocalizationExample;
```
