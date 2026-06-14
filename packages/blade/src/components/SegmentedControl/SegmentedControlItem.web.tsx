import React from 'react';
import styled from 'styled-components';
import type { SegmentedControlItemProps, SegmentedControlSize } from './types';
import { useSegmentedControlContext } from './SegmentedControlContext';
import { paddingX, paddingY, textSizeMap, iconSizeMap } from './segmentedControlTokens';
import { Text } from '~components/Typography';
import { makeSpace, castWebType, makeMotionTime } from '~utils';
import useInteraction from '~utils/useInteraction';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';

const StyledSegmentedControlButton = styled.button<{
  $size: SegmentedControlSize;
  $isSelected: boolean;
  $isFullWidth: boolean;
}>(({ theme, $size, $isSelected, $isFullWidth }) => ({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: makeSpace(theme.spacing[2]),
  flex: $isFullWidth ? 1 : undefined,

  paddingTop: makeSpace(getIn(theme, paddingY[$size])),
  paddingBottom: makeSpace(getIn(theme, paddingY[$size])),
  paddingLeft: makeSpace(getIn(theme, paddingX[$size])),
  paddingRight: makeSpace(getIn(theme, paddingX[$size])),

  backgroundColor: $isSelected ? theme.colors.surface.background.gray.moderate : 'transparent',
  borderRadius: makeSpace(theme.border.radius.small),
  boxShadow: $isSelected ? `0px 1px 2px ${theme.colors.surface.border.gray.muted}` : 'none',

  transitionProperty: 'background-color, box-shadow',
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),

  '&:hover:not(:disabled)': {
    backgroundColor: $isSelected
      ? theme.colors.surface.background.gray.moderate
      : theme.colors.interactive.background.gray.highlighted,
  },

  '&:focus-visible': {
    boxShadow: `0px 0px 0px 2px ${theme.colors.surface.border.primary.muted}`,
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.4,
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
    isFullWidth,
  } = useSegmentedControlContext();

  const { currentInteraction, ...interactionProps } = useInteraction();
  const isSelected = selectedValue === value;
  const isDisabled = isGroupDisabled || isItemDisabled;

  const textColor = isSelected ? 'surface.text.gray.normal' : 'surface.text.gray.muted';

  const iconColor = isSelected ? 'surface.icon.gray.normal' : 'surface.icon.gray.muted';

  return (
    <StyledSegmentedControlButton
      type="button"
      $size={size}
      $isSelected={isSelected}
      $isFullWidth={isFullWidth}
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
        <Text
          as="span"
          color={textColor}
          size={textSizeMap[size]}
          weight={isSelected ? 'semibold' : 'medium'}
        >
          {children}
        </Text>
      ) : null}
    </StyledSegmentedControlButton>
  );
};

export { SegmentedControlItem };
