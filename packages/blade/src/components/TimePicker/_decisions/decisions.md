# TimePicker

The TimePicker component allows users to select a specific time from a customizable time interface. It supports both 12-hour and 24-hour formats, provides an intuitive picker interface, and automatically adapts to mobile devices with a BottomSheet experience.

<img src="./timepicker-thumbnail.png" width="380" />

## Design

- [Figma - TimePicker](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=110199-7268&p=f&t=aT7zMPeFO88p0TdZ-0)

## Anatomy

<img src="./timepicker-anatomy.png" width="60%" alt="TimePicker Anatomy" />

The TimePicker consists of:

- **Input Field**: Text input displaying the current time value
- **Dropdown Trigger**: Click/focus area to open time selection
- **Time Columns**: Hours, Minutes, and Period (AM/PM) selection areas
- **Action Buttons**: Apply/Cancel buttons (when `showFooterActions={true}`)

## API

```jsx
import { TimePicker } from '@razorpay/blade/components';

<TimePicker
  label="Select time"
  value={new Date('2024-01-01T14:30:00')}
  onChange={({ value }) => {
    console.log('time selected', value);
  }}
/>;
```

### Props

#### TimePicker

```typescript
type InputProps = Pick<
  BaseInputProps,
  | 'labelPosition'
  | 'validationState'
  | 'errorText'
  | 'successText'
  | 'helpText'
  | 'necessityIndicator'
  | 'isRequired'
  | 'isDisabled'
  | 'onFocus'
  | 'onBlur'
  | 'size'
  | 'autoFocus'
  | 'name'
  | 'placeholder'
>;

type TimePickerValue = {
  value: Date;
  // Future extensibility - can add more properties here
};

type TimePickerProps = InputProps & {
  /**
   * Label for the time input
   */
  label?: string;

  /**
   * Current time value as Date object (for controlled usage)
   */
  value?: Date;

  /**
   * Default time value as Date object (for uncontrolled usage)
   */
  defaultValue?: Date;

  /**
   * Callback fired when time value changes
   * @param timeValue - Object containing the selected time and future extensible properties
   */
  onChange?: ({ value }: TimePickerValue) => void;

  /**
   * Time format for display
   * @default "12h"
   *
   * Supports both 12h and 24h formats built with React Aria
   */
  timeFormat?: '12h' | '24h';

  /**
   * Step interval for minutes
   * @default 1
   * @example 15 // allows 00, 15, 30, 45
   */
  minuteStep?: 1 | 5 | 15 | 30;

  /**
   * Controls dropdown open state (for controlled usage)
   * @default false
   */
  isOpen?: boolean;

  /**
   * Default open state (for uncontrolled usage)
   * @default false
   */
  defaultIsOpen?: boolean;

  /**
   * Callback fired when dropdown open state changes
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;

  /**
   * Callback fired when user applies time selection
   * @param timeValue - Object containing the confirmed time value
   */
  onApply?: ({ value }: TimePickerValue) => void;

  /**
   * Whether to show the apply/cancel buttons
   * @default true
   *
   * When false:
   * - On blur selected time will get automatically apply and close the dropdown
   * - Pressing Enter immediately applies the current selection and closes
   * - More streamlined interaction experience
   */
  showFooterActions?: boolean;

  /**
   * Test ID for testing purposes
   */
  testID?: string;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
};
```

<details>

<summary>Alternative APIs</summary>

## 1. Composition-based API (Not Recommended)

```jsx
<TimePicker isOpen={isOpen} onOpenChange={setIsOpen}>
  <TimePickerTrigger>
    <TextInput label="Time" value={formatTime(selectedTime)} />
  </TimePickerTrigger>
  <TimePickerDropdown>
    <TimePickerHours />
    <TimePickerMinutes />
    <TimePickerPeriod />
    <TimePickerActions />
  </TimePickerDropdown>
</TimePicker>
```

**Pros:**

