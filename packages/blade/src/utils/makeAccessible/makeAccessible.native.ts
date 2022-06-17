/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  accessibilityMap,
  accessibilityStateKeys,
  accessibilityValueKeys,
  supportedAccessibilityRoles,
} from './accessibilityMapNative';
import type { AccessibilityMap, AccessibilityProps } from './makeAccessible.d';
import webToAccessibilityRole from './webToNativeRole';

function isAccessibilityStateProp(prop: string): boolean {
  return accessibilityStateKeys.includes(prop);
}

function isAccessibilityValueProp(prop: string): boolean {
  return accessibilityValueKeys.includes(prop);
}

const makeAccessible = (props: Partial<AccessibilityProps>): Record<string, unknown> => {
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

    // handle accessibilityHidden
    // in react-native we have to platform specific values for it.
    if (propKey === 'accessibilityHidden') {
      if (propValue === true) {
        newProps.accessibilityElementsHidden = true;
        newProps.importantForAccessibility = 'no-hide-descendants';
      }

      delete newProps.accessibilityHidden;
      continue;
    }

    if (accessibilityAttribute) {
      newProps[accessibilityAttribute] = propValue;
    } else {
      console.warn(
        `[Blade: makeAccessible]: No mapping found for ${propKey}. Make sure you have entered valid key`,
      );
    }
  }

  if (newProps.accessibilityRole) {
    // map web to native overlapping roles
    const role = webToAccessibilityRole(newProps.accessibilityRole);
    newProps.accessibilityRole = role;

    // ignore unsupported roles
    if (role && !supportedAccessibilityRoles.includes(role)) {
      console.warn(
        `[Blade: makeAccessible]: Unsupported accessibilityRole ${
          newProps.accessibilityRole as string
        } for native, For more info see: https://reactnative.dev/docs/accessibility#accessibilityrole`,
      );
      delete newProps.accessibilityRole;
    }
  }

  return newProps;
};

export default makeAccessible;
