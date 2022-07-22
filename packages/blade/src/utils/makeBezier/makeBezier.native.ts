import { Easing } from 'react-native-reanimated';
import type { EasingFunctionFactory } from 'react-native-reanimated';

export const makeBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): EasingFunctionFactory => {
  return Easing.bezier(x1, y1, x2, y2);
};
