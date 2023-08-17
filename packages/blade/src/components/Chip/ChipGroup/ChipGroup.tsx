import React from 'react';
import { chipGroupGapTokens } from '../chipTokens';
import { ChipGroupProvider } from './ChipGroupContext';
import { useChipGroup } from './useChipGroup';
import type { ChipGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getStyledProps } from '~components/Box/styledProps';
import { isReactNative } from '~utils';
// import { useBreakpoint } from '~utils';

// import { useTheme } from '~components/BladeProvider';
// import { makeSize } from '~utils/makeSize';

const ChipGroup = ({
  children,
  isDisabled = false,
  name,
  defaultValue,
  onChange,
  value,
  size = 'small',
  variant = 'neutral',
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
    variant,
    selectionType,
  });
  // const { theme } = useTheme();
  // const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  // const gap = checkboxSizes.group.gap[size][matchedDeviceType];
  // const childCount = React.Children.count(children);

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
            <BaseBox display="flex" flexDirection="row">
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
