import React from 'react';
import { chipGroupGapTokens, chipGroupLabelSizeTokens } from './chipTokens';
import { ChipGroupProvider } from './ChipGroupContext';
import { useChipGroup } from './useChipGroup';
import type { ChipGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { FormHint, FormLabel } from '~components/Form';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getStyledProps } from '~components/Box/styledProps';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import type { BladeElementRef } from '~utils/types';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _ChipGroup = (
  {
    accessibilityLabel,
    label,
    labelPosition = 'top',
    necessityIndicator = 'none',
    validationState = 'none',
    errorText,
    helpText,
    isRequired = false,
    children,
    isDisabled = false,
    name,
    defaultValue,
    onChange,
    value,
    size = 'small',
    color = 'primary',
    testID,
    selectionType = 'single',
    ...rest
  }: ChipGroupProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { contextValue, ids } = useChipGroup({
    defaultValue,
    onChange,
    value,
    isDisabled,
    name,
    size,
    color,
    selectionType,
    isRequired,
    validationState,
    necessityIndicator,
  });
  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();

  if (__DEV__) {
    if (selectionType === 'single' && Array.isArray(defaultValue)) {
      throwBladeError({
        moduleName: 'ChipGroup',
        message: `When "selectionType" is "single", the "defaultValue" prop must be a string value, but an array was provided.`,
      });
    }
    if (selectionType === 'single' && Array.isArray(value)) {
      throwBladeError({
        moduleName: 'ChipGroup',
        message: `When "selectionType" is "single", the "value" prop must be a string value, but an array was provided.`,
      });
    }
  }

  return (
    <ChipGroupProvider value={contextValue}>
      <BaseBox ref={ref as never} {...getStyledProps(rest)}>
        <SelectorGroupField
          position={labelPosition}
          accessibilityRole={selectionType === 'single' ? 'radiogroup' : 'group'}
          labelledBy={ids.labelId}
          componentName="chip-group"
          testID={testID}
          {...makeAnalyticsAttribute(rest)}
        >
          {label ? (
            <FormLabel
              as="span"
              necessityIndicator={necessityIndicator}
              position={labelPosition}
              id={ids.labelId}
              accessibilityText={accessibilityText && `,${accessibilityText}`}
              size={chipGroupLabelSizeTokens[size]}
            >
              {label}
            </FormLabel>
          ) : null}
          <BaseBox>
            <VisuallyHidden>
              <Text>{accessibilityLabel}</Text>
            </VisuallyHidden>
            <BaseBox display="flex" flexDirection="row" flexWrap="wrap">
              {React.Children.map(children, (child, index) => {
                return (
                  <BaseBox
                    key={index}
                    marginBottom={chipGroupGapTokens[size].bottom}
                    marginRight={chipGroupGapTokens[size].right}
                  >
                    {child}
                  </BaseBox>
                );
              })}
            </BaseBox>
            <FormHint
              size={chipGroupLabelSizeTokens[size]}
              type={validationState === 'error' ? 'error' : 'help'}
              errorText={errorText}
              helpText={helpText}
            />
          </BaseBox>
        </SelectorGroupField>
      </BaseBox>
    </ChipGroupProvider>
  );
};

const ChipGroup = React.forwardRef(_ChipGroup);

export { ChipGroup };
export type { ChipGroupProps };
