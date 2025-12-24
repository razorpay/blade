import type { EasingFactoryFn } from '~tokens/global/motion';

export const makeBezier = <
  X1 extends number,
  Y1 extends number,
  X2 extends number,
  Y2 extends number
>(
  x1: X1,
  y1: Y1,
  x2: X2,
  y2: Y2,
): EasingFactoryFn => {
  // This is a placeholder implementation for native
  // In a real implementation, this would return a react-native-reanimated easing function
  return {
    factory: () => (value: number) => value,
  };
};
