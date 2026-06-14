import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { SegmentedControlProps } from './types';
import { SegmentedControlContext } from './SegmentedControlContext';
import { useControllableState } from '~utils/useControllable';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const _SegmentedControl = (
  {
    children,
    defaultValue,
    value,
    onChange,
    size = 'medium',
    isFullWidth = false,
    isDisabled = false,
    name,
    testID,
  }: SegmentedControlProps,
  _ref: React.Ref<unknown>,
): React.ReactElement => {
  const { theme } = useTheme();

  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (val) => {
      onChange?.(val);
    },
  });

  const contextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue,
      size,
      isDisabled,
      isFullWidth,
      name,
    }),
    [selectedValue, setSelectedValue, size, isDisabled, isFullWidth, name],
  );

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface.background.gray.subtle,
            borderRadius: theme.border.radius.medium,
            padding: theme.spacing[1],
            gap: theme.spacing[1],
          },
          isFullWidth && { alignSelf: 'stretch' },
        ]}
        accessibilityRole="radiogroup"
        accessibilityLabel={name}
        {...metaAttribute({ name: MetaConstants.SegmentedControl, testID })}
      >
        {children}
      </View>
    </SegmentedControlContext.Provider>
  );
};

const SegmentedControl = React.forwardRef(_SegmentedControl);

export { SegmentedControl };
