import React from 'react';
import { Pressable } from 'react-native';
import type { SegmentedControlItemProps } from './types';
import { useSegmentedControlContext } from './SegmentedControlContext';
import {
  paddingX,
  paddingY,
  textSizeMap,
  iconSizeMap,
  itemBorderRadius,
} from './segmentedControlTokens';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';

const SegmentedControlItem = ({
  children,
  value,
  leading: Leading,
  isDisabled: isItemDisabled = false,
  accessibilityLabel,
  testID,
}: SegmentedControlItemProps): React.ReactElement => {
  const {
    selectedValue,
    setSelectedValue,
    size,
    isDisabled: isGroupDisabled,
  } = useSegmentedControlContext();
  const { theme } = useTheme();

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

  const radiusValue =
    typeof itemBorderRadius[size] === 'number'
      ? itemBorderRadius[size]
      : theme.border.radius[itemBorderRadius[size]];

  return (
    <Pressable
      onPress={() => {
        if (!isDisabled) {
          setSelectedValue(() => value);
        }
      }}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing[3],
        paddingVertical: getIn(theme, paddingY[size]),
        paddingHorizontal: getIn(theme, paddingX[size]),
        borderRadius: radiusValue,
        backgroundColor: isSelected ? theme.colors.surface.background.gray.intense : 'transparent',
      }}
      {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
    >
      {Leading ? <Leading size={iconSizeMap[size]} color={iconColor} /> : null}
      {children ? (
        <Text color={textColor} size={textSizeMap[size]} weight="medium">
          {children}
        </Text>
      ) : null}
    </Pressable>
  );
};

export { SegmentedControlItem };
