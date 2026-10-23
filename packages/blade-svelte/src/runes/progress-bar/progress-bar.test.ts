import { describe, it, expect } from 'vitest';
import { getProgressBarValue } from './progress-bar';

describe('getProgressBarValue', () => {
  it('a progress bar reports the floored percentage of the clamped value', () => {
    expect(getProgressBarValue({ value: 33.9, max: 120 })).toEqual({
      percent: 28,
      role: 'progressbar',
      valueNow: 28,
      valueText: '28%',
      valueMin: 0,
      valueMax: 120,
    });
    expect(getProgressBarValue({ value: 500 }).percent).toBe(100);
    expect(getProgressBarValue({ value: -5 }).percent).toBe(0);
  });

  it('a meter reports the clamped value, its percentage to one decimal', () => {
    expect(getProgressBarValue({ type: 'meter', value: 1, max: 3 })).toMatchObject({
      percent: 33.3,
      role: 'meter',
      valueNow: 1,
      valueText: '1',
    });
  });

  it('an indeterminate progress bar reports no value; a meter ignores it', () => {
    expect(getProgressBarValue({ value: 40, isIndeterminate: true })).toEqual({
      percent: 40,
      role: 'progressbar',
    });
    expect(getProgressBarValue({ type: 'meter', value: 40, isIndeterminate: true }).valueNow).toBe(
      40,
    );
  });

  it('an empty range draws an empty bar', () => {
    expect(getProgressBarValue({ min: 10, max: 10, value: 10 }).percent).toBe(0);
  });
});
