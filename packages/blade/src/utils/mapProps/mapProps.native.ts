/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AccessibilityMap } from './a11yMap';
import { accessibilityValue, accessibilityState, supportedRolesInNative } from './a11yMap';

const mapA11yProps = (props: AccessibilityMap): Record<string, unknown> => {
  const newProps: Record<string, any> = {};

  // eslint-disable-next-line guard-for-in
  for (const key in props) {
    const propKey = key as keyof AccessibilityMap;

    // Group accessibilityState props
    if (Object.keys(accessibilityState).includes(propKey)) {
      const groupKey = accessibilityState[propKey as keyof typeof accessibilityState].replace(
        'aria-',
        '',
      );
      newProps.accessibilityState = {
        ...newProps.accessibilityState,
        [groupKey]: props[propKey],
      };
      continue;
    }

    // group accessibilityValue props
    if (Object.keys(accessibilityValue).includes(propKey)) {
      const groupKey = accessibilityValue[propKey as keyof typeof accessibilityValue].replace(
        'aria-value',
        '',
      );
      newProps.accessibilityValue = {
        ...newProps.accessibilityValue,
        [groupKey]: props[propKey],
      };
      continue;
    }

    newProps[propKey] = props[propKey];
  }
  // console.log(newProps, supportedRolesInNative.includes(newProps.accessibilityRole as string))

  // filter out unsupported roles
  if (
    newProps.accessibilityRole &&
    !supportedRolesInNative.includes(newProps.accessibilityRole as string)
  ) {
    delete newProps.accessibilityRole;
  }

  return newProps;
};

export default mapA11yProps;
