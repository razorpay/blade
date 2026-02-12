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
  borderWidth as borderWidthToken,
  borderRadius as borderRadiusToken,
  focusBorderRadius as focusBorderRadiusToken,
  borderColor as borderColorToken,
  needsStackingContext,
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
  const orientation = isVertical ? 'vertical' : 'horizontal';
  const border = isVertical ? 'borderLeft' : 'borderBottom';
  const selectedState = isSelected ? 'selected' : 'unselected';
  const _variant = variant === 'borderless' ? 'bordered' : variant;

  const background = backgroundColor[selectedState][_variant][orientation];
  const borderColor = borderColorToken[selectedState][_variant][orientation];
  const borderWidth = borderWidthToken[_variant][orientation];
  const borderRadius = borderRadiusToken[_variant][orientation][size!];
  const focusBorderRadius = focusBorderRadiusToken[_variant][orientation][size!];

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

    // Colors & border
    backgroundColor: getIn(theme, background.default),
    borderRadius: borderRadius === 'none' ? 0 : theme.border.radius[borderRadius],
    [`${border}Style`]: 'solid',
    [`${border}Width`]:
      borderWidth === 'none' ? 0 : makeBorderSize(theme.border.width[borderWidth]),
    [`${border}Color`]: getIn(theme, borderColor.default),

    // States
    '&:hover': {
      [`${border}Color`]: getIn(theme, borderColor.highlighted),
      backgroundColor: getIn(theme, background.highlighted),
    },
    '&:focus-visible': {
      borderRadius: makeSpace(theme.border.radius[focusBorderRadius]),
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

    ...(needsStackingContext[_variant][orientation]
      ? { position: 'relative' as const, zIndex: 1 }
      : {}),

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
