type FunnelStep = {
  count: number;
  dropped: number | null;
  reachedPercentOfPrevious: number | null;
  droppedPercentOfPrevious: number | null;
  reachedPercentOfFirst: number;
  droppedPercentOfFirst: number;
};

const toCount = (value: unknown): number => {
  const count = Number(value);
  return Number.isFinite(count) ? Math.max(count, 0) : 0;
};

const percentOf = (part: number, whole: number): number | null =>
  whole > 0 ? (part / whole) * 100 : null;

const getFunnelSteps = (data: Record<string, unknown>[], dataKey: string): FunnelStep[] => {
  const counts = data.map((row) => toCount(row[dataKey]));
  const first = counts[0] ?? 0;
  const percentOfFirst = (count: number): number => percentOf(count, first) ?? 0;

  return counts.map((count, index) => {
    const previous = counts[index - 1] ?? 0;
    const dropped = index === 0 ? null : Math.max(previous - count, 0);
    return {
      count,
      dropped,
      reachedPercentOfPrevious: percentOf(count, previous),
      droppedPercentOfPrevious: dropped === null ? null : percentOf(dropped, previous),
      reachedPercentOfFirst: percentOfFirst(count),
      droppedPercentOfFirst: percentOfFirst(dropped ?? 0),
    };
  });
};

const formatPercent = (percent: number): string =>
  `${percent < 10 ? Number(percent.toFixed(1)) : Math.round(percent)}%`;

const countFormat = new Intl.NumberFormat('en-IN');

const formatCount = (value: number): string => countFormat.format(value);

export { getFunnelSteps, formatPercent, formatCount };
export type { FunnelStep };
