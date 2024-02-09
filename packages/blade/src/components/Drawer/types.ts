import { TestID } from '~utils/types';

type DrawerProps = {
  /**
   * Controlled state of drawer open or not
   */
  isOpen: boolean;

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Show or hide overlay.
   *
   * Also decides if clicking outside on overlay closes the drawer or not
   */
  showOverlay?: boolean;
  /**
   * children node.
   *
   * Supports DrawerHeader and DrawerBody
   */
  children: React.ReactNode;
  /**
   * zIndex property of drawer
   */
  zIndex?: number;
  /**
   *  Accessibility label for the drawer
   */
  accessibilityLabel?: string;
  /**
   *  Ref to the element to be focused on opening the drawer.
   */
  initialFocusRef?: React.MutableRefObject<any>;
} & TestID;

type DrawerHeaderProps = {
  /**
   * Title of the Drawer
   */
  title: string;

  /**
   * Subtitle of the Drawer
   */
  subtitle?: string;

  /**
   * Leading element
   *
   * DrawerHeaderIcon or DrawerHeaderAsset
   */
  leading?: React.ReactNode;

  /**
   * Title suffix element
   *
   * DrawerHeaderBadge
   */
  titleSuffix?: React.ReactNode;

  /**
   * Trailing element
   *
   * Link, Button[]
   */
  trailing?: React.ReactNode;
};

export { DrawerProps, DrawerHeaderProps };
