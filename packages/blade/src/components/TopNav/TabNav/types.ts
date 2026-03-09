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

type TabNavIconProp =
  | IconComponent
  | {
      default: IconComponent;
      selected: IconComponent;
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
  as?: React.ComponentType<any> | 'a' | 'button';
  /**
   * Selected state of the navigation item.
   *
   * @default false
   */
  isActive?: boolean;
  /**
   * Leading icon for TabNavItem.
   * Accepts a single IconComponent or an object with `default` and `selected` variants.
   *
   * @example
   * ```jsx
   * // Single icon
   * <TabNavItem icon={HomeIcon} />
   *
   * // With selected state variant
   * <TabNavItem icon={{ default: HomeIcon, selected: HomeFilledIcon }} />
   * ```
   *
   * @default undefined
   */
  icon?: TabNavIconProp;
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
type TabNavItemData = Item & {
  isOverflowing?: boolean;
  tabWidth?: number;
  offsetX?: number;
};
type TabNavProps = {
  items: Item[];
  children: (props: {
    items: TabNavItemData[];
    overflowingItems: TabNavItemData[];
  }) => React.ReactElement;
};

export type { TabNavItemProps, TabNavItemData, TabNavProps, TabNavIconProp };
