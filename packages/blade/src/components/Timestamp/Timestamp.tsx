import React from 'react';
import type { ReactElement } from 'react';
import { toDate, formatTimestamp, getFullAbsoluteLabel } from './utils';
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
   * - `"relative"`: human-relative label, e.g. "5 minutes ago"
   * - `"date"`: date only, e.g. "May 30, 2026"
   * - `"time"`: time only, e.g. "1:08 PM"
   * - `"dateTime"`: date and time, e.g. "May 30, 2026, 1:08 PM"
   *
   * @default "dateTime"
   */
  format?: 'relative' | 'date' | 'time' | 'dateTime';

  /**
   * Controls the verbosity of the date portion.
   * Only applicable when `format` is `"date"` or `"dateTime"`.
   *
   * @default "medium"
   */
  dateStyle?: 'short' | 'medium' | 'long' | 'full';

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
   * - `"hour"` — relative only: "3 hours ago"
   * - `"day"` — relative only: "2 days ago"
   *
   * @default "minute"
   */
  precision?: 'second' | 'minute' | 'hour' | 'day';

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
    noTooltip,
    color,
    size = 'medium',
    weight = 'regular',
    accessibilityLabel,
    testID,
    ...styledProps
  }: TimestampProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  if (__DEV__) {
    const date = toDate(value);
    if (isNaN(date.getTime())) {
      throwBladeError({
        message: `"${String(
          value,
        )}" is not a valid date. Pass a Date object, ISO string, or Unix timestamp in milliseconds.`,
        moduleName: 'Timestamp',
      });
    }
  }

  const date = toDate(value);
  const formattedText = formatTimestamp({
    date,
    format,
    dateStyle,
    hourCycle,
    precision,
  });
  const a11yLabel = accessibilityLabel ?? formattedText;

  // Smart tooltip: ON when visible text is compact or relative.
  // format="relative" → always compact ("5 minutes ago" needs full date on hover).
  // dateStyle="short" → abbreviated display, year often omitted.
  // noTooltip=true forces OFF, noTooltip=false forces ON, undefined = automatic.
  const autoTooltip = format === 'relative' || (format !== 'time' && dateStyle === 'short');
  const shouldShowTooltip = noTooltip === undefined ? autoTooltip : !noTooltip;

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
      <Text as="span" variant="body" size={size} weight={weight} color={color}>
        {formattedText}
      </Text>
    </BaseBox>
  );

  if (shouldShowTooltip) {
    return (
      <Tooltip content={getFullAbsoluteLabel(date)} placement="top">
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

export { Timestamp };
