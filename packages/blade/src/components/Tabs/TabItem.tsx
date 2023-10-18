/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import styled from 'styled-components';
import get from 'lodash/get';
import React from 'react';
import { CompositeItem } from '@floating-ui/react';
import type { TabItemProps, TabsProps } from './types';
import { useTabsContext } from './TabsContext';
import { backgroundColor, paddingY, paddingX, textColor } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { Text } from '~components/Typography';
import { castWebType, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import useInteraction from '~utils/useInteraction';
import { useIsMobile } from '~utils/useIsMobile';
import { makeAccessible } from '~utils/makeAccessible';

const StyledTabButton = styled.button<{
  size: TabsProps['size'];
  isFullWidthTabItem?: TabsProps['isFullWidthTabItem'];
  variant: NonNullable<TabsProps['variant']>;
  isVertical: boolean;
  isSelected: boolean;
}>(({ theme, isSelected, size, variant, isFullWidthTabItem, isVertical }) => {
  const isMobile = useIsMobile();
  const isFilled = variant === 'filled';
  const device = isMobile ? 'mobile' : 'desktop';
  const orientation = isVertical ? 'vertical' : 'horizontal';
  const border = isVertical ? 'borderLeft' : 'borderBottom';
  const selectedState = isSelected ? 'selected' : 'unselected';
  const _variant = variant === 'borderless' ? 'bordered' : variant;
  const background = backgroundColor[selectedState][_variant];

  const getColor = (value: string): string => {
    if (value === 'transparent') return 'transparent';
    return get(theme, value);
  };

  return {
    appearance: 'none',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isVertical ? 'left' : 'center',
    gap: makeSpace(theme.spacing[3]),
    width: isFullWidthTabItem ? '100%' : undefined,
    paddingTop: makeSpace(get(theme, paddingY[_variant][orientation][device][size!])),
    paddingBottom: makeSpace(get(theme, paddingY[_variant][orientation][device][size!])),
    paddingLeft: makeSpace(get(theme, paddingX[_variant][orientation][device][size!])),
    paddingRight: makeSpace(get(theme, paddingX[_variant][orientation][device][size!])),
    // colors
    backgroundColor:
      isSelected && isFilled && !isVertical ? 'transparent' : getColor(background.default),
    borderRadius: isFilled && !isVertical ? theme.border.radius.small : 0,
    [`${border}Style`]: 'solid',
    [`${border}Width`]: isFilled
      ? 0
      : makeBorderSize(isVertical ? theme.border.width.thick : theme.border.width.thin),
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
        isSelected && isFilled && !isVertical ? 'transparent' : getColor(background.hover),
    },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: getColor(background.disabled),
    },
    '&:focus-visible': {
      borderRadius: makeSpace(theme.border.radius.medium),
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      backgroundColor: getColor(background.focus),
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

const TabItem = ({
  children,
  value,
  leading,
  trailing,
  isDisabled = false,
}: TabItemProps): React.ReactElement => {
  const {
    size,
    isFullWidthTabItem,
    selectedValue,
    setSelectedValue,
    baseId,
    variant,
    isVertical,
  } = useTabsContext();
  const { currentInteraction, ...interactionProps } = useInteraction();
  const validatedTrailingComponent = useTabsItemPropRestriction(trailing, size!);
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
          isFullWidthTabItem={isFullWidthTabItem || isFilled}
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

export { TabItem };
