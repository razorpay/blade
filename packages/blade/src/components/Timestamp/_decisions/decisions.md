# Timestamp

Timestamp is a display component that renders a date and/or time value in a standardised, human-readable format. It solves the problem of inconsistent date formatting across Razorpay dashboards by providing a single API to display relative time ("5 minutes ago"), date-only, time-only, or combined date-time values. The component uses the browser's `Intl` APIs under the hood, ensuring localisation correctness out of the box.

## Design

- [Figma - Timestamp](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL)

## API

```jsx
import { Timestamp } from '@razorpay/blade/components';

// Transaction table — relative time (auto-updates, shows tooltip with full date on hover)
<Timestamp value={payment.created_at} format="relative" />

// Order detail drawer — full absolute date + time
<Timestamp value={payment.created_at} format="dateTime" dateStyle="full" />

// Events & Logs — 24-hour, second-level precision
<Timestamp
  value={event.created_at}
  format="dateTime"
  dateStyle="short"
  precision="second"
  hourCycle="24h"
/>

// Date-only column
<Timestamp value={settlement.date} format="date" />
```

### Props

#### Timestamp

The `type` and `size` props form a discriminated union (mirrors the `Amount` component pattern). Each `type` value unlocks its own valid `size` range — mixing an invalid combination throws in `__DEV__`.

```typescript
// Discriminated union — each type has its own valid size set
type TimestampBodyProps = {
  type?: 'body';
  /** Valid: xsmall | small | medium | large */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  weight?: 'regular' | 'medium' | 'semibold';
};

type TimestampHeadingProps = {
  type?: 'heading';
  /** Valid: small | medium | large | xlarge | 2xlarge */
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  weight?: 'regular' | 'semibold';
};

type TimestampDisplayProps = {
  type?: 'display';
  /** Valid: small | medium | large | xlarge */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  weight?: 'regular' | 'medium' | 'semibold';
};

type TimestampProps = (TimestampBodyProps | TimestampHeadingProps | TimestampDisplayProps) & {
  /**
   * The date/time value to display.
   * Accepts a Date object, ISO 8601 string, or Unix timestamp in milliseconds.
   * An invalid value throws in __DEV__ and renders nothing in production.
   */
  value: Date | string | number;

  /**
   * Controls how the timestamp is displayed.
   * - `"relative"`: human-relative label, e.g. "5 minutes ago", "in 2 days". Auto-updates.
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
   * - `"long"`:   "May 30, 2026" (same as medium in most locales)
   * - `"full"`:   "Saturday, May 30, 2026"
   *
   * Maps directly to `Intl.DateTimeFormat` `dateStyle` option.
   *
   * @default "medium"
   */
  dateStyle?: 'short' | 'medium' | 'long' | 'full';

  /**
   * Controls the hour cycle for time display.
   * - `"12h"`: AM/PM format (e.g. "1:08 PM")
   * - `"24h"`: 24-hour format (e.g. "13:08")
   *
   * Defaults to the locale's preferred hour cycle when omitted.
   */
  hourCycle?: '12h' | '24h';

  /**
   * Controls time granularity for absolute formats (`"time"`, `"dateTime"`) and
   * the finest unit shown for `"relative"` format.
   *
   * - `"minute"` — "1:08 PM" / "5 minutes ago"
   * - `"second"` — "1:08:32 PM" / "30 seconds ago"
   * - `"hour"`   — relative only: "3 hours ago"
   * - `"day"`    — relative only: "2 days ago"
   *
   * Note: `"hour"` and `"day"` throw in __DEV__ when used with absolute formats.
   *
   * @default "minute"
   */
  precision?: 'second' | 'minute' | 'hour' | 'day';

  /**
   * BCP 47 locale string. Controls language and regional number/date ordering.
   * Defaults to `"en-IN"` which is the Razorpay product standard.
   * Override for cross-border surfaces (Malaysia `"en-MY"`, Singapore `"en-SG"`, US `"en-US"`).
   *
   * @default "en-IN"
   */
  locale?: string;

  /**
   * Override the automatic tooltip behaviour.
   *
   * By default, a tooltip showing the full absolute datetime is shown when the
   * visible text is compact or relative (`format="relative"` or `dateStyle="short"`).
   * Pass `true` to suppress it, `false` to force it on.
   * Leave unset to use smart defaults (recommended).
   *
   * @default undefined (automatic)
   */
  noTooltip?: boolean;

  /**
   * Overrides the default text color.
   * @default "surface.text.gray.normal"
   */
  color?: BaseTextProps['color'];

  /**
   * Accessible label for the timestamp. Defaults to the formatted text.
   * Override when the formatted text is insufficient for screen readers.
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

The most common case — displaying a payment creation time in a transaction table.

```jsx
<Timestamp value={payment.created_at} />
```

### Relative Time

Use `format="relative"` in activity feeds, notifications, and table columns where recency is more meaningful than an exact timestamp. The component **auto-updates** on an adaptive interval (every 10s when fresh, every 1min after that, every 1hr once older).

```jsx
<Timestamp value={payment.created_at} format="relative" />
// → "now" / "5 minutes ago" / "yesterday"
// Tooltip on hover: "Saturday, May 30, 2026, 1:08 PM"
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
  precision="second"
  hourCycle="24h"
