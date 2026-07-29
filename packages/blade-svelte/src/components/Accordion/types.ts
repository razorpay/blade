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
   * instance values win on conflicts.
   *
   * **`graySurface`:** with `hasGrayBody`, pass a {@link CardBackgroundColor} token for the same
   * Blade background utility as Card. **`wrapper`:** targets the filled card shell (gradients /
   * shadow); clear `background-image` in extra classes when replacing fill.
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
