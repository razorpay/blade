/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import styled from 'styled-components';
import React from 'react';
import { CompositeItem } from '@floating-ui/react';
import type { TabItemProps, TabsProps } from './types';
import { useTabsContext } from './TabsContext';
import { backgroundColor, paddingY, paddingX, textColor, iconColor } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { Text } from '~components/Typography';
import { castWebType, getMediaQuery, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import useInteraction from '~utils/useInteraction';
import { makeAccessible } from '~utils/makeAccessible';
import { breakpoints } from '~tokens/global';
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
    paddingTop: makeSpace(getIn(theme, paddingY[_variant][orientation].desktop[size!])),
    paddingBottom: makeSpace(getIn(theme, paddingY[_variant][orientation].desktop[size!])),
    paddingLeft: makeSpace(getIn(theme, paddingX[_variant][orientation].desktop[size!])),
    paddingRight: makeSpace(getIn(theme, paddingX[_variant][orientation].desktop[size!])),

    [`@media ${getMediaQuery({ min: breakpoints.base, max: breakpoints.m })}`]: {
      paddingTop: makeSpace(getIn(theme, paddingY[_variant][orientation].mobile[size!])),
      paddingBottom: makeSpace(getIn(theme, paddingY[_variant][orientation].mobile[size!])),
      paddingLeft: makeSpace(getIn(theme, paddingX[_variant][orientation].mobile[size!])),
      paddingRight: makeSpace(getIn(theme, paddingX[_variant][orientation].mobile[size!])),
    },

    // colors
    backgroundColor:
      isSelected && isFilled && !isVertical ? 'transparent' : getIn(theme, background.default),
    borderRadius: isFilled && !isVertical ? theme.border.radius.small : 0,
    [`${border}Style`]: 'solid',
    [`${border}Width`]: isFilled
      ? 0
      : makeBorderSize(isVertical ? theme.border.width.thick : theme.border.width.thin),
    [`${border}Color`]:
      isVertical && isSelected ? theme.colors.interactive.border.primary.default : 'transparent',

    // states
    '&:hover': {
      [`${border}Color`]:
        isVertical && isSelected
          ? theme.colors.interactive.border.primary.default
          : theme.colors.interactive.border.gray.highlighted,
      backgroundColor:
        // Don't want to show hover state on filled tabs when vertical because
        // The hover color needs to be on the TabIndicator instead.
        isSelected && isFilled && !isVertical
          ? 'transparent'
          : getIn(theme, background.highlighted),
    },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: getIn(theme, background.disabled),
    },
    '&:focus-visible': {
      borderRadius: makeSpace(theme.border.radius.medium),
      boxShadow: `0px 0px 0px 4px ${theme.colors.surface.border.primary.muted}`,
      backgroundColor: getIn(theme, background.highlighted),
    },

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
          <Text
            color={textColor[selectedState][interaction]}
            size={size === 'medium' ? 'medium' : 'large'}
            weight="semibold"
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
