import type React from 'react';
import type { FeedbackColors } from '~tokens/theme/theme';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type DrawerHeaderVariant = 'default' | 'contiguous';

type DrawerProps = {
  /**
   * Controls the state of the drawer, indicating whether it is open or closed
   */
  isOpen: boolean;

  /**
   * Callback function triggered when the drawer is dismissed or closed.
   *
   * **Note**: onDismiss gets triggered immediately on close button click. Use onUnmount if you want to perform actions after the animations are complete
   */
  onDismiss: () => void;

  /**
   * Callback function triggered when the drawer is unmounted.
   *
   * Unlike onDismiss, this gets called after the animations are complete
   */
  onUnmount?: () => void;

  /**
   * Show or hide overlay.
   *
   * Also decides if clicking outside on overlay closes the drawer or not
   */
  showOverlay?: boolean;
  /**
   * children node.
   *
   * Supports DrawerHeader, DrawerBody, and DrawerFooter
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

  /**
   * If `true`, the DrawerBody will be rendered only when it becomes active.
   * Set to `false` to keep DrawerBody in DOM
   *
   * @default true
   */
  isLazy?: boolean;
} & DataAnalyticsAttribute &
  TestID;

type DrawerHeaderProps = {
  /**
   * Title of the Drawer
   */
  title?: string;

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

  /**
   * Children elements to be rendered inside the header
   */
  children?: React.ReactElement | React.ReactElement[];

  /**
   * Color of the header gradient background.
   *
   * @default 'information'
   */
  color?: FeedbackColors;
  /**
   * Controls how the drawer background gradient is rendered.
   *
   * - `'default'`: gradient is applied only to the header section, with a divider separating header from body.
   * - `'contiguous'`: gradient spans the full drawer height from the top, creating a seamless surface without a visual break between header and body. Divider is hidden by default.
   *
   * @default 'default'
   */
  variant?: DrawerHeaderVariant;
  /**
   * Whether to show the divider below the header.
   * @default true
   */
  showDivider?: boolean;
} & DataAnalyticsAttribute;

type DrawerFooterProps = {
  /**
   * Content of the footer
   */
  children: React.ReactNode;
  /**
   * Whether to show the divider above the footer
   * @default true
   */
  showDivider?: boolean;
} & DataAnalyticsAttribute;

export type { DrawerProps, DrawerHeaderProps, DrawerFooterProps, DrawerHeaderVariant };
