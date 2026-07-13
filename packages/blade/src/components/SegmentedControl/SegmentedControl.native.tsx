import React from 'react';
import { View } from 'react-native';
import type { SegmentedControlProps } from './types';
import { SegmentedControlContext } from './SegmentedControlContext';
import { containerPadding, containerBorderRadius, gap } from './segmentedControlTokens';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { FormLabel, FormHint } from '~components/Form';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';

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
    accessibilityLabel,
    labelPosition = 'top',
    helpText,
    errorText,
    validationState = 'none',
    necessityIndicator = 'none',
    testID,
  }: SegmentedControlProps,
  ref: React.Ref<View>,
): React.ReactElement => {
  const { theme } = useTheme();

  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (val) => {
      onChange?.({ name, value: val });
    },
  });

  const baseId = useId('segmented-control');
  const labelId = `${baseId}-label`;
  const totalItems = React.Children.count(children);

  const contextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue,
      size,
      isDisabled,
      name,
      baseId,
      totalItems,
    }),
    [selectedValue, setSelectedValue, size, isDisabled, name, baseId, totalItems],
  );

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();
  const willRenderHintText =
    Boolean(helpText) || (validationState === 'error' && Boolean(errorText));

  const segmentedControlElement = (
    <View
      ref={ref}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: theme.colors.interactive.background.gray.faded,
        borderRadius: theme.border.radius[containerBorderRadius[size]],
        padding: getIn(theme, containerPadding[size]),
        gap: getIn(theme, gap[size]),
      }}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel || label || name}
      {...metaAttribute({ name: MetaConstants.SegmentedControl, testID })}
    >
      {children}
    </View>
  );

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <BaseBox
        display="flex"
        flexDirection={labelPosition === 'left' ? 'row' : 'column'}
        alignItems={labelPosition === 'left' ? 'center' : undefined}
      >
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
        <BaseBox flex={1}>
          {segmentedControlElement}
          {willRenderHintText ? (
            <FormHint
              size={size}
              type={validationState === 'error' ? 'error' : 'help'}
              errorText={errorText}
              helpText={helpText}
            />
          ) : null}
        </BaseBox>
      </BaseBox>
    </SegmentedControlContext.Provider>
  );
};

const SegmentedControl = React.forwardRef(_SegmentedControl);

export { SegmentedControl };
