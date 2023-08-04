/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  accessibilityMap,
  accessibilityRoleMap,
  accessibilityStateKeys,
  accessibilityValueKeys,
} from './accessibilityMapNative';
import type { AccessibilityMap, AccessibilityProps } from './types';

export const makeAccessible = (props: Partial<AccessibilityProps>): Record<string, unknown> => {
  const newProps: Record<string, any> = {};

  newProps.accessible = true;

  // loop through all the incoming props and map them
  for (const key in props) {
    const propKey = key as keyof AccessibilityMap;
    const propValue = props[propKey];
    const accessibilityAttribute = accessibilityMap[propKey];

    // group accesibilityState prop for native
    if (accessibilityStateKeys.includes(propKey)) {
      newProps.accessibilityState = {
        ...newProps.accessibilityState,
        [accessibilityAttribute]: propValue,
      };
      continue;
    }

    // group accesibilityValue prop for native
    if (accessibilityValueKeys.includes(propKey)) {
      newProps.accessibilityValue = {
        ...newProps.accessibilityValue,
        [accessibilityAttribute]: propValue,
      };
      continue;
    }

    // handle accessibilityHidden
    // in react-native we have 2 platform-specific values for it.
    if (propKey === 'hidden') {
      if (propValue === true) {
        newProps.accessibilityElementsHidden = true;
        newProps.importantForAccessibility = 'no-hide-descendants';
      }

      delete newProps.accessible;
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
    type Roles = keyof typeof accessibilityRoleMap;
    const role = accessibilityRoleMap[newProps.accessibilityRole as Roles];
    newProps.accessibilityRole = role;

    // ignore unsupported roles
    if (!role) {
      const validRoles = Object.keys(accessibilityRoleMap).join(', ');
      console.log(
        `[Blade: makeAccessible]: Unsupported accessibility role for react-native. Expected one of ${validRoles} but found ${
          props.role as string
        }`,
      );
      delete newProps.accessibilityRole;
    }
  }

  return newProps;
};
