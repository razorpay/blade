import { formatSharePercentage } from '../SankeyChart/labelUtils';
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
    const percent = first > 0 ? `${formatSharePercentage((counts[index] / first) * 100)}%` : null;
    const label =
      percent === null ? `${name} · ${counts[index]}` : `${name} · ${counts[index]} · ${percent}`;
    return {
      [NAME_KEY]: name,
      [VALUE_KEY]: counts[index],
      [LABEL_KEY]: label,
      role: 'img',
      'aria-label': label,
    };
  });
};

export { getFunnelRows };
export type { FunnelRow };