- High flexibility for customization
- Clear separation of concerns
- Easy to extend with additional components

**Cons:**

- More complex API for simple use cases
- Harder to ensure consistent UX across implementations
- Mobile bottomsheet behavior harder to implement
- State management becomes consumer responsibility

## 2. Multiple Component API (Not Recommended)

```jsx
// Separate components for different use cases
<TimeInput />           // Simple input only
<TimeSelector />        // Dropdown only
<TimePicker />          // Combined input + dropdown
```

**Pros:**

- Clear component boundaries
- Can reuse TimeSelector in other contexts

**Cons:**

- API fragmentation
- Inconsistent patterns compared to DatePicker
- More components to maintain

## 3. Native Input Wrapper (Not Recommended)

```jsx
<TimePicker
  native={true} // Uses HTML time input on web
  custom={false} // Falls back to custom picker
/>
```

**Pros:**

- Leverages native browser controls
- Consistent with OS patterns

**Cons:**

- Inconsistent UX across browsers/platforms
- Limited styling capabilities
- Different behavior on mobile vs desktop

### Conclusion

Given the issues with alternative approaches and the need for consistent UX across platforms, we should go with the `<TimePicker />` component approach, where we have total control over the UX/behaviour of the component & can automatically handle focus management, accessibility, mobile bottomsheet etc.

But still we could expose TimeSelector as a standalone component for advanced usecases.

</details>

## Examples

### Basic Usage

```jsx
<TimePicker
  label="Meeting time"
  value={new Date('2024-01-01T14:30:00')}
  onChange={({ value }) => console.log(value)}
/>
```

### 12-Hour Format

```jsx
<TimePicker
  label="Appointment time"
  timeFormat="12h"
  defaultValue={new Date('2024-01-01T14:30:00')}
  onChange={({ value }) => console.log(value)}
/>
```

### 24-Hour Format

```jsx
<TimePicker
  label="Appointment time"
  timeFormat="24h"
  defaultValue={new Date('2024-01-01T14:30:00')}
  onChange={({ value }) => console.log(value)}
/>
```

> **Note**: Both 12-hour and 24-hour formats are supported using React Aria. Use the `timeFormat` prop to specify the desired format.

### Time Range Support

TimePicker **does not support built-in range selection**. This design decision ensures:

- **Simpler API**: Single responsibility principle
- **Better UX**: Clear individual time selection
- **Flexibility**: Users can implement custom range validation
- **Consistency**: Aligns with DatePicker patterns

For time range scenarios, implement two separate TimePickers:

```jsx
function TimeRangeSelector() {
  const [startTime, setStartTime] = useState(new Date('2024-01-01T09:00:00'));
  const [endTime, setEndTime] = useState(new Date('2024-01-01T17:00:00'));

  const handleStartTimeChange = ({ value }) => {
    setStartTime(value);
    // Auto-adjust end time if it's before start time
    if (value >= endTime) {
      const newEndTime = new Date(value);
      // Handle edge case when start time is 23:30 or later
      // Add 1 hour but ensure we don't go beyond 23:59 on the same day
      const newHour = newEndTime.getHours() + 1;
      if (newHour >= 24) {
        // If adding 1 hour would go to next day, set to 23:59
        newEndTime.setHours(23, 59, 0, 0);
      } else {
        newEndTime.setHours(newHour);
      }
      setEndTime(newEndTime);
    }
  };

  return (
    <>
      <TimePicker label="Start time" value={startTime} onChange={handleStartTimeChange} />
      <TimePicker
        label="End time"
        value={endTime}
        onChange={({ value }) => setEndTime(value)}
        validationState={endTime <= startTime ? 'error' : 'none'}
        errorText="End time must be after start time"
      />
    </>
  );
}
```

> **Storybook Examples**: We will provide comprehensive Storybook examples showing time range implementation patterns with validation, auto-adjustment, and different use cases.

### Controlled State

