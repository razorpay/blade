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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const paddingMap = {
  small: { paddingVertical: 4, paddingHorizontal: 12 },
  medium: { paddingVertical: 8, paddingHorizontal: 12 },
  large: { paddingVertical: 12, paddingHorizontal: 12 },
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
          gap: theme.spacing[3],
          borderRadius: size === 'small' ? 6 : theme.border.radius.small,
          backgroundColor: isSelected
            ? theme.colors.surface.background.gray.intense
            : 'transparent',
        },
      ]}
      {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
    >
      {Icon ? <Icon size={iconSizeMap[size]} color={iconColor} /> : null}
      {children ? (
        <Text color={textColor} size={textSizeMap[size]} weight="medium">
          {children}
        </Text>
      ) : null}
    </Pressable>
  );
};

export { SegmentedControlItem };
