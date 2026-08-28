import type { Snippet } from 'svelte';
import type { AccordionSlot, StyleOverride } from '@razorpay/blade-core/styles';
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
   * Ignored when `allowMultiple` is `true` — use `expandedIndices` instead.
   */
  expandedIndex?: number;

  /**
   * Allows more than one `AccordionItem` to stay expanded at the same time
   * (e.g. EMI plan sections that must be compared side by side).
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * Indices expanded by default (uncontrolled), only used when `allowMultiple` is `true`.
   */
  defaultExpandedIndices?: number[];

  /**
   * Expanded indices (controlled), only used when `allowMultiple` is `true`.
   */
  expandedIndices?: number[];

  /**
   * Callback for change in any item's expanded state.
   * `expandedIndex` is the index that toggled; `-1` implies no expanded items
   * (single-expand mode only). `expandedIndices` is present when `allowMultiple`
   * is `true` and reflects the full set of expanded indices after the toggle.
   */
  onExpandChange?: (payload: { expandedIndex: number; expandedIndices?: number[] }) => void;

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
   * Renders expanded body on a recessed gray surface.
   * Uses `surface.background.gray.subtle`.
   *
   * Recommended with `variant="filled"` for checkout-style accordions.
   *
   * @default false
   */
  hasGrayBody?: boolean;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Accordion.styleOverride`;
   * instance values win on conflicts. Ignored when `variant="filled"` (fixed checkout shell).
   */
  styleOverride?: StyleOverride<AccordionSlot>;

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
   * Element placed adjacent to the title.
   * Typically used for `Badge`, `Counter`, or `AvatarGroup`.
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
