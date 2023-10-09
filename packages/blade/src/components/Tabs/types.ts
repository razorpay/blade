type TabsProps = {
  /**
   * The content of the component, accepts `TabsList` and `TabsPanel` components.
   */
  children: React.ReactNode;
  /**
   * The value of the selected tab, If set the component will be controlled.
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
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The size of the tabs.
   */
  size?: 'medium' | 'large';
  /**
   * The variant of the tabs.
   */
  variant?: 'bordered' | 'filled';
  /**
   * If `true`, the TabItems will grow to use all the available space.
   */
  autoWidth?: boolean;
};

type TabItemProps = {
  /**
   * The label of the tab item.
   */
  children: string;
  /**
   * The value of the tab item.
   */
  value: string;
  /**
   * Leading element of the tab item.
   * Can be used to render an icon.
   */
  leading?: React.ReactNode;
  /**
   * Trailing element of the tab item.
   * Can be used to render an badge/counter.
   */
  trailing?: React.ReactNode;
  /**
   * Internal prop used to pass size from Tabs to TabsItem.
   */
  /**
   * If `true`, the tab item will be disabled.
   */
  isDisabled?: boolean;
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
};

export type { TabsProps, TabItemProps, TabPanelProps };
