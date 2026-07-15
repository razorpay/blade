import type { SliderMark, SliderRangeValue, SliderValue } from './types';
import { sliderTokens } from './sliderTokens';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getPrecision = (value: number): number => {
  const [, decimals = ''] = String(parseFloat(value.toFixed(14))).split('.');
  return decimals.length;
};

const snapValue = (value: number, min: number, max: number, step: number): number => {
  const snapped = min + Math.round((value - min) / step) * step;
  const precision = Math.max(getPrecision(step), getPrecision(min));
  return clamp(Number(snapped.toFixed(precision)), min, max);
};

const normalizeValue = (
  value: SliderValue,
  selectionType: 'single' | 'range',
  min: number,
  max: number,
  step: number,
): SliderValue => {
  if (selectionType === 'single') {
    const singleValue = typeof value === 'number' ? value : value[0];
    return snapValue(singleValue, min, max, step);
  }

  const rangeValue: SliderRangeValue = typeof value === 'number' ? [min, value] : value;
  const start = snapValue(Math.min(rangeValue[0], rangeValue[1]), min, max, step);
  const end = snapValue(Math.max(rangeValue[0], rangeValue[1]), min, max, step);
  return [start, end];
};

const getPercent = (value: number, min: number, max: number): number =>
  ((value - min) / (max - min)) * 100;

const getGeneratedMarks = (min: number, max: number, step: number): SliderMark[] => {
  const stepCount = Math.round((max - min) / step);
  if (stepCount > sliderTokens.maxGeneratedMarks) return [];

  const marks: SliderMark[] = Array.from({ length: stepCount + 1 }, (_, index) => ({
    value: snapValue(min + index * step, min, max, step),
  }));

  const lastMark = marks[marks.length - 1];
  if (lastMark && lastMark.value !== max) {
    marks.push({ value: max });
  }

  return marks;
};

const isSameValue = (previous: SliderValue, next: SliderValue): boolean => {
  if (typeof previous === 'number' && typeof next === 'number') return previous === next;
  if (typeof previous === 'number' || typeof next === 'number') return false;
  return previous[0] === next[0] && previous[1] === next[1];
};

export { getGeneratedMarks, getPercent, isSameValue, normalizeValue, snapValue };
