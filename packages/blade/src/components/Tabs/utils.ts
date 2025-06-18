import React from 'react';
import type { TabsProps } from './types';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { logger, throwBladeError } from '~utils/logger';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

const iconSizeMap = {
  small: 'medium',
  medium: 'medium',
  large: 'large',
} as const;

const textSizeMap = {
  small: 'medium',
  medium: 'medium',
  large: 'large',
} as const;

const badgeSizeMap = {
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const counterSizeMap = {
  small: 'small',
  medium: 'small',
  large: 'small',
} as const;

const propRestrictionMap = {
  Badge: {
    small: {
      size: badgeSizeMap.small,
    },
    medium: {
      size: badgeSizeMap.medium,
    },
    large: {
      size: badgeSizeMap.large,
    },
  },
  Counter: {
    small: {
      size: counterSizeMap.small,
    },
    medium: {
      size: counterSizeMap.medium,
    },
    large: {
      size: counterSizeMap.large,
    },
  },
} as const;

type TrailingComponents = keyof typeof propRestrictionMap;

const useTabsItemPropRestriction = (
  trailing: React.ReactNode,
  tabItemSize: NonNullable<TabsProps['size']>,
): React.ReactNode => {
  const [
    validatedTrailingComponent,
    setValidatedTrailingComponent,
  ] = React.useState<React.ReactElement | null>(null);

  // validate and restrict sub component props in trailing prop
  useIsomorphicLayoutEffect(() => {
    if (React.isValidElement(trailing)) {
      const trailingComponentType = getComponentId(trailing) as TrailingComponents;
      const restrictedProps = propRestrictionMap[trailingComponentType]?.[tabItemSize];
      if (__DEV__) {
        if (!restrictedProps) {
          throwBladeError({
            message: `Only Badge or Counter component is accepted as trailing`,
            moduleName: 'TabsItem',
          });
        }

        const restrictedPropKeys = Object.keys(restrictedProps);
        for (const prop of restrictedPropKeys) {
          if (trailing?.props?.hasOwnProperty(prop)) {
            logger({
              message: `Do not pass "${prop}" to "${trailingComponentType}" while inside TabsItem trailing, because we override it.`,
              moduleName: 'TabsItem',
              type: 'warn',
            });
          }
        }
      }
      setValidatedTrailingComponent(
        React.cloneElement(trailing as React.ReactElement, restrictedProps),
      );
    }
  }, [tabItemSize, trailing]);

  return validatedTrailingComponent;
};

const componentIds = {
  TabList: 'TabList',
  TabPanel: 'TabPanel',
} as const;

export { useTabsItemPropRestriction, iconSizeMap, textSizeMap, componentIds };
