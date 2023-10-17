import React from 'react';
import type { TabsProps } from './types';
import { TabsContext } from './TabsContext';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import BaseBox from '~components/Box/BaseBox';

const Tabs = ({
  children,
  defaultValue,
  value,
  onChange,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'bordered',
  isFullWidthTabItem = false,
  isLazy = false,
}: TabsProps): React.ReactElement => {
  const baseId = useId('tabs');
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (value) => {
      onChange?.(value);
    },
  });

  const isVertical = orientation === 'vertical';
  const contextValue = React.useMemo(
    () => ({
      baseId,
      selectedValue,
      isVertical,
      size,
      variant,
      isFullWidthTabItem,
      setSelectedValue,
      isLazy,
    }),
    [
      isFullWidthTabItem,
      baseId,
      isVertical,
      selectedValue,
      setSelectedValue,
      size,
      variant,
      isLazy,
    ],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <BaseBox display="flex" flexDirection={isVertical ? 'row' : 'column'}>
        {children}
      </BaseBox>
    </TabsContext.Provider>
  );
};

export { Tabs };
