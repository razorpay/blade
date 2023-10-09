/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import styled from 'styled-components';
import get from 'lodash/get';
import React from 'react';
import { CompositeItem } from '@floating-ui/react';
import type { TabsItemProps, TabsProps } from './types';
import { useTabsContext } from './TabsContext';
import { backgroundColor, paddings, textColor } from './tabTokens';
import { Text } from '~components/Typography';
import { castWebType, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import useInteraction from '~utils/useInteraction';
import { useIsMobile } from '~utils/useIsMobile';
import { logger, throwBladeError } from '~utils/logger';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

const StyledTabButton = styled.button<{
  size: TabsProps['size'];
  autoWidth?: TabsProps['autoWidth'];
  variant: NonNullable<TabsProps['variant']>;
  isVertical: boolean;
  isSelected: boolean;
}>(({ theme, isSelected, size, variant, autoWidth, isVertical }) => {
  const isMobile = useIsMobile();
  const device = isMobile ? 'mobile' : 'desktop';
  const orientation = isVertical ? 'vertical' : 'horizontal';
  const selectedState = isSelected ? 'selected' : 'unselected';
  const isFilled = variant === 'filled';

  const getColor = (value: string): string => {
    if (value === 'transparent') return 'transparent';
    return get(theme, value);
  };

  const border = isVertical ? 'borderLeft' : 'borderBottom';

  return {
    width: autoWidth ? '100%' : undefined,
    appearance: 'none',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: autoWidth && !isVertical ? 'center' : 'left',
    gap: makeSpace(theme.spacing[3]),
    paddingTop: makeSpace(get(theme, paddings[variant][orientation][device].top[size!])),
    paddingBottom: makeSpace(get(theme, paddings[variant][orientation][device].bottom[size!])),
    paddingLeft: makeSpace(get(theme, paddings[variant][orientation][device].left[size!])),
    paddingRight: makeSpace(get(theme, paddings[variant][orientation][device].right[size!])),
    // colors
    backgroundColor:
      isSelected && isFilled && !isVertical
        ? 'transparent'
        : getColor(backgroundColor[selectedState][variant].default),
    borderRadius: isFilled && !isVertical ? theme.border.radius.small : 0,
    [`${border}Style`]: 'solid',
    [`${border}Width`]: isFilled ? 0 : makeBorderSize(theme.border.width.thick),
    [`${border}Color`]: isVertical && isSelected ? theme.colors.brand.primary[500] : 'transparent',

    // states
    '&:hover': {
      [`${border}Color`]:
        isVertical && isSelected
          ? theme.colors.brand.primary[500]
          : theme.colors.surface.border.normal.lowContrast,
      backgroundColor:
        // Don't want to show hover state on filled tabs when vertical because
        // The hover color needs to be on the TabIndicator instead.
        isSelected && isFilled && !isVertical
          ? 'transparent'
          : getColor(backgroundColor[selectedState][variant].hover),
    },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: getColor(backgroundColor[selectedState][variant].disabled),
    },
    '&:focus-visible': {
      borderRadius: makeSpace(theme.border.radius.medium),
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      backgroundColor: getColor(backgroundColor[selectedState][variant].focus),
    },

    transitionProperty: 'all',
    transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.gentle)),
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
  isDisabled = false,
}: TabsItemProps): React.ReactElement => {
  const {
    size,
    autoWidth,
    selectedValue,
    setSelectedValue,
    baseId,
    variant,
    isVertical,
  } = useTabsContext();
  const { currentInteraction, ...interactionProps } = useInteraction();
  const validatedTrailingComponent = useTrailingRestriction(trailing, size!);
  const isSelected = selectedValue === value;
  const selectedState = isSelected ? 'selected' : 'unselected';
  const panelId = `${baseId}-${value}-tabpanel`;
  const tabItemId = `${baseId}-${value}-tabitem`;
  const isFilled = variant === 'filled';

  return (
    <CompositeItem
      render={
        <StyledTabButton
          isVertical={isVertical}
          isSelected={isSelected}
          variant={variant!}
          autoWidth={autoWidth || isFilled}
          id={tabItemId}
          size={size}
          disabled={isDisabled}
          {...interactionProps}
          onClick={() => {
            setSelectedValue(() => value);
          }}
          {...makeAccessible({
            role: 'tab',
            selected: isSelected,
            controls: panelId,
          })}
        >
          {leading
            ? React.cloneElement(leading as React.ReactElement, {
                size: iconSizeMap[size!],
                color: `surface.action.icon.${currentInteraction}.lowContrast`,
              })
            : null}
          <Text
            color={textColor[selectedState][isDisabled ? 'disabled' : currentInteraction]}
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
