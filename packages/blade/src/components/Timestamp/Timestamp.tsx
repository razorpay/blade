import React from 'react';
import type { ReactElement } from 'react';
import { toDate, formatTimestamp, getFullAbsoluteLabel, getRelativeUpdateInterval } from './utils';
import type { TimestampFormat, TimestampDateStyle, TimestampPrecision } from './utils';
import {
  timestampFontSizes,
  timestampLineHeights,
  bodySizes,
  headingSizes,
  displaySizes,
} from './timestampTokens';
import type { TimestampTypeProps } from './timestampTokens';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { BaseText } from '~components/Typography/BaseText';
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

type TimestampCommonProps = {
  /**
   * The date/time value to display.
   * Accepts a `Date` object, ISO 8601 string, or Unix timestamp in milliseconds.
   * An invalid value throws in __DEV__ and renders nothing in production.
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
   * Note: `"hour"` and `"day"` throw in __DEV__ when used with absolute formats.
   *
   * @default "minute"
   */
  precision?: TimestampPrecision;

  /**
   * BCP 47 locale string. Controls language and regional number/date ordering.
   * Defaults to `"en-IN"` (Razorpay product standard).
   * Override for cross-border surfaces: `"en-MY"`, `"en-SG"`, `"en-US"`.
   *
   * @default "en-IN"
   */
  locale?: string;

  /**
   * Override the automatic tooltip behaviour.
   *
   * By default a tooltip showing the full absolute datetime is shown when
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
   * Accessible label override. Defaults to the formatted text value.
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

export type TimestampProps = TimestampTypeProps & TimestampCommonProps;

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
    type = 'body',
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

    // Validate type × size combinations (mirrors Amount's validation pattern)
    if (type === 'body' && !bodySizes.includes(size as never)) {
      throwBladeError({
        message: `size="${size}" is not allowed with type="body". Valid sizes: ${bodySizes.join(', ')}.`,
        moduleName: 'Timestamp',
      });
    }
    if (type === 'heading' && !headingSizes.includes(size as never)) {
      throwBladeError({
        message: `size="${size}" is not allowed with type="heading". Valid sizes: ${headingSizes.join(', ')}.`,
        moduleName: 'Timestamp',
      });
    }
    if (type === 'display' && !displaySizes.includes(size as never)) {
      throwBladeError({
        message: `size="${size}" is not allowed with type="display". Valid sizes: ${displaySizes.join(', ')}.`,
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

  // Resolve typography tokens from the type × size 2D map (same as Amount)
  const resolvedType = (type ?? 'body') as 'body' | 'heading' | 'display';
  const resolvedSize = (size ?? 'medium') as string;
  const fontSize = timestampFontSizes[resolvedType][resolvedSize];
  const lineHeight = timestampLineHeights[resolvedType][resolvedSize];
  // heading/display use the heading font family (matches Amount convention)
  const fontFamily = resolvedType === 'body' ? ('text' as const) : ('heading' as const);

  const textNode = (
    <BaseText
      as={isReactNative() ? undefined : 'span'}
      fontSize={fontSize}
      fontWeight={weight}
      lineHeight={lineHeight}
      fontFamily={fontFamily}
      color={color}
    >
      {formattedText}
    </BaseText>
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
export type { TimestampBodyProps, TimestampHeadingProps, TimestampDisplayProps } from './timestampTokens';
export { Timestamp };
