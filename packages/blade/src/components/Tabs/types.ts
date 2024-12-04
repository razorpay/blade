import type React from 'react';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import type { DataAnalyticsAttribute } from '~utils/types';

type TabsProps = {
  /**
   * The content of the component, accepts `TabsList` and `TabsPanel` components.
   */
  children: React.ReactNode;
  /**
   * The value of the tab panel same as the corresponding TabItem's value to match the selected TabItem.
   */
  value?: string;
  /**
   * The default value of the selected tab, in case the Tabs component is uncontrolled.
   */
  defaultValue?: string;
  /**
   * Callback fired when the value changes.
   */
  onChange?: (value: string) => void;
  /**
   * The orientation of the tabs.
   *
   * @default 'horizontal' (always horizontal on react-native)
   */
  orientation?: Platform.Select<{
    web: 'horizontal' | 'vertical';
    native: 'horizontal';
  }>;
  /**
   * The size of the tabs.
   *
   * @default 'medium'
   */
  size?: 'medium' | 'large';
  /**
   * The variant of the tabs.
   *
   * @default 'bordered'
   */
  variant?: 'bordered' | 'borderless' | 'filled';
  /**
   * If `true`, the TabItems will grow to use all the available space.
   *
   * @default false
   */
  isFullWidthTabItem?: boolean;
  /**
   * If `true`, the TabPanel will be rendered only when it becomes active.
   *
   * @default false
   */
  isLazy?: boolean;
} & DataAnalyticsAttribute;

type TabItemProps = {
  /**
   * The label of the tab item.
   */
  children: React.ReactNode;
  /**
   * The value of the tab item.
   */
  value: string;
  /**
   * Leading element of the tab item.
   * Can be used to render an Icon.
   */
  leading?: IconComponent;
  /**
   * Trailing element of the tab item.
   * Can be used to render a Badge/Counter component.
   */
  trailing?: React.ReactNode;
  /**
   * Internal prop used to pass size from Tabs to TabsItem.
   */
  /**
   * If `true`, the tab item will be disabled.
   */
  isDisabled?: boolean;
  /**
   * If set the tab item will be rendered as a link.
   * This can be used to create a tab item that redirects to another page or integrate with react-router.
   *
   * @default undefined
   */
  href?: string;
  /**
   * Callback fired when the tab item is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;
};

type TabPanelProps = {
  /**
   * The value of the tab panel. This will be used to match the selected tab.
   */
  value: string;
  /**
   * The content of the tab panel.
   */
  children: React.ReactNode;
} & DataAnalyticsAttribute;

export type { TabsProps, TabItemProps, TabPanelProps };
