import React from 'react';
import { Composite } from '@floating-ui/react';
import { useTabsContext } from './TabsContext';
import { TabsIndicator } from './TabsIndicator';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

const TabsList = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { setSelectedValue, selectedValue } = useTabsContext();

  // Set the first child as the selected value
  useIsomorphicLayoutEffect(() => {
    if (selectedValue) return;
    const first = React.Children.toArray(children)[0];
    if (React.isValidElement(first)) {
      setSelectedValue(() => first.props.value);
    }
  }, [children, selectedValue, setSelectedValue]);

  return (
    <>
      <Composite
        render={(htmlProps) => {
          return (
            // @ts-expect-error spreading composite props
            <BaseBox
              {...htmlProps}
              role="tablist"
              display="flex"
              flexDirection="row"
              borderBottomWidth="thick"
              borderBottomColor="surface.border.normal.lowContrast"
            >
              {children}
            </BaseBox>
          );
        }}
      />
      <TabsIndicator />
    </>
  );
};

export { TabsList };
