import styled from 'styled-components';
import get from 'lodash/get';
import React from 'react';
import { CompositeItem } from '@floating-ui/react';
import type { TabsItemProps, TabsProps } from './types';
import { useTabsContext } from './TabsContext';
import { Text } from '~components/Typography';
import { castWebType, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import useInteraction from '~utils/useInteraction';
import { useIsMobile } from '~utils/useIsMobile';
import { logger, throwBladeError } from '~utils/logger';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

const paddings = {
  top: {
    desktop: {
      medium: 'spacing.2',
      large: 'spacing.2',
    },
    mobile: {
      medium: 'spacing.2',
      large: 'spacing.2',
    },
  },
  bottom: {
    desktop: {
      medium: 'spacing.5',
      large: 'spacing.4',
    },
    mobile: {
      medium: 'spacing.3',
      large: 'spacing.3',
    },
  },
  left: {
    desktop: {
      medium: 'spacing.6',
      large: 'spacing.6',
    },
    mobile: {
      medium: 'spacing.5',
      large: 'spacing.5',
    },
  },
  right: {
    desktop: {
      medium: 'spacing.6',
      large: 'spacing.6',
    },
    mobile: {
      medium: 'spacing.5',
      large: 'spacing.5',
    },
  },
};

const textColor = {
  default: 'surface.text.muted.lowContrast',
  hover: 'surface.text.subdued.lowContrast',
  focus: 'surface.text.subdued.lowContrast',
  active: 'surface.text.subdued.lowContrast',
  disabled: 'surface.text.placeholder.lowContrast',
} as const;

const selectedColor = {
  default: 'brand.primary.500',
  hover: 'brand.primary.600',
  focus: 'brand.primary.600',
  active: 'brand.primary.600',
  disabled: 'surface.text.placeholder.lowContrast',
} as const;

const StyledTabButton = styled.button<{
  size: TabsProps['size'];
  autoWidth?: TabsProps['autoWidth'];
}>(({ theme, size, autoWidth }) => {
  const isMobile = useIsMobile();
  const device = isMobile ? 'mobile' : 'desktop';

  return {
    width: autoWidth ? '100%' : undefined,
    appearance: 'none',
    border: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: autoWidth ? 'center' : 'left',
    gap: makeSpace(theme.spacing[3]),
    paddingTop: makeSpace(get(theme, paddings.top[device][size!])),
    paddingBottom: makeSpace(get(theme, paddings.bottom[device][size!])),
    paddingLeft: makeSpace(get(theme, paddings.left[device][size!])),
    paddingRight: makeSpace(get(theme, paddings.right[device][size!])),
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderBottomStyle: 'solid',
    borderBottomWidth: makeBorderSize(theme.border.width.thick),
    borderBottomColor: 'transparent',
    transform: 'translateY(1.5px)',
    '&:hover': {
      borderBottomColor: theme.colors.surface.border.normal.lowContrast,
    },
    '&:focus-visible': {
      borderRadius: makeSpace(theme.border.radius.medium),
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    },

    '*': {
      transitionProperty: 'color, fill',
      transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
      transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
    },
  };
});

const iconSizeMap = {
  medium: 'medium',
  large: 'large',
} as const;

const badgeSizeMap = {
  medium: 'small',
  large: 'medium',
} as const;

const counterSizeMap = {
  medium: 'small',
  large: 'small',
} as const;

const propRestrictionMap = {
  Badge: {
    medium: {
      size: badgeSizeMap.medium,
    },
    large: {
      size: badgeSizeMap.large,
    },
  },
  Counter: {
    medium: {
      size: counterSizeMap.medium,
    },
    large: {
      size: counterSizeMap.large,
    },
  },
} as const;

type TrailingComponents = keyof typeof propRestrictionMap;

const useTrailingRestriction = (
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

const TabsItem = ({
  children,
  value,
  leading,
  trailing,
  isDisabled,
}: TabsItemProps): React.ReactElement => {
  const { size, autoWidth, selectedValue, setSelectedValue, baseId } = useTabsContext();
  const { currentInteraction, ...interactionProps } = useInteraction();
  const validatedTrailingComponent = useTrailingRestriction(trailing, size!);
  const isSelected = selectedValue === value;
  const panelId = `${baseId}-${value}-tabpanel`;
  const tabItemId = `${baseId}-${value}-tabitem`;

  return (
    <CompositeItem
      render={
        <StyledTabButton
          autoWidth={autoWidth}
          id={tabItemId}
          size={size}
          {...interactionProps}
          onClick={() => {
            setSelectedValue(() => value);
          }}
          {...makeAccessible({
            role: 'tab',
            selected: isSelected,
            controls: panelId,
            disabled: isDisabled,
          })}
        >
          {leading
            ? React.cloneElement(leading as React.ReactElement, {
                size: iconSizeMap[size!],
                color: `surface.action.icon.${currentInteraction}.lowContrast`,
              })
            : null}
          <Text
            color={isSelected ? selectedColor[currentInteraction] : textColor[currentInteraction]}
            size={size === 'medium' ? 'medium' : 'large'}
            weight={size === 'medium' ? 'bold' : 'regular'}
          >
            {children}
          </Text>
          {validatedTrailingComponent}
        </StyledTabButton>
      }
    />
  );
};

export { TabsItem };
