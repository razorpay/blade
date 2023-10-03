/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Composite } from '@floating-ui/react';
import React from 'react';
import { useTabsContext } from './TabsContext';
import BaseBox from '~components/Box/BaseBox';

const TabsList = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { setSelectedValue, selectedValue } = useTabsContext();

  // Set the first child as the selected value
  React.useLayoutEffect(() => {
    if (selectedValue) return;
    const first = React.Children.toArray(children)[0];
    if (React.isValidElement(first)) {
      setSelectedValue(() => first.props.value);
    }
  }, [children, selectedValue, setSelectedValue]);

  return (
    <Composite
      render={(htmlProps) => {
        return (
          // @ts-expect-error
          <BaseBox {...htmlProps} role="tablist" display="flex" flexDirection="row">
            {children}
          </BaseBox>
        );
      }}
    />
  );
};

export { TabsList };
