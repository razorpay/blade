/* eslint-disable @typescript-eslint/no-explicit-any */

import type { UseFloatingReturn, UseInteractionsReturn, useListItem } from '@floating-ui/react';
import type React from 'react';
import { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseMenuItemProps } from '~components/BaseMenu/types';
import type { BoxProps } from '~components/Box';
import type { FeedbackColors } from '~tokens/theme/theme';

// EXPOSED TYPES
type MenuProps = {
  /**
   * First children is trigger and second children is MenuOverlay
   **/
  children: [React.ReactElement, React.ReactElement];

  /**
   * Open controlled state
   */
  isOpen?: boolean;

  /**
   * On Menu open change callback
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;

  /**
   * Should menu open on click or hover
   *
   * @default 'click'
   */
  openInteraction?: 'hover' | 'click';
};

type MenuItemProps = {
  /**
   * title of item
   */
  title?: string;

  /**
   * Description text for the item
   */
  description?: string;

  /**
   * Slot to render custom menu items
   */
  children?: React.ReactNode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: BaseMenuItemProps['as'];

  /**
   * Click handler for MenuItem
   *
   * Absense of this prop and href will turn the item into non-interactive item
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Focus handler for MenuItem
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
  _isMenuTrigger?: boolean;
  _isSubmenuOpen?: boolean;
};

type MenuOverlayProps = {
  children: React.ReactElement[] | React.ReactElement;
  zIndex?: BoxProps['zIndex'];
  _transitionStyle?: React.CSSProperties;
};

type MenuFooterProps = Pick<BaseFooterProps, 'children' | 'testID'>;

type MenuHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix' | 'testID'
>;

// INTERNAL TYPES
type MenuContextType = {
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

type UseFloatingMenuProps = Pick<MenuProps, 'openInteraction' | 'onOpenChange' | 'isOpen'> & {
  elementsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
};

type UseFloatingMenuReturnType = Pick<
  UseInteractionsReturn,
  'getFloatingProps' | 'getItemProps' | 'getReferenceProps'
> &
  Pick<UseFloatingReturn<HTMLButtonElement>, 'context' | 'floatingStyles' | 'refs'> & {
    item: ReturnType<typeof useListItem>;
    nodeId: string;
    isOpen: boolean;
    isNested?: boolean;
    isMounted?: boolean;
    floatingTransitionStyles?: MenuOverlayProps['_transitionStyle'];
  };

export type {
  MenuItemProps,
  MenuOverlayProps,
  MenuFooterProps,
  MenuHeaderProps,
  MenuProps,
  MenuContextType,
  UseFloatingMenuProps,
  UseFloatingMenuReturnType,
};
