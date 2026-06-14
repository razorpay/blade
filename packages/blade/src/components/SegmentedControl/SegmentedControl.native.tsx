import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SegmentedControlProps, SegmentedControlItemProps } from './types';
import { SegmentedControlProvider } from './SegmentedControlContext';
import { useSegmentedControl } from './useSegmentedControl';
import {
  trackBackgroundColor,
  indicatorBorderRadius,
  textColor,
  iconColor,
  textSizeMap,
  iconSizeMap,
} from './segmentedControlTokens';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { FormHint, FormLabel } from '~components/Form';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import getIn from '~utils/lodashButBetter/get';

const nativeStyles = StyleSheet.create({
  track: {
    position: 'relative',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
  },
  itemContainer: {
    flex: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    zIndex: 1,
  },
});

const SegmentedControl = ({
  children,
  label,
  accessibilityLabel,
  labelPosition = 'top',
  value,
  defaultValue,
  onChange,
  name,
  isRequired = false,
  isDisabled = false,
  size = 'medium',
  isFullWidth = false,
  validationState = 'none',
  helpText,
  errorText,
  testID,
  ...rest
}: SegmentedControlProps): React.ReactElement => {
  const { contextValue, ids } = useSegmentedControl({
    value,
    defaultValue,
    onChange,
    name,
    isDisabled,
    size,
  });
  const { theme } = useTheme();

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();

  const items = React.Children.toArray(children) as React.ReactElement<SegmentedControlItemProps>[];
  const selectedIndex = items.findIndex((item) => item.props.value === contextValue.selectedValue);

  const [itemWidths, setItemWidths] = React.useState<number[]>([]);

  const handleItemLayout = React.useCallback((index: number, width: number) => {
    setItemWidths((prev) => {
      const next = [...prev];
      next[index] = width;
      return next;
    });
  }, []);

  const targetLeft = itemWidths.slice(0, selectedIndex).reduce((sum, w) => sum + w, 0);
  const targetWidth = itemWidths[selectedIndex] ?? 0;

  const animLeft = useSharedValue(targetLeft);
  const animWidth = useSharedValue(targetWidth);

  React.useEffect(() => {
    animLeft.value = withTiming(targetLeft, { duration: 200 });
    animWidth.value = withTiming(targetWidth, { duration: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLeft, targetWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: animLeft.value,
    width: animWidth.value,
  }));

  return (
    <SegmentedControlProvider value={contextValue}>
      <BaseBox {...getStyledProps(rest)}>
        <SelectorGroupField
          position={labelPosition}
          labelledBy={ids.labelId}
          accessibilityRole="radiogroup"
          componentName="segmented-control"
          testID={testID}
          {...makeAnalyticsAttribute(rest)}
        >
          {label ? (
            <FormLabel
              as="span"
              necessityIndicator={isRequired ? 'required' : 'none'}
              position={labelPosition}
              id={ids.labelId}
              accessibilityText={accessibilityText && `,${accessibilityText}`}
              size={size}
            >
              {label}
            </FormLabel>
          ) : null}
          <BaseBox>
            <View
              style={[
                nativeStyles.track,
                {
                  borderRadius: theme.border.radius.medium,
                  padding: theme.spacing[2],
                  backgroundColor: getIn(theme.colors, trackBackgroundColor),
                },
              ]}
              {...(accessibilityLabel ? makeAccessible({ label: accessibilityLabel }) : {})}
              {...metaAttribute({ name: MetaConstants.SegmentedControl, testID })}
            >
              {targetWidth > 0 ? (
                <Animated.View
                  style={[
                    nativeStyles.indicator,
                    {
                      top: theme.spacing[2],
                      bottom: theme.spacing[2],
                      backgroundColor: theme.colors.surface.background.gray.intense,
                      borderRadius: theme.border.radius[indicatorBorderRadius],
                    },
                    indicatorStyle,
                  ]}
                  {...metaAttribute({ name: MetaConstants.SegmentedControlIndicator })}
                />
              ) : null}
              {items.map((item, index) => {
                const itemValue = item.props.value;
                const itemLabel = item.props.label;
                const Icon = item.props.icon;
                const isItemDisabled = isDisabled || item.props.isDisabled;
                const isSelected = contextValue.selectedValue === itemValue;
                const selectedState = isSelected ? 'selected' : 'unselected';
                const interaction = isItemDisabled ? 'disabled' : 'default';

                return (
                  <Pressable
                    key={itemValue}
                    style={nativeStyles.item}
                    disabled={isItemDisabled}
                    onPress={() => contextValue.setSelectedValue?.(itemValue)}
                    onLayout={(e) => handleItemLayout(index, e.nativeEvent.layout.width)}
                    {...makeAccessible({
                      role: 'radio',
                      checked: isSelected,
                      disabled: isItemDisabled,
                    })}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap="spacing.2"
                      paddingY={size === 'large' ? 'spacing.3' : 'spacing.2'}
                      paddingX="spacing.3"
                    >
                      {Icon ? (
                        <Icon
                          size={iconSizeMap[size]}
                          color={iconColor[selectedState][interaction]}
                        />
                      ) : null}
                      <Text
                        color={textColor[selectedState][interaction]}
                        size={textSizeMap[size]}
                        weight="medium"
                      >
                        {itemLabel}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </View>
            <FormHint
              size={size}
              type={validationState === 'error' ? 'error' : 'help'}
              errorText={errorText}
              helpText={helpText}
            />
          </BaseBox>
        </SelectorGroupField>
      </BaseBox>
    </SegmentedControlProvider>
  );
};

export { SegmentedControl };
