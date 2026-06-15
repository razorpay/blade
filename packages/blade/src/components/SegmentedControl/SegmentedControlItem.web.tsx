import React from 'react';
import styled from 'styled-components';
import type { SegmentedControlItemProps, SegmentedControlSize } from './types';
import { useSegmentedControlContext } from './SegmentedControlContext';
import {
  paddingX,
  paddingY,
  textSizeMap,
  iconSizeMap,
  itemBorderRadius,
} from './segmentedControlTokens';
import { Text } from '~components/Typography';
import { makeSpace, castWebType, makeMotionTime } from '~utils';
import useInteraction from '~utils/useInteraction';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';

const StyledSegmentedControlButton = styled.button<{
  $size: SegmentedControlSize;
  $isSelected: boolean;
}>(({ theme, $size, $isSelected }) => ({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: makeSpace(theme.spacing[3]),
  flex: 1,

  paddingTop: makeSpace(getIn(theme, paddingY[$size])),
  paddingBottom: makeSpace(getIn(theme, paddingY[$size])),
  paddingLeft: makeSpace(getIn(theme, paddingX[$size])),
  paddingRight: makeSpace(getIn(theme, paddingX[$size])),

  backgroundColor: 'transparent',
  borderRadius: (() => {
    const r = itemBorderRadius[$size];
    return typeof r === 'number' ? `${r}px` : makeSpace(theme.border.radius[r]);
  })(),

  position: 'relative' as const,
  zIndex: 1,

  transitionProperty: 'background-color',
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.gentle)),

  '&:hover:not(:disabled)': {
    backgroundColor: $isSelected ? 'transparent' : theme.colors.interactive.background.gray.default,
  },

  '&:focus-visible': {
    boxShadow: `inset 0px 0px 0px 4px ${theme.colors.surface.border.primary.muted}`,
  },

  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: 'transparent',
  },
  '&:disabled:hover': {
    backgroundColor: 'transparent',
  },
}));

const SegmentedControlItem = ({
  children,
  value,
  icon: Icon,
  isDisabled: isItemDisabled = false,
  testID,
}: SegmentedControlItemProps): React.ReactElement => {
  const {
    selectedValue,
    setSelectedValue,
    size,
    isDisabled: isGroupDisabled,
    baseId,
  } = useSegmentedControlContext();

  const { currentInteraction, ...interactionProps } = useInteraction();
  const isSelected = selectedValue === value;
  const isDisabled = isGroupDisabled || isItemDisabled;

  const textColor = isDisabled
    ? 'interactive.text.gray.disabled'
    : isSelected
    ? 'interactive.text.gray.normal'
    : 'interactive.text.gray.muted';
  const iconColor = isDisabled
    ? 'interactive.icon.gray.disabled'
    : isSelected
    ? 'interactive.icon.gray.normal'
    : 'interactive.icon.gray.muted';

  return (
    <StyledSegmentedControlButton
      type="button"
      id={`${baseId}-${value}-item`}
      $size={size}
      $isSelected={isSelected}
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          setSelectedValue(() => value);
        }
      }}
      {...interactionProps}
      {...makeAccessible({
        role: 'radio',
        checked: isSelected,
      })}
      {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
    >
      {Icon ? <Icon size={iconSizeMap[size]} color={iconColor} /> : null}
      {children ? (
        <Text as="span" color={textColor} size={textSizeMap[size]} weight="medium">
          {children}
        </Text>
      ) : null}
    </StyledSegmentedControlButton>
  );
};

export { SegmentedControlItem };
