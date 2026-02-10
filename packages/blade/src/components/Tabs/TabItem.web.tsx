/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import styled from 'styled-components';
import React from 'react';
import { CompositeItem } from '@floating-ui/react';
import type { TabItemProps, TabsProps } from './types';
import { useTabsContext } from './TabsContext';
import {
  backgroundColor,
  paddingTop,
  paddingBottom,
  paddingX,
  textColor,
  iconColor,
  textSizeMap,
} from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { Text } from '~components/Typography';
import { castWebType, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import useInteraction from '~utils/useInteraction';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const StyledTabButton = styled.button<{
  size: TabsProps['size'];
  isFullWidthTabItem?: TabsProps['isFullWidthTabItem'];
  variant: NonNullable<TabsProps['variant']>;
  isVertical: boolean;
  isSelected: boolean;
}>(({ theme, isSelected, size, variant, isFullWidthTabItem, isVertical }) => {
  const isFilled = variant === 'filled';
  const orientation = isVertical ? 'vertical' : 'horizontal';
  const border = isVertical ? 'borderLeft' : 'borderBottom';
  const selectedState: 'selected' | 'unselected' = isSelected ? 'selected' : 'unselected';
  const _variant = variant === 'borderless' ? 'bordered' : variant;
  const background = backgroundColor[selectedState][_variant];

  return {
    appearance: 'none',
    textDecoration: 'none',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isVertical ? 'left' : 'center',
    gap: makeSpace(theme.spacing[3]),
    width: isFullWidthTabItem ? '100%' : undefined,

    // Padding
    paddingTop: makeSpace(getIn(theme, paddingTop[_variant][orientation][size!])),
    paddingBottom: makeSpace(getIn(theme, paddingBottom[_variant][orientation][size!])),
    paddingLeft: makeSpace(getIn(theme, paddingX[_variant][orientation][size!])),
    paddingRight: makeSpace(getIn(theme, paddingX[_variant][orientation][size!])),

    // colors
    backgroundColor:
      isSelected && isFilled && !isVertical ? 'transparent' : getIn(theme, background.default),
    borderRadius: isFilled
      ? size === 'small' && !isVertical
        ? theme.border.radius.medium
        : theme.border.radius.small
      : 0,
    [`${border}Style`]: 'solid',
    [`${border}Width`]: isFilled
      ? 0
      : makeBorderSize(isVertical ? theme.border.width.thick : theme.border.width.thicker),
    [`${border}Color`]:
      isVertical && isSelected
        ? theme.colors.interactive.border.neutral.highlighted
        : 'transparent',

    // states
    '&:hover': {
      [`${border}Color`]:
        isVertical && isSelected
          ? theme.colors.interactive.border.neutral.highlighted
          : isSelected
          ? 'transparent'
          : theme.colors.interactive.border.gray.highlighted,
      backgroundColor:
        // For selected filled tabs:
        // - Horizontal: use 'transparent' because the hover effect is handled by the TabIndicator
        // - Vertical: keep the same default background (white pill) so hover doesn't change it
        isSelected && isFilled
          ? isVertical
            ? getIn(theme, background.default)
            : 'transparent'
          : isSelected
          ? getIn(theme, background.default)
          : getIn(theme, background.highlighted),
    },
    '&:focus-visible': {
      borderRadius: isFilled
        ? size === 'small' && !isVertical
          ? makeSpace(theme.border.radius.medium)
          : makeSpace(theme.border.radius.small)
        : makeSpace(theme.border.radius.medium),
      boxShadow: `inset 0px 0px 0px 4px ${theme.colors.surface.border.primary.muted}`,
      backgroundColor: theme.colors.interactive.background.gray.default,
      [`${border}Color`]: 'transparent',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: getIn(theme, background.disabled),
      [`${border}Color`]: 'transparent',
    },
    '&:disabled:hover': {
      [`${border}Color`]: 'transparent',
      backgroundColor: getIn(theme, background.disabled),
    },

    // In horizontal filled tabs, the TabIndicator (the white pill background) is rendered
    // as an absolutely positioned sibling element AFTER the tab items in the DOM
    // (see TabList.web.tsx). Due to default stacking order, a later absolutely positioned
    // element paints on top of earlier siblings, which causes the indicator to visually
    // cover/hide the tab button's text and icon content.
    //
    // Setting `position: relative` + `zIndex: 1` on the tab button creates a new stacking
    // context that ensures the text and icon render ABOVE the indicator.
    //
    // Without this: the selected tab's text/icon will be invisible in horizontal filled
    // tabs because the white indicator sits on top of them.
    // This is not needed for vertical tabs because the TabIndicator is not rendered
    // in vertical orientation (see TabList.web.tsx line 104).
    ...(isFilled && !isVertical ? { position: 'relative' as const, zIndex: 1 } : {}),

    transitionProperty: 'all',
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.gentle)),
    '*': {
      transitionProperty: 'color, fill',
      transitionTimingFunction: castWebType(theme.motion.easing.standard),
      transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
    },
  };
});

const TabItem = ({
  children,
  value,
  leading: Leading,
  trailing,
  isDisabled = false,
  href,
  onClick,
  ...rest
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

  const interactionMap = {
    default: 'default',
    hover: 'highlighted',
    focus: 'highlighted',
    disabled: 'disabled',
  } as const;
  const interaction = isDisabled ? 'disabled' : interactionMap[currentInteraction];

  return (
    <CompositeItem
      render={
        <StyledTabButton
          type="button"
          as={href ? 'a' : 'button'}
          href={href}
          isVertical={isVertical}
          isSelected={isSelected}
          variant={variant!}
          isFullWidthTabItem={isFullWidthTabItem || isFilled}
          id={tabItemId}
          size={size}
          disabled={isDisabled}
          {...interactionProps}
          onClick={(e: React.MouseEvent) => {
            setSelectedValue?.(() => value);
            onClick?.(e);
          }}
          {...makeAccessible({
            role: 'tab',
            selected: isSelected,
            controls: panelId,
          })}
          {...metaAttribute({ name: MetaConstants.TabItem })}
          {...makeAnalyticsAttribute(rest)}
        >
          {Leading ? (
            <Leading size={iconSizeMap[size!]} color={iconColor[selectedState][interaction]} />
          ) : null}

          {children ? (
            <Text
              color={textColor[selectedState][interaction]}
              size={textSizeMap[size!]}
              weight="medium"
            >
              {children}
            </Text>
          ) : null}

          {validatedTrailingComponent}
        </StyledTabButton>
      }
    />
  );
};

export { TabItem };
