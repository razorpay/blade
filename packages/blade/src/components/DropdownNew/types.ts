/* eslint-disable @typescript-eslint/no-explicit-any */

import type { UseFloatingReturn, UseInteractionsReturn, useListItem } from '@floating-ui/react';
import type React from 'react';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseMenuItemProps } from '~components/BaseMenu/types';
import type { BoxProps } from '~components/Box';
import type { FeedbackColors } from '~tokens/theme/theme';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

// EXPOSED TYPES
type DropdownProps = {
  /**
   * First children is trigger and second children is DropdownOverlay
   **/
  children: [React.ReactElement, React.ReactElement];

  /**
   * Open controlled state
   */
  isOpen?: boolean;

  /**
   * On Dropdown open change callback
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;

  /**
   * Should Dropdown open on click or hover
   *
   * @default 'click'
   */
  openInteraction?: 'hover' | 'click';
};

type DropdownItemProps = {
  /**
   * title of item
   */
  title?: string;

  /**
   * Description text for the item
   */
  description?: string;

  /**
   * Slot to render custom Dropdown items
   */
  children?: React.ReactNode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: BaseMenuItemProps['as'];

  /**
   * Click handler for DropdownItem
   *
   * Absense of this prop and href will turn the item into non-interactive item
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Focus handler for DropdownItem
   *
   * Absense of this prop and href will turn the item into non-interactive item
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * Link to open when item is clicked.
   *
   * Absense of this prop and onClick will turn the item into non-interactive item
   */
  href?: string;

  /**
   * HTML target of the link
   */
  target?: string;

  /**
   * Item that goes on left-side of item.
   *
   * Will be overriden in multiselect
   */
  leading?: React.ReactNode;

  /**
   * Item that goes on right-side of item.
   */
  trailing?: React.ReactNode;

  /**
   * Item that goes immediately next to the title.
   */
  titleSuffix?: React.ReactElement;

  /**
   * disabled state of item
   */
  isDisabled?: boolean;

  /**
   * Color of item. set to negative for dangerous actions like Delete, Remove, etc
   */
  color?: Extract<FeedbackColors, 'negative'>;
  _hasFocusInside?: boolean;
  _isDropdownTrigger?: boolean;
  _isSubmenuOpen?: boolean;
} & DataAnalyticsAttribute;

type DropdownOverlayProps = {
  /**
   * JSX Slot for DropdownItem or anything else
   */
  children: React.ReactElement[] | React.ReactElement | React.ReactNode;

  /**
   * zIndex override
   */
  zIndex?: BoxProps['zIndex'];

  /**
   * width override.
   *
   * By default width is not set
   */
  width?: BoxProps['width'];

  /**
   * minWidth override
   */
  minWidth?: BoxProps['minWidth'];

  /**
   * maxWidth override
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * @private Internal Prop. Do not override or you'll be fired
   */
  _transitionStyle?: React.CSSProperties;
} & TestID &
  DataAnalyticsAttribute;

type DropdownFooterProps = Pick<
  BaseFooterProps,
  'children' | 'testID' | keyof DataAnalyticsAttribute
>;

type DropdownHeaderProps = Pick<
  BaseHeaderProps,
  | 'title'
  | 'subtitle'
  | 'leading'
  | 'trailing'
  | 'titleSuffix'
  | 'testID'
  | keyof DataAnalyticsAttribute
>;

// INTERNAL TYPES
type DropdownContextType = {
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  selectedIndices: number[];
  select: (index: number) => void;
};

type UseFloatingDropdownProps = Pick<
  DropdownProps,
  'openInteraction' | 'onOpenChange' | 'isOpen'
> & {
  elementsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
};

type UseFloatingDropdownReturnType = Pick<
  UseInteractionsReturn,
  'getFloatingProps' | 'getItemProps' | 'getReferenceProps'
> &
  Pick<UseFloatingReturn<HTMLButtonElement>, 'context' | 'floatingStyles' | 'refs'> & {
    item: ReturnType<typeof useListItem>;
    nodeId: string;
    isOpen: boolean;
    isNested?: boolean;
    isMounted?: boolean;
    floatingTransitionStyles?: DropdownOverlayProps['_transitionStyle'];
  };

export type {
  DropdownItemProps,
  DropdownOverlayProps,
  DropdownFooterProps,
  DropdownHeaderProps,
  DropdownProps,
  DropdownContextType,
  UseFloatingDropdownProps,
  UseFloatingDropdownReturnType,
};
