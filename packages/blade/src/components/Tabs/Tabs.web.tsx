import React from 'react';
import type { TabsProps } from './types';
import { TabsContext } from './TabsContext';
import { useControllableState } from '~utils/useControllable';
import { useFirstRender } from '~utils/useFirstRender';
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
  autoWidth = false,
}: TabsProps): React.ReactElement => {
  const baseId = useId('tabs');
  const isFirstRender = useFirstRender();
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (value) => {
      if (isFirstRender) return;
      onChange?.(value);
    },
  });

  const isVertical = orientation === 'vertical';
  const contextValue = {
    baseId,
    selectedValue,
    isVertical,
    size,
    variant,
    autoWidth,
    setSelectedValue,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <BaseBox display="flex" flexDirection={isVertical ? 'row' : 'column'}>
        {children}
      </BaseBox>
    </TabsContext.Provider>
  );
};

export { Tabs };
