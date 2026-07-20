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
  itemHeight,
} from './segmentedControlTokens';
import { Text } from '~components/Typography';
import { makeSpace, castWebType, makeMotionTime } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import getIn from '~utils/lodashButBetter/get';

const StyledSegmentedControlButton = styled.button<{
  $size: SegmentedControlSize;
  $isSelected: boolean;
}>(({ theme, $size, $isSelected }) => ({
  appearance: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: makeSpace(theme.spacing[3]),
  flex: 1,
  height: makeSpace(itemHeight[$size]),

  paddingTop: makeSpace(getIn(theme, paddingY[$size])),
  paddingBottom: makeSpace(getIn(theme, paddingY[$size])),
  paddingLeft: makeSpace(getIn(theme, paddingX[$size])),
  paddingRight: makeSpace(getIn(theme, paddingX[$size])),

  backgroundColor: 'transparent',
  borderRadius: makeSpace(theme.border.radius[itemBorderRadius[$size]]),

  position: 'relative' as const,
  zIndex: 1,

  transitionProperty: 'background-color',
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.gentle)),

  '&:hover:not(:disabled)': {
    backgroundColor: $isSelected ? 'transparent' : theme.colors.interactive.background.gray.default,
  },

  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },

  '&:focus-visible': {
    outline: 'none',
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
  leading: Leading,
  isDisabled: isItemDisabled = false,
  accessibilityLabel,
  testID,
  ...rest
}: SegmentedControlItemProps): React.ReactElement => {
  const {
    selectedValue,
    setSelectedValue,
    size,
    isDisabled: isGroupDisabled,
    baseId,
    totalItems,
    firstEnabledValue,
    itemRefs,
  } = useSegmentedControlContext();

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const isSelected = selectedValue === value;
  const isDisabled = isGroupDisabled || isItemDisabled;

  const shouldReceiveFocus =
    (!isDisabled && isSelected) ||
    (selectedValue === undefined && !isDisabled && value === firstEnabledValue);

  React.useEffect(() => {
    if (!itemRefs) return undefined;
    const map = itemRefs.current;
    const node = buttonRef.current;
    if (node) map.set(value, node);
    return () => {
      map.delete(value);
    };
  }, [value, itemRefs]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const container = buttonRef.current?.closest('[role="radiogroup"]');
      if (!container) return;

      const buttons = Array.from(
        container.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'),
      );
      const currentIndex = buttons.indexOf(buttonRef.current!);
      let nextIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % buttons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        const nextEl = buttons[nextIndex];
        nextEl.focus();
        setSelectedValue(() => nextEl.dataset.value ?? '');
      }
    },
    [setSelectedValue],
  );

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
      ref={buttonRef}
      type="button"
      id={`${baseId}-${value}-item`}
      data-value={value}
      tabIndex={shouldReceiveFocus ? 0 : -1}
      $size={size}
      $isSelected={isSelected}
      disabled={isDisabled}
      onClick={() => {
        setSelectedValue(() => value);
      }}
      onKeyDown={handleKeyDown}
      {...makeAccessible({
        role: 'radio',
        checked: isSelected,
        label: accessibilityLabel,
        setSize: totalItems,
      })}
      {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {Leading ? <Leading size={iconSizeMap[size]} color={iconColor} /> : null}
      {children ? (
        <Text as="span" color={textColor} size={textSizeMap[size]} weight="medium">
          {children}
        </Text>
      ) : null}
    </StyledSegmentedControlButton>
  );
};

export { SegmentedControlItem };
