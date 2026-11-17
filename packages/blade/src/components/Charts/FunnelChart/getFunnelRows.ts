import { LABEL_KEY, NAME_KEY, VALUE_KEY } from './tokens';

type FunnelRow = {
  [NAME_KEY]: string;
  [VALUE_KEY]: number;
  [LABEL_KEY]: string;
  role: 'img';
  'aria-label': string;
};

const toCount = (value: unknown): number => {
  const count = Number(value);
  return Number.isFinite(count) ? Math.max(count, 0) : 0;
};

const formatPercent = (percent: number): string => {
  if (percent > 0 && percent < 0.1) return '<0.1%';
  if (percent > 99.5 && percent < 100) return '>99%';
  return `${percent < 10 ? Number(percent.toFixed(1)) : Math.round(percent)}%`;
};

const getFunnelRows = (
  data: Record<string, unknown>[],
  dataKey: string,
  nameKey: string,
): FunnelRow[] => {
  const counts = data.map((row) => toCount(row[dataKey]));
  if (!counts.some(Boolean)) return [];
  const first = counts[0];

  return data.map((row, index) => {
    const name = String(row[nameKey] ?? '');
    const percent = first > 0 ? formatPercent((counts[index] / first) * 100) : null;
    const label = percent === null ? name : `${name} · ${percent}`;
    return {
      [NAME_KEY]: name,
      [VALUE_KEY]: counts[index],
      [LABEL_KEY]: label,
      role: 'img',
      'aria-label': `${label}, ${counts[index]}`,
    };
  });
};

export { getFunnelRows, formatPercent };
export type { FunnelRow };
