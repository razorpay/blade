import type { AccessibilityMap } from './a11yMap';
import { supportedRolesInNative } from './a11yMap';

const mapA11yProps = (props: AccessibilityMap): Record<string, unknown> => {
  const newProps: Record<string, unknown> = { ...props };

  if (props.accessibilityRole && !supportedRolesInNative.includes(props.accessibilityRole)) {
    delete newProps.accessibilityRole;
  }

  return newProps;
};

export default mapA11yProps;
