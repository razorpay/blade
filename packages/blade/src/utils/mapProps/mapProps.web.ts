import { accessibilityMap } from './accessibilityMap.web';
import type { AccessibilityMap } from './accessibilityMap.web';

const mapAccessibilityProps = (props: AccessibilityMap): Record<string, unknown> => {
  const newProps: Record<string, unknown> = {};

  // eslint-disable-next-line guard-for-in
  for (const key in props) {
    const propKey = key as keyof AccessibilityMap;
    const propValue = props[propKey];
    const accessibilityAttribute = accessibilityMap[propKey];

    if (accessibilityAttribute) {
      newProps[accessibilityAttribute] = propValue;
    } else {
      console.warn(
        `[Blade: mapAccessibilityProps]: No mapping found for ${propKey}. Make sure you have entered valid key`,
      );
    }
  }

  return newProps;
};

export default mapAccessibilityProps;
