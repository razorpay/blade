import type { IconComponent } from '~components/Icons';
import { getComponentId } from '~utils/isValidAllowedChildren';

const isIconComponent = (element: React.ReactNode | IconComponent): boolean => {
  if (typeof element === 'function') {
    // eslint-disable-next-line no-restricted-properties
    const componentId = (element as { componentId?: string }).componentId;
    return componentId?.endsWith('Icon') ?? false;
  }
  return getComponentId(element)?.endsWith('Icon') ?? false;
};

export { isIconComponent };
