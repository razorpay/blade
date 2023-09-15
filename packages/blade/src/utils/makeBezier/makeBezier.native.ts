import { Easing } from 'react-native-reanimated';
import type { EasingFactoryFn } from 'react-native-reanimated';

export const makeBezier = (x1: number, y1: number, x2: number, y2: number): EasingFactoryFn => {
  return Easing.bezier(x1, y1, x2, y2);
};