```jsx
function ControlledTimePicker() {
  const [selectedTime, setSelectedTime] = useState(new Date('2024-01-01T10:30:00'));
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TimePicker
      label="Select time"
      value={selectedTime}
      isOpen={isOpen}
      showActions={true}
      onChange={({ value }) => setSelectedTime(value)}
      onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
      onApply={({ value }) => {
        console.log('User confirmed:', value);
        setIsOpen(false);
      }}
    />
  );
}
```

### Custom Step Intervals

```jsx
<TimePicker
  label="Timer interval"
  minuteStep={15} // Only 00, 15, 30, 45 minutes
  defaultValue={new Date('2024-01-01T12:00:00')}
  onChange={({ value }) => console.log('Selected:', value)}
/>
```

### Keyboard Navigation Example

```jsx
<TimePicker
  label="Meeting time"
  minuteStep={5}
  value={new Date('2024-01-01T14:30:00')}
  onChange={({ value }) => console.log('Selected:', value)}
  // Full keyboard support:
  // - Arrow keys in input: increment/decrement values
  // - Arrow keys in dropdown: navigate options
  // - Tab/Arrow Left/Right: switch columns
  // - Enter: select, Escape: cancel
/>
```

### Mobile UX

On mobile devices, the TimePicker automatically converts to a BottomSheet with the same time picker interface. Consumers do not need to handle anything manually for this transition.

<img src="./timepicker-mobile.png" width="200px" alt="Mobile TimePicker" />

## Time Value Standardization

**Date Object Approach:** All time values use JavaScript Date objects for consistency:

- Input/Output: Always Date objects
- Display: Adapts based on `timeFormat` prop (12h/24h)
- Internal processing: Uses Date methods for time manipulation

**Benefits:**

- Native JavaScript Date handling
- Timezone-aware when needed
- Easy integration with date libraries (dayjs, date-fns)
- Type safety with TypeScript
- Simplified state management and validation

## Keyboard Navigation

The TimePicker provides comprehensive keyboard support for enhanced accessibility and user experience:

### Input Field Focus

When the input field is focused:

- **Arrow Up/Down**: Increment/decrement time values like a digital input
  - Hours: Arrow up increases hour by 1, arrow down decreases by 1
  - Minutes: When cursor is on minutes, arrows change minute values

### Dropdown Focus

When the dropdown is open and focused:

- **Arrow Up/Down**: Navigate through time options in active column
- **Arrow Left/Right**: Switch between columns (Hours → Minutes → AM/PM)
- **Tab/Shift+Tab**: Navigate between columns
- **Enter**: Select the highlighted time value
- **Escape**: Close dropdown without selecting
- **Focus animations**: Visual indicators show which column and value is active
- **Auto-scroll**: Selected values automatically scroll into view
- **Smooth transitions**: Focus changes include subtle animations for better UX

### Example Keyboard Flow

**With Actions (showFooterActions={true} - default):**

```
1. Focus input → Arrow keys change time values directly
2. Click or Space → Opens dropdown with first column focused
3. Arrow Left/Right → Switch between Hour/Minute/Period columns
4. Arrow Up/Down → Navigate within active column
5. Enter → Select current value in active column
6. Navigate to Save button → Enter applies selection and closes
7. Escape → Cancel and close dropdown
```

**Without Actions (showActions={false} - streamlined):**

```
1. Focus input → Arrow keys change time values directly
2. Click or Space → Opens dropdown with first column focused
3. Arrow Left/Right → Switch between Hour/Minute/Period columns
4. Arrow Up/Down → Navigate within active column
5. Enter → Immediately apply current selection and close dropdown
6. On Blur → Immediately apply and close dropdown
7. Escape → Cancel and close dropdown
```

## Accessibility

Accessibility is comprehensively handled by React Aria,
We benefit from Adobe's accessibility expertise with built-in ARIA attributes, focus management, keyboard navigation, and screen reader support. React Aria provides industry-leading accessibility patterns out of the box.

