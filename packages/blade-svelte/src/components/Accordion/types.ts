import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type AccordionVariantType = 'filled' | 'transparent';

export type AccordionProps = {
  /**
   * Accepts `AccordionItem` child nodes.
   */
  children: Snippet;

  /**
   * Makes the passed item index expanded by default (uncontrolled).
   */
  defaultExpandedIndex?: number;

  /**
   * Expands the passed index (controlled), `-1` implies no expanded items.
   */
  expandedIndex?: number;

  /**
   * Callback for change in any item's expanded state.
   * `-1` implies no expanded items.
   */
  onExpandChange?: (payload: { expandedIndex: number }) => void;

  /**
   * Adds numeric index at the beginning of items.
   * @default false
   */
  showNumberPrefix?: boolean;

  /**
   * Visual variant of AccordionItem.
   * @default 'transparent'
   */
  variant?: AccordionVariantType;

  /**
   * Size of the Accordion.
   * @default 'large'
   */
  size?: 'large' | 'medium';

  /**
   * CSS max-width value for the accordion.
   */
  maxWidth?: string;

  /**
   * CSS min-width value for the accordion.
   */
  minWidth?: string;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type AccordionItemProps = {
  /**
   * Slot, renders AccordionItemHeader and AccordionItemBody.
   */
  children: Snippet;

  /**
   * Disabled state of the item.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type AccordionItemHeaderProps = {
  /**
   * Title text for the header.
   */
  title?: string;

  /**
   * Subtitle text for the header.
   */
  subtitle?: string;

  /**
   * Leading element snippet (icon, image, etc.).
   */
  leading?: Snippet;

  /**
   * Custom header content snippet, replaces default title/subtitle layout.
   */
  children?: Snippet;

  /**
   * Trailing element snippet.
   */
  trailing?: Snippet;

  /**
   * Title suffix element snippet (e.g., Badge).
   */
  titleSuffix?: Snippet;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type AccordionItemBodyProps = {
  /**
   * Body content. String children are wrapped in Text component.
   */
  children: Snippet | string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};
