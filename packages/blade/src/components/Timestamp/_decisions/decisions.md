# Timestamp

Timestamp is a display component that renders a date and/or time value in a standardised, human-readable format. It solves the problem of inconsistent date formatting across Razorpay dashboards by providing a single API to display relative time ("5 minutes ago"), date-only, time-only, or combined date-time values. The component uses the browser's `Intl` APIs under the hood, ensuring localisation correctness out of the box.

## Design

- [Figma - Timestamp](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL)

## API

```jsx
import { Timestamp } from '@razorpay/blade/components';

// Transaction table — relative time
<Timestamp value={payment.created_at} format="relative" />

// Order detail drawer — full absolute date + time
<Timestamp value={payment.created_at} format="dateTime" dateStyle="full" />

// Events & Logs — 24-hour, second-level precision
<Timestamp
  value={event.created_at}
  format="dateTime"
  dateStyle="short"
  timeStyle="medium"
  hourCycle="24h"
/>

// Date-only column
<Timestamp value={settlement.date} format="date" />
```

### Props

#### Timestamp

```typescript
type TimestampProps = {
  /**
   * The date/time value to display.
   * Accepts a Date object, ISO 8601 string, or Unix timestamp in milliseconds.
   */
  value: Date | string | number;

  /**
   * Controls how the timestamp is displayed.
   * - `"relative"`: human-relative label, e.g. "5 minutes ago", "in 2 days"
   * - `"date"`: date portion only, e.g. "May 30, 2026"
   * - `"time"`: time portion only, e.g. "1:08 PM"
   * - `"dateTime"`: both date and time, e.g. "May 30, 2026, 1:08 PM"
   *
   * @default "dateTime"
   */
  format?: 'relative' | 'date' | 'time' | 'dateTime';

  /**
   * Controls the verbosity of the date portion.
   * Only applicable when `format` is `"date"` or `"dateTime"`.
   * - `"short"`:  "5/30/26"
   * - `"medium"`: "May 30, 2026"
   * - `"long"`:   "May 30, 2026"
   * - `"full"`:   "Saturday, May 30, 2026"
   *
   * Maps directly to `Intl.DateTimeFormat` `dateStyle` option.
   *
   * @default "medium"
   */
  dateStyle?: 'short' | 'medium' | 'long' | 'full';

  /**
   * Controls the verbosity of the time portion.
   * Only applicable when `format` is `"time"` or `"dateTime"`.
   * - `"short"`:  "1:08 PM"
   * - `"medium"`: "1:08:00 PM"  (includes seconds)
   * - `"long"`:   "1:08:00 PM GMT+5:30"
   * - `"full"`:   "1:08:00 PM India Standard Time"
   *
   * Maps directly to `Intl.DateTimeFormat` `timeStyle` option.
   *
   * @default "short"
   */
  timeStyle?: 'short' | 'medium' | 'long' | 'full';

  /**
   * Controls the hour cycle for time display.
   * - `"12h"`: AM/PM format (e.g. "1:08 PM")
   * - `"24h"`: 24-hour format (e.g. "13:08")
   *
   * Defaults to the locale's preferred hour cycle when omitted.
   *
   * @default undefined
   */
  hourCycle?: '12h' | '24h';

  /**
   * Controls the finest time unit shown in `"relative"` format.
   * - `"second"`: "30 seconds ago"
   * - `"minute"`: "5 minutes ago"
   * - `"hour"`:   "2 hours ago"
   * - `"day"`:    "3 days ago"
   *
   * Relative formatting automatically chooses the most appropriate unit
   * above `precision`; e.g. with `precision="minute"`, values older than
   * 1 hour will display as hours, and values older than 1 day as days.
   *
   * Only applicable when `format` is `"relative"`.
   *
   * @default "minute"
   */
  precision?: 'second' | 'minute' | 'hour' | 'day';

  /**
   * Overrides the default text color.
   * @default "surface.text.gray.normal"
   */
  color?: BaseTextProps['color'];

  /**
   * Controls the text size. Follows Blade body text sizing.
   * @default "medium"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Controls the font weight.
   * @default "regular"
   */
  weight?: 'regular' | 'medium' | 'semibold';

  /**
   * Accessible label for the timestamp. Defaults to the formatted text.
   * Override when the formatted text is insufficient for screen readers
   * (e.g. "5 min ago" → "5 minutes ago").
   *
   * @default undefined
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;
```

## Examples

### Basic Usage

The most common case — displaying a payment creation time in a transaction table. The default `dateTime` format combines date and time in a readable way.

```jsx
<Timestamp value={payment.created_at} />
```

### Relative Time

Use `format="relative"` in activity feeds, notifications, and table columns where recency is more meaningful than an exact timestamp.

```jsx
<Timestamp value={payment.created_at} format="relative" />
// → "5 minutes ago"
// → "in 2 days"
// → "yesterday"
```

### Full Date & Time

Use `dateStyle="full"` in detail drawers and confirmation screens where precision matters.

```jsx
<Timestamp value={payment.created_at} format="dateTime" dateStyle="full" />
// → "Saturday, May 30, 2026, 1:08 PM"
```

### Developer / Log Surface (24h, Seconds)

Events logs and developer-facing UIs often need 24-hour time with second-level precision.

```jsx
<Timestamp
  value={event.created_at}
  format="dateTime"
  dateStyle="short"
  timeStyle="medium"
  hourCycle="24h"
/>
// → "5/30/26, 13:08:32"
```

### Date Only

Settlement dates and other date-only columns should use `format="date"` to avoid rendering irrelevant time data.

```jsx
<Timestamp value={settlement.date} format="date" />
// → "May 30, 2026"
```

### Inline in Text

Since `Timestamp` renders inline, it can be embedded inside a `Text` component.

```jsx
<Text>
  Last updated: <Timestamp value={updatedAt} format="relative" />
</Text>
```

## Accessibility

- The component renders with an `aria-label` set to the formatted text by default, ensuring screen readers convey the same information as the visual output.
- The `accessibilityLabel` prop allows overriding the `aria-label` for cases where the formatted output is ambiguous ("5 min ago" vs. "5 minutes ago").
- The `value` prop should always be a valid date so assistive technologies can present accurate information.

## Open Questions

- **Locale**: Currently uses `Intl` default locale (browser/OS locale). A future `locale` prop could be added to allow explicit locale override, but this is deferred to avoid premature complexity.
- **Timezone**: Currently uses the system timezone. A `timeZone` prop (mapping to `Intl.DateTimeFormat` `timeZone` option) is a natural extension for v2 when multi-timezone dashboards are needed.
- **Live Updates**: For relative timestamps that should refresh (e.g. "just now" → "5 minutes ago"), a `isLive` prop with configurable refresh interval could be added in v2. For v1, consumers are expected to manage re-renders themselves.
- **`dateStyle="numeric"` from the original proposal**: Dropped in favour of `dateStyle="short"` which maps to `Intl.DateTimeFormat`'s equivalent numeric style (e.g. "5/30/26" in en-US). "numeric" is not a valid `Intl.DateTimeFormat` `dateStyle` value and would require special-casing.
