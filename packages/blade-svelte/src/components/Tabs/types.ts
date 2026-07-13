import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons';

export type TabsProps = {
  /**
   * The content of the component, accepts `TabList` and `TabPanel` components.
   */
  children: Snippet;

  /**
   * The value of the tab to select by default (uncontrolled).
   * When TabItems are rendered conditionally, set this explicitly to avoid
   * dependence on mount order.
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
} & DataAnalyticsAttribute;

type TabItemBaseProps = {
  /**
   * The value of the tab item.
   */
  value: string;

  /**
   * Trailing element snippet — only accepts `Badge` or `Counter` components.
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
} & DataAnalyticsAttribute;

type TabItemWithChildrenProps = TabItemBaseProps & {
  /**
   * The text label of the tab item.
   */
  children: Snippet;
  leading?: undefined;
  accessibilityLabel?: string;
};

/**
 * Icon-only tab: no children text, so accessibilityLabel is required for screen readers.
 */
type TabItemIconOnlyProps = TabItemBaseProps & {
  /**
   * Leading icon component (e.g., HomeIcon). Color is managed internally.
   */
  leading: IconComponent;
  children?: undefined;
  /**
   * Accessible label required when no children text is present.
   */
  accessibilityLabel: string;
};

/**
 * Icon + label tab: children text is present, so accessibilityLabel is optional.
 */
type TabItemIconWithLabelProps = TabItemBaseProps & {
  /**
   * Leading icon component (e.g., HomeIcon). Color is managed internally.
   */
  leading: IconComponent;
  children: Snippet;
  accessibilityLabel?: string;
};

export type TabItemProps =
  | TabItemWithChildrenProps
  | TabItemIconOnlyProps
  | TabItemIconWithLabelProps;

export type TabListProps = {
  /**
   * The tab items to render.
   */
  children: Snippet;

  /**
   * Test ID for the element.
   */
  testID?: string;
} & StyledPropsBlade &
  DataAnalyticsAttribute;

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
} & DataAnalyticsAttribute;
