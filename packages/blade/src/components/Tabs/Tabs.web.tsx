import React from 'react';
import type { TabsProps } from './types';
import { TabsContext } from './TabsContext';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _Tabs = (
  {
    children,
    defaultValue,
    value,
    onChange,
    orientation = 'horizontal',
    size = 'medium',
    variant = 'bordered',
    isFullWidthTabItem = false,
    isLazy = false,
    ...rest
  }: TabsProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
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
      <BaseBox
        ref={ref as never}
        display="flex"
        flexDirection={isVertical ? 'row' : 'column'}
        {...metaAttribute({ name: MetaConstants.Tabs })}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </BaseBox>
    </TabsContext.Provider>
  );
};

/**
 * ### Tabs
 *
 * Check out the [Tab Stories & Examples](https://blade.razorpay.com/?path=/docs/components-tabs--default)
 *
 * ----
 * ### Basic Usage
 *
 * ```jsx
 * import { Tabs, TabList, TabItem, TabPanel } from '@razorpay/blade/components';
 *
 * <Tabs variant="bordered" orientation="horizontal">
 *   <TabList>
 *     <TabItem value="subscriptions">Subscription</TabItem>
 *     <TabItem value="plans">Plans</TabItem>
 *     <TabItem value="settings">Settings</TabItem>
 *   </TabList>
 *
 *   <TabPanel value="subscriptions">
 *     <Text>Subscriptions Panel</Text>
 *   </TabPanel>
 *   <TabPanel value="plans">
 *     <Text>Plans Panel</Text>
 *   </TabPanel>
 *   <TabPanel value="settings">
 *     <Text>Settings Panel</Text>
 *   </TabPanel>
 * </Tabs>
 * ```
 */
const Tabs = React.forwardRef(_Tabs);

export { Tabs };
