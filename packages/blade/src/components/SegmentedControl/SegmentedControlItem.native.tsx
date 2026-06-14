import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { SegmentedControlItemProps } from './types';
import { useSegmentedControlContext } from './SegmentedControlContext';
import { textSizeMap, iconSizeMap } from './segmentedControlTokens';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const paddingMap = {
  small: { paddingVertical: 4, paddingHorizontal: 12 },
  medium: { paddingVertical: 8, paddingHorizontal: 16 },
  large: { paddingVertical: 12, paddingHorizontal: 20 },
} as const;

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
  const { theme } = useTheme();

  const isSelected = selectedValue === value;
  const isDisabled = isGroupDisabled || isItemDisabled;

  const textColor = isSelected ? 'surface.text.gray.normal' : 'surface.text.gray.muted';
  const iconColor = isSelected ? 'surface.icon.gray.normal' : 'surface.icon.gray.muted';

  return (
    <Pressable
      onPress={() => {
        if (!isDisabled) {
          setSelectedValue(() => value);
        }
      }}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
      style={[
        styles.button,
        paddingMap[size],
        {
          gap: theme.spacing[2],
          borderRadius: theme.border.radius.small,
          backgroundColor: isSelected
            ? theme.colors.surface.background.gray.moderate
            : 'transparent',
          opacity: isDisabled ? 0.4 : 1,
        },
        isFullWidth && { flex: 1 },
      ]}
      {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
    >
      {Icon ? <Icon size={iconSizeMap[size]} color={iconColor} /> : null}
      {children ? (
        <Text
          color={textColor}
          size={textSizeMap[size]}
          weight={isSelected ? 'semibold' : 'medium'}
        >
          {children}
        </Text>
      ) : null}
    </Pressable>
  );
};

export { SegmentedControlItem };
