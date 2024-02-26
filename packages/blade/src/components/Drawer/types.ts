import type { TestID } from '~utils/types';

type DrawerProps = {
  /**
   * Controls the state of the drawer, indicating whether it is open or closed
   */
  isOpen: boolean;

  /**
   * Callback function triggered when the drawer is dismissed or closed
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
   *
   * @default 1001
   */
  zIndex?: number;
  /**
   * Accessibility label for the drawer
   */
  accessibilityLabel?: string;
  /**
   * Ref to the element that should receive focus when opening the drawer.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export type { DrawerProps, DrawerHeaderProps };
