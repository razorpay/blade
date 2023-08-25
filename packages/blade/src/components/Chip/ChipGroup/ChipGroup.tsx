import React from 'react';
import { chipGroupGapTokens } from '../chipTokens';
import { ChipGroupProvider } from './ChipGroupContext';
import { useChipGroup } from './useChipGroup';
import type { ChipGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getStyledProps } from '~components/Box/styledProps';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { throwBladeError } from '~utils/logger';

const ChipGroup = ({
  accessibilityLabel,
  children,
  isDisabled = false,
  name,
  defaultValue,
  onChange,
  value,
  size = 'small',
  intent = 'none',
  testID,
  selectionType = 'single',
  ...styledProps
}: ChipGroupProps): React.ReactElement => {
  const { contextValue, ids } = useChipGroup({
    defaultValue,
    onChange,
    value,
    isDisabled,
    name,
    size,
    intent,
    selectionType,
  });

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
      <BaseBox {...getStyledProps(styledProps)}>
        <SelectorGroupField
          accessibilityRole={isReactNative() && selectionType === 'single' ? 'radiogroup' : 'group'}
          labelledBy={ids.labelId}
          componentName="chip-group"
          testID={testID}
        >
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
          </BaseBox>
        </SelectorGroupField>
      </BaseBox>
    </ChipGroupProvider>
  );
};

export { ChipGroup };
export type { ChipGroupProps };
