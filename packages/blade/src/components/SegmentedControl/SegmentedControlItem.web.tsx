import React from 'react';
import styled from 'styled-components';
import { CompositeItem } from '@floating-ui/react';
import type { SegmentedControlItemProps, SegmentedControlSize } from './types';
import { useSegmentedControlContext } from './SegmentedControlContext';
import {
  paddingTop,
  paddingBottom,
  paddingX,
  textColor,
  iconColor,
  itemBackgroundColor,
  itemBorderRadius,
  textSizeMap,
  iconSizeMap,
} from './segmentedControlTokens';
import { Text } from '~components/Typography';
import { castWebType, makeMotionTime, makeSpace } from '~utils';
import useInteraction from '~utils/useInteraction';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import getIn from '~utils/lodashButBetter/get';

const StyledSegmentedButton = styled.button<{
  size: SegmentedControlSize;
  isSelected: boolean;
  isFullWidth?: boolean;
}>(({ theme, size, isFullWidth }) => {
  const background = itemBackgroundColor.unselected;
  const borderRadius = itemBorderRadius[size];

  return {
    appearance: 'none',
    textDecoration: 'none',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: makeSpace(theme.spacing[2]),
    width: isFullWidth ? '100%' : undefined,
    flex: isFullWidth ? 1 : undefined,

    paddingTop: makeSpace(getIn(theme, paddingTop[size])),
    paddingBottom: makeSpace(getIn(theme, paddingBottom[size])),
    paddingLeft: makeSpace(getIn(theme, paddingX[size])),
    paddingRight: makeSpace(getIn(theme, paddingX[size])),

    backgroundColor: getIn(theme, background.default),
    borderRadius: theme.border.radius[borderRadius],

    position: 'relative' as const,
    zIndex: 1,

    '&:hover': {
      backgroundColor: getIn(theme, background.highlighted),
    },
    '&:focus-visible': {
      borderRadius: makeSpace(theme.border.radius[borderRadius]),
      boxShadow: `inset 0px 0px 0px 4px ${theme.colors.surface.border.primary.muted}`,
      backgroundColor: theme.colors.interactive.background.gray.default,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: getIn(theme, background.disabled),
    },
    '&:disabled:hover': {
      backgroundColor: getIn(theme, background.disabled),
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

const SegmentedControlItem = ({
  value,
  label,
  icon: Icon,
  isDisabled: isItemDisabled = false,
  testID,
  ...rest
}: SegmentedControlItemProps): React.ReactElement => {
  const {
    size = 'medium',
    isDisabled: isGroupDisabled,
    selectedValue,
    setSelectedValue,
    baseId,
  } = useSegmentedControlContext();

  const { currentInteraction, ...interactionProps } = useInteraction();
  const isDisabled = isGroupDisabled || isItemDisabled;
  const isSelected = selectedValue === value;
  const selectedState = isSelected ? 'selected' : 'unselected';
  const itemId = `${baseId}-${value}-item`;

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
        <StyledSegmentedButton
          type="button"
          id={itemId}
          size={size}
          isSelected={isSelected}
          isFullWidth={true}
          disabled={isDisabled}
          {...interactionProps}
          onClick={() => {
            if (!isDisabled) {
              setSelectedValue?.(value);
            }
          }}
          {...makeAccessible({
            role: 'radio',
            checked: isSelected,
          })}
          {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
          {...makeAnalyticsAttribute(rest)}
        >
          {Icon ? (
            <Icon size={iconSizeMap[size]} color={iconColor[selectedState][interaction]} />
          ) : null}
          <Text
            color={textColor[selectedState][interaction]}
            size={textSizeMap[size]}
            weight="medium"
          >
            {label}
          </Text>
        </StyledSegmentedButton>
      }
    />
  );
};

export { SegmentedControlItem };
