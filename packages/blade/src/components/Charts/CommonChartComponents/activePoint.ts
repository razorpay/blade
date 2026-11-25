import React from 'react';
import { formatChartValueFull } from '../utils/chartValueFormat';
import type { ChartValueFormat } from '../utils/chartValueFormat';
import type { ChartActivePoint, ChartActivePointItem, ChartColorToken } from './types';
import { componentId } from './tokens';
import { getComponentId } from '~utils/isValidAllowedChildren';

type ChartRow = Record<string, unknown>;

/** A series of a line, area or bar chart, as its wrapper knows it. */
type ActivePointSeries = {
  dataKey: string;
  name: string;
  /** A CSS colour. */
  color: string;
  colorToken: ChartColorToken;
};

/** A value or a label as text. A React node or an empty value gives undefined. */
const toText = (value: unknown): string | undefined =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;

/** The props of the first direct child, arrays flattened, with this Blade component id. */
const getChildProps = <T>(children: React.ReactNode, id: string): T | undefined => {
  const child = React.Children.toArray(children).find(
    (node) => React.isValidElement(node) && getComponentId(node) === id,
  );
  return React.isValidElement(child) ? (child.props as T) : undefined;
};

type TooltipFormatters = {
  formatter?: (...args: never[]) => unknown;
  labelFormatter?: (...args: never[]) => unknown;
};

/**
 * Builds the active point of a chart, with the same text as the chart. A value takes the
 * ChartTooltip `formatter`, else the wrapper `valueFormat`, else its raw text. A label takes the
 * ChartTooltip `labelFormatter`, else the label axis `tickFormatter`, else its raw text.
 *
 * The formatters get the payload recharts gives them: each item holds the data row in `payload`.
 * A custom ChartTooltip `content` is not mirrored: only `formatter` and `labelFormatter` are.
 */
const createActivePointBuilder = ({
  data,
  children,
  series,
  valueFormat,
  labelKey,
  labelAxisId = componentId.chartXAxis,
  getLabel,
}: {
  data: ReadonlyArray<ChartRow>;
  children: React.ReactNode;
  series: ReadonlyArray<ActivePointSeries>;
  valueFormat?: ChartValueFormat;
  /** The data key of the label. Undefined reads it from the label axis. */
  labelKey?: string;
  /** The axis that holds the labels: X, or Y on a bar chart with `layout="vertical"`. */
  labelAxisId?: string;
  /** The raw label of a row, when it is not a data key: the slice name of a donut. */
  getLabel?: (row: ChartRow, index: number) => unknown;
}): ((index: number) => ChartActivePoint | null) => {
  const tooltip = getChildProps<TooltipFormatters>(children, componentId.chartTooltip);
  const labelAxis = getChildProps<{ dataKey?: string; tickFormatter?: unknown }>(
    children,
    labelAxisId,
  );
  const key = labelKey ?? labelAxis?.dataKey;
  const formatter = tooltip?.formatter as
    | ((value: unknown, name: string, item: unknown, index: number, payload: unknown[]) => unknown)
    | undefined;
  const labelFormatter = tooltip?.labelFormatter as
    | ((label: unknown, payload: unknown[]) => unknown)
    | undefined;
  const tickFormatter = labelAxis?.tickFormatter as
    | ((value: unknown, index: number) => unknown)
    | undefined;

  const formatValue = (
    value: unknown,
    item: ActivePointSeries,
    row: ChartRow,
    index: number,
  ): string => {
    if (formatter) {
      // As recharts: the item with the row in `payload`, and the payload of the point.
      const payloadItem = { ...item, value, payload: row };
      const result = formatter(value, item.name, payloadItem, index, [payloadItem]);
      const text = toText(Array.isArray(result) ? result[0] : result);
      if (text !== undefined) return text;
    }
    if (valueFormat) return formatChartValueFull(value, valueFormat);
    return toText(value) ?? '';
  };

  return (index) => {
    const row = data[index];
    if (!row) return null;
    const getRawLabel = (): unknown => {
      if (getLabel) return getLabel(row, index);
      return key ? row[key] : index;
    };
    const label = getRawLabel();
    const formattedLabel =
      (labelFormatter ? toText(labelFormatter(label, [{ payload: row }])) : undefined) ??
      (tickFormatter ? toText(tickFormatter(label, index)) : undefined) ??
      toText(label) ??
      '';
    const items: ChartActivePointItem[] = series.map((item) => {
      const value = row[item.dataKey];
      return {
        dataKey: item.dataKey,
        name: item.name,
        value: typeof value === 'number' || typeof value === 'string' ? value : undefined,
        formattedValue: formatValue(value, item, row, index),
        color: item.color,
        colorToken: item.colorToken,
      };
    });
    return { index, label: toText(label) ?? String(index), formattedLabel, items };
  };
};

/** True when two points read the same: the label and each item's key, value and text. */
const isSamePoint = (a: ChartActivePoint | null, b: ChartActivePoint | null): boolean => {
  if (a === null || b === null) return a === b;
  return (
    a.index === b.index &&
    a.label === b.label &&
    a.formattedLabel === b.formattedLabel &&
    a.items.length === b.items.length &&
    a.items.every((item, i) => {
      const other = b.items[i];
      return (
        item.dataKey === other.dataKey &&
        item.value === other.value &&
        item.formattedValue === other.formattedValue
      );
    })
  );
};

/**
 * Calls `onChange` when the active point changes: the point at the active index, or null when no
 * point is active. It builds the point on each render and sends it only when it reads differently
 * from the last one sent. So a new index, new data, a series hidden in the legend or a new
 * `valueFormat` sends it again. The same point sends nothing. On unmount, it sends null if a point
 * was active.
 */
const useActivePointChange = (
  index: number | undefined,
  buildPoint: (index: number) => ChartActivePoint | null,
  onChange: ((point: ChartActivePoint | null) => void) | undefined,
): void => {
  const lastPointRef = React.useRef<ChartActivePoint | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const point = index === undefined ? null : buildPoint(index);
  React.useEffect(() => {
    if (isSamePoint(lastPointRef.current, point)) return;
    lastPointRef.current = point;
    onChangeRef.current?.(point);
  });
  React.useEffect(
    () => () => {
      if (lastPointRef.current !== null) onChangeRef.current?.(null);
    },
    [],
  );
};

export { createActivePointBuilder, useActivePointChange, getChildProps };
export type { ActivePointSeries };
