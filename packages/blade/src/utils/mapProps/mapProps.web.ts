import { accessibilityMap } from './a11yMap.web';
import type { AccessibilityMap } from './a11yMap.web';

const mapA11yProps = (props: AccessibilityMap): Record<string, unknown> => {
  const newProps: Record<string, unknown> = {};

  // eslint-disable-next-line guard-for-in
  for (const key in props) {
    const propKey = key as keyof AccessibilityMap;
    const propValue = props[propKey];
    const a11yKey = accessibilityMap[propKey];

    if (a11yKey) {
      newProps[a11yKey] = propValue;
    } else {
      console.warn('No mapping found for', propKey);
    }
  }

  return newProps;
};

export default mapA11yProps;