/>
// → "5/30/26, 13:08:32"
```

### Cross-Border (locale override)

For MoneySaver and other cross-border surfaces, pass the appropriate locale.

```jsx
// India (default)
<Timestamp value={date} />

// Malaysia / Singapore
<Timestamp value={date} locale="en-MY" hourCycle="24h" />

// United States
<Timestamp value={date} locale="en-US" />
```

### Date Only

Settlement dates and other date-only columns.

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

### Tooltip Control

```jsx
// Force suppress (e.g. when you provide your own accessible alternative)
<Timestamp value={date} format="relative" noTooltip />

// Force show (e.g. dateStyle="medium" normally has no tooltip, but you want one)
<Timestamp value={date} format="date" dateStyle="medium" noTooltip={false} />
```

## Accessibility

- The component renders a semantic `<time>` element with a machine-readable `dateTime` ISO attribute on web. Screen readers and crawlers receive the precise date even when visible text is compact ("5 minutes ago") or abbreviated ("5/30/26").
- An `aria-label` is set to the formatted text by default. Override with `accessibilityLabel` when the formatted output is ambiguous.
- When the tooltip is active, the full absolute datetime ("Saturday, May 30, 2026, 1:08 PM") is shown on hover. The trigger is wrapped with `TooltipInteractiveWrapper` to satisfy Blade's requirement that tooltip triggers are interactive elements.

## Open Questions

- ~~**Locale**: Use `Intl` default (browser) locale or a product default?~~ Resolved: defaults to `"en-IN"` (Razorpay product standard) with a `locale` prop escape hatch for cross-border surfaces.
- ~~**Live Updates**: Should relative timestamps auto-update?~~ Resolved: yes, in v1. The component manages its own adaptive `setTimeout` interval (10s → 1min → 1hr as the timestamp ages). No consumer-side re-render needed.
- ~~**timeStyle prop**: Use `timeStyle: 'short'|'medium'|'long'|'full'` (direct Intl mapping) or an explicit `precision` prop?~~ Resolved: `precision`. The `timeStyle` values describe length but not what changes — a developer can't predict that `"medium"` adds seconds or that `"long"` adds a timezone offset without reading the Intl spec. `precision="second"` is self-documenting.
- **Timezone**: Currently uses the system timezone. A `timeZone` prop (mapping to `Intl.DateTimeFormat` `timeZone` option) is a natural extension for v2 when multi-timezone settlement/payout surfaces are needed.
- **`dateStyle="medium"` vs `"long"`**: In `en-US` and `en-IN` these produce identical output ("May 30, 2026"). They differ in some locales. Consider documenting this clearly or collapsing to 3 values in v2.
- **`dateStyle="numeric"` from the original proposal**: Dropped in favour of `dateStyle="short"` which maps to `Intl.DateTimeFormat`'s equivalent numeric style (e.g. "5/30/26" in en-US).
