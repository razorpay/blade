import { default as React } from 'react';
import { BladeElementRef } from '../../utils/types';
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
declare const Tabs: React.ForwardRefExoticComponent<{
    children: React.ReactNode;
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    orientation?: import("../../utils/platform/platform").Platform.Select<{
        web: "horizontal" | "vertical";
        native: "horizontal";
    }> | undefined;
    size?: "small" | "medium" | "large" | undefined;
    variant?: "filled" | "bordered" | "borderless" | undefined;
    isFullWidthTabItem?: boolean | undefined;
    isLazy?: boolean | undefined;
} & import('../../utils/types').DataAnalyticsAttribute & React.RefAttributes<BladeElementRef>>;
export { Tabs };
