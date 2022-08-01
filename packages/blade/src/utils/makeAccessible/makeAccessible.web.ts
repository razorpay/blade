/* eslint-disable @typescript-eslint/no-explicit-any */
import { accessibilityMap } from './accessibilityMapWeb';
import type { AccessibilityMap, AccessibilityProps } from './makeAccessible.d';

export const makeAccessible = (props: Partial<AccessibilityProps>): Record<string, unknown> => {
  const newProps: Record<string, any> = {};

  // eslint-disable-next-line guard-for-in
  for (const key in props) {
    const propKey = key as keyof AccessibilityMap;
    const propValue = props[propKey];
    const accessibilityAttribute = accessibilityMap[propKey];

    if (accessibilityAttribute) {
      newProps[accessibilityAttribute] = propValue;
    } else {
      console.warn(
        `[Blade: makeAccessible]: No mapping found for ${propKey}. Make sure you have entered valid key`,
      );
    }
  }

  return newProps;
};
