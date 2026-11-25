import React from 'react';
import { formatChartValueFull } from '../utils/chartValueFormat';
import type { ChartValueFormat } from '../utils/chartValueFormat';
import type { ChartActivePoint, ChartActivePointItem } from './types';
import { componentId } from './tokens';
import { getComponentId } from '~utils/isValidAllowedChildren';

type ChartRow = Record<string, unknown>;

/** A series of a line, area or bar chart, as its wrapper knows it. */
type ActivePointSeries = { dataKey: string; name: string; color: string };

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
 */
const createActivePointBuilder = ({
  data,
  children,
  series,
  valueFormat,
  labelKey,
  labelAxisId = componentId.chartXAxis,
}: {
  data: ReadonlyArray<ChartRow>;
  children: React.ReactNode;
  series: ReadonlyArray<ActivePointSeries>;
  valueFormat?: ChartValueFormat;
  /** The data key of the label. Undefined reads it from the label axis. */
  labelKey?: string;
  /** The axis that holds the labels: X, or Y on a bar chart with `layout="vertical"`. */
  labelAxisId?: string;
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
      const result = formatter(value, item.name, { ...item, value, payload: row }, index, []);
      const text = toText(Array.isArray(result) ? result[0] : result);
      if (text !== undefined) return text;
    }
    if (valueFormat) return formatChartValueFull(value, valueFormat);
    return toText(value) ?? '';
  };

  return (index) => {
    const row = data[index];
    if (!row) return null;
    const label = key ? row[key] : index;
    const formattedLabel =
      (labelFormatter ? toText(labelFormatter(label, [])) : undefined) ??
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
      };
    });
    return { index, label: toText(label) ?? String(index), formattedLabel, items };
  };
};

/**
 * Calls `onChange` when the active index changes: the point at the new index, or null when no
 * point is active. Not on every move: an index that stays the same calls nothing.
 */
const useActivePointChange = (
  index: number | undefined,
  buildPoint: (index: number) => ChartActivePoint | null,
  onChange: ((point: ChartActivePoint | null) => void) | undefined,
): void => {
  const lastIndexRef = React.useRef<number | undefined>(undefined);
  const buildRef = React.useRef(buildPoint);
  const onChangeRef = React.useRef(onChange);
  buildRef.current = buildPoint;
  onChangeRef.current = onChange;
  React.useEffect(() => {
    if (index === lastIndexRef.current) return;
    lastIndexRef.current = index;
    onChangeRef.current?.(index === undefined ? null : buildRef.current(index));
  }, [index]);
};

export { createActivePointBuilder, useActivePointChange, getChildProps };
export type { ActivePointSeries };
