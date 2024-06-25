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
   * Element to render before the navigation item.
   *
   * @default undefined
   */
  leading?: IconComponent;
  /**
   * Element to render before the navigation item.
   *
   * @default undefined
   */
  trailing?: IconComponent;
  /**
   * Element to render inside the navigation item.
   *
   * This can either be a string or JSX element (eg: Menu component)
   */
  children?: React.ReactNode;
  /**
   * Accessibility label for the navigation item.
   */
  accessibilityLabel?: string;
} & MenuTriggerProps;

export type { TabNavItemProps };
