import React from 'react';
import type { ReactElement } from 'react';
import { toDate, formatTimestamp, getFullAbsoluteLabel, getRelativeUpdateInterval } from './utils';
import type { TimestampFormat, TimestampDateStyle, TimestampPrecision } from './utils';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { throwBladeError } from '~utils/logger';
import { isReactNative } from '~utils';

export type TimestampProps = {
  /**
   * The date/time value to display.
   * Accepts a `Date` object, ISO 8601 string, or Unix timestamp in milliseconds.
   */
  value: Date | string | number;

  /**
   * Controls how the timestamp is displayed.
   * - `"relative"`: human-relative label, e.g. "5 minutes ago". Auto-updates.
   * - `"date"`: date only, e.g. "May 30, 2026"
   * - `"time"`: time only, e.g. "1:08 PM"
   * - `"dateTime"`: date and time, e.g. "May 30, 2026, 1:08 PM"
   *
   * @default "dateTime"
   */
  format?: TimestampFormat;

  /**
   * Controls the verbosity of the date portion.
   * Only applicable when `format` is `"date"` or `"dateTime"`.
   *
   * - `"short"`:  "5/30/26"
   * - `"medium"`: "May 30, 2026"
   * - `"long"`:   "May 30, 2026" (same as medium in most locales; adds month in others)
   * - `"full"`:   "Saturday, May 30, 2026"
   *
   * @default "medium"
   */
  dateStyle?: TimestampDateStyle;

  /**
   * Hour cycle for time display.
   * Defaults to the locale's preferred cycle when omitted.
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
   * Note: `"hour"` and `"day"` have no effect on absolute formats (`"time"`, `"dateTime"`).
   *
   * @default "minute"
   */
  precision?: TimestampPrecision;

  /**
   * BCP 47 locale string. Controls language and regional number/date ordering.
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
   * Overrides the text color.
   *
   * @default "surface.text.gray.normal"
   */
  color?: BaseTextProps['color'];

  /**
   * Controls the text size. Follows Blade body text sizing.
   *
   * @default "medium"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Controls the font weight.
   *
   * @default "regular"
   */
  weight?: 'regular' | 'medium' | 'semibold';

  /**
   * Accessible label override. Defaults to the formatted text value.
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

const _Timestamp = (
  {
    value,
    format = 'dateTime',
    dateStyle = 'medium',
    hourCycle,
    precision = 'minute',
    locale = 'en-IN',
    noTooltip,
    color,
    size = 'medium',
    weight = 'regular',
    accessibilityLabel,
    testID,
    ...styledProps
  }: TimestampProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement | null => {
  // Parse the value once upfront — used in both validation and formatting.
  const date = toDate(value);

  if (__DEV__) {
    if (isNaN(date.getTime())) {
      throwBladeError({
        message: `"${String(
          value,
        )}" is not a valid date. Pass a Date object, ISO string, or Unix timestamp in milliseconds.`,
        moduleName: 'Timestamp',
      });
    }

    // 'hour' and 'day' are only meaningful for format="relative". For absolute
    // formats they silently fall back to 'short' timeStyle which can confuse
    // developers who expect finer control.
    if (
      (precision === 'hour' || precision === 'day') &&
      (format === 'time' || format === 'dateTime')
    ) {
      throwBladeError({
        message: `precision="${precision}" has no effect when format="${format}". Use precision="minute" or precision="second" for absolute formats.`,
        moduleName: 'Timestamp',
      });
    }
  }

  // In production, return nothing rather than rendering "Invalid Date" in the UI.
  if (isNaN(date.getTime())) {
    return null;
  }

  // Tick counter to force re-render for live relative timestamps.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tick, setTick] = React.useState(0);

  // Auto-update relative timestamps on an adaptive interval.
  // Reschedules after each tick using the updated age of the timestamp.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (format !== 'relative') return undefined;
    const id = setTimeout(() => setTick((t) => t + 1), getRelativeUpdateInterval(date));
    return () => clearTimeout(id);
  }, [format, date, tick]);

  // Memoize formatted output — Intl constructors are expensive.
  // `tick` is intentionally included so relative timestamps recompute on each update.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formattedText = React.useMemo(
    () => formatTimestamp({ date, format, dateStyle, hourCycle, precision, locale }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, format, dateStyle, hourCycle, precision, locale, tick],
  );

  const tooltipLabel = React.useMemo(() => getFullAbsoluteLabel(date, locale), [date, locale]);

  const a11yLabel = accessibilityLabel ?? formattedText;

  // Smart tooltip: ON when visible text is compact or relative.
  // noTooltip=true forces OFF, noTooltip=false forces ON, undefined = automatic.
  const autoTooltip = format === 'relative' || (format !== 'time' && dateStyle === 'short');
  const shouldShowTooltip = noTooltip === undefined ? autoTooltip : !noTooltip;

  const textNode = (
    <Text as="span" variant="body" size={size} weight={weight} color={color}>
      {formattedText}
    </Text>
  );

  const inner = (
    <BaseBox
      ref={ref as never}
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      alignItems="center"
      {...metaAttribute({ name: MetaConstants.Timestamp, testID })}
      {...getStyledProps(styledProps)}
      {...makeAnalyticsAttribute(styledProps)}
      {...makeAccessible({ label: a11yLabel })}
    >
      {/* Semantic <time> element on web — gives screen readers and crawlers the
          machine-readable ISO date even when visible text is compact or relative. */}
      {isReactNative() ? (
        textNode
      ) : (
        <time dateTime={date.toISOString()} style={{ display: 'inline' }}>
          {textNode}
        </time>
      )}
    </BaseBox>
  );

  if (shouldShowTooltip) {
    return (
      <Tooltip content={tooltipLabel} placement="top">
        <TooltipInteractiveWrapper>{inner}</TooltipInteractiveWrapper>
      </Tooltip>
    );
  }

  return inner;
};

const Timestamp = assignWithoutSideEffects(React.forwardRef(_Timestamp), {
  displayName: 'Timestamp',
  componentId: 'Timestamp',
});

export type { TimestampFormat, TimestampDateStyle, TimestampPrecision };
export { Timestamp };
