/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  accessibilityMap,
  accessibilityStateKeys,
  accessibilityValueKeys,
  supportedAccessibilityRoles,
} from './accessibilityMap.native';
import type { AccessibilityMap } from './accessibilityMap.native';

function isAccessibilityStateProp(prop: string): boolean {
  return accessibilityStateKeys.includes(prop);
}

function isAccessibilityValueProp(prop: string): boolean {
  return accessibilityValueKeys.includes(prop);
}

const mapAccessibilityProps = (props: AccessibilityMap): Record<string, unknown> => {
  const newProps: Record<string, any> = {};

  // loop through all the incoming props and map them
  for (const key in props) {
    const propKey = key as keyof AccessibilityMap;
    const propValue = props[propKey];
    const accessibilityAttribute = accessibilityMap[propKey];

    // group accesibilityState prop for native
    if (isAccessibilityStateProp(propKey)) {
      newProps.accessibilityState = {
        ...newProps.accessibilityState,
        [accessibilityAttribute]: propValue,
      };
      continue;
    }

    // group accesibilityValue prop for native
    if (isAccessibilityValueProp(propKey)) {
      newProps.accessibilityValue = {
        ...newProps.accessibilityValue,
        [accessibilityAttribute]: propValue,
      };
      continue;
    }

    if (accessibilityAttribute) {
      newProps[accessibilityAttribute] = propValue;
    } else {
      console.warn(
        `[Blade: mapAccessibilityProps]: No mapping found for ${propKey}. Make sure you have entered valid key`,
      );
    }
  }

  // ignore unsupported roles in native
  if (
    newProps.accessibilityRole &&
    !supportedAccessibilityRoles.includes(newProps.accessibilityRole as string)
  ) {
    console.warn(
      `[Blade: mapAccessibilityProps]: Unsupported accessibilityRole ${
        newProps.accessibilityRole as string
      } for native, For more info see: https://reactnative.dev/docs/accessibility#accessibilityrole`,
    );
    delete newProps.accessibilityRole;
  }

  return newProps;
};

export default mapAccessibilityProps;