## Future Integrations

### ListView Integration

TimePicker is designed to integrate seamlessly with ListView patterns for time-based filtering and data display.

## Open Questions

### Design Decisions

- **Input vs Dropdown Format**: Should the text input always show 12h format while the dropdown shows 24h/AM-PM format, or should both sync to the same format?
  ✅ Resolved - Both input and dropdown will sync to the same format based on `timeFormat` prop

- **Time Format Support**: Should we support both 12h and 24h formats from the initial release?
  ✅ Resolved - Starting with 12h format only. 24h format will be added once we upgrade to Mantine v8.

### Feature Scope

- How should we approach locale support?
- Do we need preset time options for common scenarios (Morning, Afternoon, etc.)?

## Time Format Decision

**Decision**: We support **both 12h and 24h formats** using React Aria.

**TimePicker Recent Update** :

- We know Mantine v8 upgrade is not straightforward as its major version upgrade(https://razorpay.slack.com/archives/C01H13RTF8V/p1753818366922869)

- Initially thought Mantine v6 TimeInput would work: even though it uses native `<input type="time">`, it seemed to bypass OS settings and always show 12h format. I verified this by switching my OS to 24h → MDN docs show native input should reflect OS, and indeed native input updated to 24h, but Mantine stayed in 12h :white_check_mark:

- However, after a laptop restart Mantine also switched to 24h :sweat_smile: and on mobile the behavior was inconsistent → so not reliable

- After further discussion, we agreed to lean towards either:

  - A custom implementation, or
  - A library that supports both date + time so we can migrate our DatePicker later

**Library Exploration**

❌ **Didn't work**:

- react-time-picker → limited styling, clunky AM/PM dropdown
- react-datetime → requires moment.js (legacy), heavy bundle
- Most others → React 18 only, poor mobile UX, or styling constraints

✅ **Top Pick: React Aria + React Stately**

- Headless → full UI control (same approach as our DatePicker)
- React 17 compatible → no upgrade pressure
- Supports both date + time
- Mobile-first → works with our BottomSheet pattern
- Segment-based → Hour | Minute | AM/PM as separate styled parts (no ugly dropdowns)
- Adobe-maintained, accessibility built-in

**Implementation**:

- The `timeFormat` prop is now available and supports both `'12h'` and `'24h'`
- TimePicker defaults to 12h format for backwards compatibility
- Full control over time format rendering and interaction
- Consistent behavior across all platforms and OS settings

**Benefits of React Aria Implementation**:

- **Reliability**: Consistent time format behavior regardless of OS settings
- **Flexibility**: Both 12h and 24h formats supported from day one
- **Accessibility**: Industry-leading accessibility patterns built-in
- **Future-proof**: Headless architecture allows easy customization
- **Mobile UX**: Better mobile experience with segment-based interaction

**References**:

- [Mantine v8 Upgrade Constraints](https://razorpay.slack.com/archives/C01H13RTF8V/p1753818366922869) - Technical reasons for not upgrading to Mantine v8 right now
- [TimePicker Discussion](https://razorpay.slack.com/archives/C01H13RTF8V/p1755606723861109) - TimePicker React Aria implementation discussion and POC results

## Integration with i18nify

We need to figure out how to integrate the time picker with i18nify,

```js
// Consumer will have to handle locale-specific time formatting
// Both 12h and 24h formats are supported with timeFormat prop
<TimePicker locale="my" />
```

## References

- [TimePicker - Mantine Upgrade Exploration](https://razorpay.slack.com/archives/C01H13RTF8V/p1753818366922869)

- [TimePicker - React Aria Implementation](https://razorpay.slack.com/archives/C01H13RTF8V/p1755606723861109)
  - We chose [React Aria](https://react-spectrum.adobe.com/react-aria/useTimeField.html) for the TimePicker component as it provides better reliability, accessibility, and supports both 12h/24h formats consistently.
