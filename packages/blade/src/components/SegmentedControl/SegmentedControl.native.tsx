import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { SegmentedControlProps } from './types';
import { SegmentedControlContext } from './SegmentedControlContext';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { FormLabel, FormHint } from '~components/Form';
import BaseBox from '~components/Box/BaseBox';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});

const _SegmentedControl = (
  {
    children,
    defaultValue,
    value,
    onChange,
    size = 'medium',
    isDisabled = false,
    name,
    label,
    labelPosition = 'top',
    helpText,
    errorText,
    validationState = 'none',
    necessityIndicator = 'none',
    isRequired = false,
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

  const baseId = useId('segmented-control');
  const labelId = `${baseId}-label`;

  const contextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue,
      size,
      isDisabled,
      name,
      baseId,
    }),
    [selectedValue, setSelectedValue, size, isDisabled, name, baseId],
  );

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();

  const segmentedControlElement = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.interactive.background.gray.faded,
          borderRadius: theme.border.radius[size === 'small' ? 'small' : 'medium'],
          padding: theme.spacing[size === 'small' ? 1 : 2],
          gap: theme.spacing[1],
        },
      ]}
      accessibilityRole="radiogroup"
      accessibilityLabel={name}
      {...metaAttribute({ name: MetaConstants.SegmentedControl, testID })}
    >
      {children}
    </View>
  );

  if (!label && !helpText && !errorText) {
    return (
      <SegmentedControlContext.Provider value={contextValue}>
        {segmentedControlElement}
      </SegmentedControlContext.Provider>
    );
  }

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <BaseBox display="flex" flexDirection="column">
        {label ? (
          <FormLabel
            as="span"
            necessityIndicator={necessityIndicator}
            position={labelPosition}
            id={labelId}
            accessibilityText={accessibilityText && `,${accessibilityText}`}
            size={size}
          >
            {label}
          </FormLabel>
        ) : null}
        <BaseBox>
          {segmentedControlElement}
          <FormHint
            size={size}
            type={validationState === 'error' ? 'error' : 'help'}
            errorText={errorText}
            helpText={helpText}
          />
        </BaseBox>
      </BaseBox>
    </SegmentedControlContext.Provider>
  );
};

const SegmentedControl = React.forwardRef(_SegmentedControl);

export { SegmentedControl };
