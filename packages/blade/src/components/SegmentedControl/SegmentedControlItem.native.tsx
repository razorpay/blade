import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { SegmentedControlItemProps } from './types';
import { useSegmentedControlContext } from './SegmentedControlContext';
import { textColor, iconColor, textSizeMap, iconSizeMap } from './segmentedControlTokens';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  } = useSegmentedControlContext();

  const isDisabled = isGroupDisabled || isItemDisabled;
  const isSelected = selectedValue === value;
  const selectedState = isSelected ? 'selected' : 'unselected';
  const interaction = isDisabled ? 'disabled' : 'default';

  return (
    <Pressable
      style={styles.item}
      disabled={isDisabled}
      onPress={() => {
        if (!isDisabled) {
          setSelectedValue?.(value);
        }
      }}
      {...makeAccessible({
        role: 'radio',
        checked: isSelected,
        disabled: isDisabled,
      })}
      {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
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
      </Box>
    </Pressable>
  );
};

export { SegmentedControlItem };
