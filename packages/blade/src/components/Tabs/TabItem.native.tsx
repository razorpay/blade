/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import styled from 'styled-components';
import get from 'lodash/get';
import type React from 'react';
import { Pressable } from 'react-native';
import type { TabItemProps, TabsProps } from './types';
import { useTabsContext } from './TabsContext';
import { backgroundColor, paddings, textColor } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { Text } from '~components/Typography';
import { castWebType, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { useIsMobile } from '~utils/useIsMobile';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';

const StyledTabButton = styled(BaseBox)<{
  size: TabsProps['size'];
  autoWidth?: TabsProps['autoWidth'];
  variant: NonNullable<TabsProps['variant']>;
  isVertical: boolean;
  isSelected: boolean;
}>(({ theme, isSelected, size, variant, autoWidth, isVertical }) => {
  const isFilled = variant === 'filled';
  const device = 'mobile';
  const orientation = isVertical ? 'vertical' : 'horizontal';
  const border = isVertical ? 'borderLeft' : 'borderBottom';
  const selectedState = isSelected ? 'selected' : 'unselected';
  const background = backgroundColor[selectedState][variant];

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
    flexDirection: 'row',
    justifyContent: isVertical ? 'left' : 'center',
    gap: makeSpace(theme.spacing[3]),
    width: autoWidth ? '100%' : undefined,
    paddingTop: makeSpace(get(theme, paddings[variant][orientation][device].top[size!])),
    paddingBottom: makeSpace(get(theme, paddings[variant][orientation][device].bottom[size!])),
    paddingLeft: makeSpace(get(theme, paddings[variant][orientation][device].left[size!])),
    paddingRight: makeSpace(get(theme, paddings[variant][orientation][device].right[size!])),
    // colors
    backgroundColor:
      isSelected && isFilled && !isVertical ? 'transparent' : getColor(background.default),
    borderRadius: isFilled && !isVertical ? theme.border.radius.small : 0,
    [`${border}Style`]: 'solid',
    [`${border}Width`]: isFilled ? 0 : makeBorderSize(theme.border.width.thick),
    [`${border}Color`]: isVertical && isSelected ? theme.colors.brand.primary[500] : 'transparent',
    // states
    // '&:hover': {
    //   [`${border}Color`]:
    //     isVertical && isSelected
    //       ? theme.colors.brand.primary[500]
    //       : theme.colors.surface.border.normal.lowContrast,
    //   backgroundColor:
    //     // Don't want to show hover state on filled tabs when vertical because
    //     // The hover color needs to be on the TabIndicator instead.
    //     isSelected && isFilled && !isVertical ? 'transparent' : getColor(background.hover),
    // },
    // '&:disabled': {
    //   cursor: 'not-allowed',
    //   backgroundColor: getColor(background.disabled),
    // },
    // '&:focus-visible': {
    //   borderRadius: makeSpace(theme.border.radius.medium),
    //   boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    //   backgroundColor: getColor(background.focus),
    // },

    // transitionProperty: 'all',
    // transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
    // transitionDuration: castWebType(makeMotionTime(theme.motion.duration.gentle)),
    // '*': {
    //   transitionProperty: 'color, fill',
    //   transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
    //   transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
    // },
  };
});

const TabItem = ({
  children,
  value,
  leading,
  trailing,
  isDisabled = false,
}: TabItemProps): React.ReactElement => {
  return <></>;
};

export { TabItem, StyledTabButton };
