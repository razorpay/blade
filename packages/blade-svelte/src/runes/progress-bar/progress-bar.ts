/**
 * How far along a ProgressBar is, and what it tells assistive tech, as Blade
 * React works them out. A `progress` bar reports a floored percentage; a
 * `meter` reports the clamped value itself, its percentage to one decimal.
 */
export interface ProgressBarValueOptions {
  value?: number;
  min?: number;
  max?: number;
  /** @default 'progress' */
  type?: 'progress' | 'meter';
  /** A progress bar with no value to report. Ignored by a meter. */
  isIndeterminate?: boolean;
}

export interface ProgressBarValue {
  /** 0–100: the fill's share of the track. */
  percent: number;
  role: 'progressbar' | 'meter';
  /** Unset while indeterminate. */
  valueNow?: number;
  valueText?: string;
  valueMin?: number;
  valueMax?: number;
}

export function getProgressBarValue(options: ProgressBarValueOptions = {}): ProgressBarValue {
  const { value = 0, min = 0, max = 100, type = 'progress' } = options;
  const isMeter = type === 'meter';
  const clamped = Math.min(max, Math.max(min, value));
  const share = max > min ? ((clamped - min) * 100) / (max - min) : 0;
  const percent = isMeter ? parseFloat(share.toFixed(1)) : Math.floor(share);
  if (!isMeter && options.isIndeterminate) return { percent, role: 'progressbar' };
  return {
    percent,
    role: isMeter ? 'meter' : 'progressbar',
    valueNow: isMeter ? clamped : percent,
    valueText: isMeter ? `${clamped}` : `${percent}%`,
    valueMin: min,
    valueMax: max,
  };
}
