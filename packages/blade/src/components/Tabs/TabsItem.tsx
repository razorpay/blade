/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
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
  bordered: {
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
  },
  filled: {
    top: {
      desktop: {
        medium: 'spacing.3',
        large: 'spacing.3',
      },
      mobile: {
        medium: 'spacing.2',
        large: 'spacing.2',
      },
    },
    bottom: {
      desktop: {
        medium: 'spacing.3',
        large: 'spacing.3',
      },
      mobile: {
        medium: 'spacing.2',
        large: 'spacing.2',
      },
    },
    left: {
      desktop: {
        medium: 'spacing.0',
        large: 'spacing.0',
      },
      mobile: {
        medium: 'spacing.0',
        large: 'spacing.0',
      },
    },
    right: {
      desktop: {
        medium: 'spacing.0',
        large: 'spacing.0',
      },
      mobile: {
        medium: 'spacing.0',
        large: 'spacing.0',
      },
    },
  },
} as const;

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

const backgroundColor = {
  unselected: {
    bordered: {
      default: 'transparent',
      hover: 'transparent',
      focus: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    filled: {
      default: 'transparent',
      hover: 'colors.brand.gray.a50.lowContrast',
      focus: 'colors.brand.gray.a50.lowContrast',
      active: 'colors.brand.gray.a50.lowContrast',
      disabled: 'transparent',
    },
  },
  selected: {
    bordered: {
      default: 'transparent',
      hover: 'transparent',
      focus: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    filled: {
      default: 'transparent',
      hover: 'transparent',
      focus: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
  },
} as const;

const StyledTabButton = styled.button<{
  size: TabsProps['size'];
  autoWidth?: TabsProps['autoWidth'];
  variant: NonNullable<TabsProps['variant']>;
  isSelected: boolean;
}>(({ theme, isSelected, size, variant, autoWidth }) => {
  const isMobile = useIsMobile();
  const device = isMobile ? 'mobile' : 'desktop';
  const selectedState = isSelected ? 'selected' : 'unselected';

  const getColor = (value: string): string => {
    if (value === 'transparent') return 'transparent';
    return get(theme, value);
  };

  return {
    width: autoWidth ? '100%' : undefined,
    appearance: 'none',
    border: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: autoWidth ? 'center' : 'left',
    cursor: 'pointer',
    gap: makeSpace(theme.spacing[3]),
    paddingTop: makeSpace(get(theme, paddings[variant].top[device][size!])),
    paddingBottom: makeSpace(get(theme, paddings[variant].bottom[device][size!])),
    paddingLeft: makeSpace(get(theme, paddings[variant].left[device][size!])),
    paddingRight: makeSpace(get(theme, paddings[variant].right[device][size!])),
    // colors
    backgroundColor: getColor(backgroundColor[selectedState][variant].default),
    borderRadius: variant === 'filled' ? theme.border.radius.small : 0,
    borderBottomStyle: 'solid',
    borderBottomWidth: variant === 'filled' ? 0 : makeBorderSize(theme.border.width.thick),
    borderBottomColor: 'transparent',

    // states
    '&:hover': {
      borderBottomColor: theme.colors.surface.border.normal.lowContrast,
      backgroundColor: getColor(backgroundColor[selectedState][variant].hover),
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
  const { size, autoWidth, selectedValue, setSelectedValue, baseId, variant } = useTabsContext();
  const { currentInteraction, ...interactionProps } = useInteraction();
  const validatedTrailingComponent = useTrailingRestriction(trailing, size!);
  const isSelected = selectedValue === value;
  const panelId = `${baseId}-${value}-tabpanel`;
  const tabItemId = `${baseId}-${value}-tabitem`;

  return (
    <CompositeItem
      render={
        <StyledTabButton
          isSelected={isSelected}
          variant={variant!}
          autoWidth={autoWidth || variant === 'filled'}
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
            color={
              isSelected
                ? selectedColor[isDisabled ? 'disabled' : currentInteraction]
                : textColor[isDisabled ? 'disabled' : currentInteraction]
            }
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
