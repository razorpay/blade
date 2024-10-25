import type { IconComponent } from '~components/Icons';
import type { LinkProps } from '~components/Link';
import type { Platform } from '~utils';

type MenuTriggerProps = {
  onMouseDown?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onPointerDown?: Platform.Select<{ web: React.PointerEventHandler; native: undefined }>;
  onKeyDown?: Platform.Select<{ web: React.KeyboardEventHandler; native: undefined }>;
  onKeyUp?: Platform.Select<{ web: React.KeyboardEventHandler; native: undefined }>;
  onClick?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
};

type TabNavItemProps = {
  /**
   * href of the link
   */
  href?: LinkProps['href'];
  /**
   * Anchor tag `target` attribute
   */
  target?: LinkProps['target'];
  /**
   * as prop to pass ReactRouter's Link component.
   *
   * @default 'a'
   *
   * @example
   * ```jsx
   * import { Link } from 'react-router-dom';
   *
   * <TabNavItem as={Link} />
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any>;
  /**
   * Selected state of the navigation item.
   *
   * @default false
   */
  isActive?: boolean;
  /**
   * Leading icon for TabNavItem.
   *
   * @default undefined
   */
  icon?: IconComponent;
  /**
   * Element to render after the navigation item.
   *
   * @default undefined
   */
  trailing?: React.ReactElement;
  /**
   * Title of the navigation item.
   */
  title?: string;
  /**
   * Accessibility label for the navigation item.
   */
  accessibilityLabel?: string;
} & MenuTriggerProps;

type Item = TabNavItemProps & {
  description?: string;
  isAlwaysOverflowing?: boolean;
};
type TabNavDataItem = Item & {
  isOverflowing?: boolean;
  tabWidth?: number;
  offsetX?: number;
};
type TabNavProps = {
  items: Item[];
  children: (props: {
    items: TabNavDataItem[];
    overflowingItems: TabNavDataItem[];
  }) => React.ReactElement;
};

export type { TabNavItemProps, TabNavDataItem, TabNavProps };
