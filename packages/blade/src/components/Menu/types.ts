/* eslint-disable @typescript-eslint/no-explicit-any */

import type { UseFloatingReturn, UseInteractionsReturn, useListItem } from '@floating-ui/react';
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
  onOpenChange?: (isOpen: boolean) => void;

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
  title: string;

  /**
   * Description text for the item
   */
  description?: string;

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

// INTERNAL TYPES
type MenuContextType = {
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

type UseFloatingMenuProps = {
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
  };

export type {
  MenuItemProps,
  MenuProps,
  MenuContextType,
  UseFloatingMenuProps,
  UseFloatingMenuReturnType,
};
