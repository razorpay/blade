import type { AccessibilityMap } from './a11yMap';
import { accessibilityMap } from './a11yMap';

const mapA11yProps = (props: AccessibilityMap): Record<string, unknown> => {
  const newProps: Record<string, unknown> = {};

  if (props.accessibilityRole) {
    newProps.role = props.accessibilityRole;
  }

  // eslint-disable-next-line guard-for-in
  for (const key in props) {
    const propkey = key as keyof AccessibilityMap;
    // Map aria to RN web accessibility equivalents
    if (accessibilityMap[propkey]) {
      newProps[accessibilityMap[propkey]] = props[propkey];
    } else {
      console.warn('No mapping found for', propkey);
    }
  }

  return newProps;
};

export default mapA11yProps;
