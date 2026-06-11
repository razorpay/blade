import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type TabsProps = {
  /**
   * The content of the component, accepts `TabList` and `TabPanel` components.
   */
  children: Snippet;

  /**
   * The value of the tab to select by default (uncontrolled).
   */
  defaultValue?: string;

  /**
   * The currently selected tab value (controlled).
   */
  value?: string;

  /**
   * Callback fired when the selected tab changes.
   */
  onChange?: (value: string) => void;

  /**
   * The orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * The size of the tabs.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The variant of the tabs.
   * @default 'bordered'
   */
  variant?: 'bordered' | 'borderless' | 'filled';

  /**
   * If `true`, the TabItems will grow to use all the available space.
   * @default false
   */
  isFullWidthTabItem?: boolean;

  /**
   * If `true`, the TabPanel will be rendered only when it becomes active.
   * @default false
   */
  isLazy?: boolean;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type TabItemProps = {
  /**
   * The content (label) of the tab item.
   */
  children?: Snippet;

  /**
   * The value of the tab item.
   */
  value: string;

  /**
   * Leading icon snippet for the tab item.
   */
  leading?: Snippet;

  /**
   * Trailing element snippet (Badge/Counter).
   */
  trailing?: Snippet;

  /**
   * If `true`, the tab item will be disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * If set, the tab item will be rendered as a link.
   */
  href?: string;

  /**
   * Callback fired when the tab item is clicked.
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type TabListProps = {
  /**
   * The tab items to render.
   */
  children: Snippet;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type TabPanelProps = {
  /**
   * The value of the tab panel matching its TabItem.
   */
  value: string;

  /**
   * The content of the tab panel.
   */
  children: Snippet;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};
