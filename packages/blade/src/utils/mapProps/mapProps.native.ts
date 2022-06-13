/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  accessibilityMap,
  accessibilityStateKeys,
  accessibilityValueKeys,
  supportedRolesInNative,
} from './a11yMap.native';
import type { AccessibilityMap } from './a11yMap.native';

function isAccessibilityStateProp(prop: string): boolean {
  return accessibilityStateKeys.includes(prop);
}

function isAccessibilityValueProp(prop: string): boolean {
  return accessibilityValueKeys.includes(prop);
}

const mapA11yProps = (props: AccessibilityMap): Record<string, unknown> => {
  const newProps: Record<string, any> = {};

  // loop through all the incoming props and map them
  for (const key in props) {
    const propKey = key as keyof AccessibilityMap;
    const propValue = props[propKey];
    const a11yKey = accessibilityMap[propKey];

    // group accesibilityState prop for native
    if (isAccessibilityStateProp(propKey)) {
      newProps.accessibilityState = {
        ...newProps.accessibilityState,
        [a11yKey]: propValue,
      };
      continue;
    }

    // group accesibilityValue prop for native
    if (isAccessibilityValueProp(propKey)) {
      newProps.accessibilityValue = {
        ...newProps.accessibilityValue,
        [a11yKey]: propValue,
      };
      continue;
    }

    if (a11yKey) {
      newProps[a11yKey] = propValue;
    } else {
      console.warn('No mapping found for', propKey);
    }
  }

  // ignore unsupported roles in native
  if (
    newProps.accessibilityRole &&
    !supportedRolesInNative.includes(newProps.accessibilityRole as string)
  ) {
    delete newProps.accessibilityRole;
  }

  return newProps;
};

export default mapA11yProps;
