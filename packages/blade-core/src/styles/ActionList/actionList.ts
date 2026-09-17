import { cva } from 'class-variance-authority';

export type ActionListWrapperVariants = {
  isInBottomSheet?: boolean;
};

// Structural class strings (literal so the JIT scanner sees them). Interactive row states + the
// section-separator hide live in the `.blade-actionlist-*` plugin classes; everything else is atomic.
const wrapperClass =
  'max-h-[var(--size-300,300px)] p-spacing-3 overflow-y-auto blade-actionlist-scroll';
const wrapperInSheetClass = 'overflow-y-auto blade-actionlist-scroll';
const itemClass = 'blade-actionlist-item';
const itemNegativeClass = 'blade-actionlist-item-negative';
const itemInnerClass = 'flex flex-row items-start justify-start w-full';
const itemLeadingClass = 'flex items-center justify-center h-[var(--size-20,20px)]';
const itemContentClass = 'flex flex-col min-w-0 pr-spacing-3';
const itemContentWithLeadingClass = 'pl-spacing-3';
const itemTitleRowClass = 'flex flex-row items-center h-[var(--size-20,20px)]';
const itemTrailingClass = 'ml-auto';
const itemSelectorClass =
  'flex items-center justify-center h-[var(--size-20,20px)] pointer-events-none';
const itemBadgeGroupClass = 'flex flex-row items-center';
const sectionClass = 'block';
const sectionTitleClass = 'p-spacing-3';
const sectionItemsClass = 'block';

/**
 * ListBox scroll wrapper. Standalone → max-height 300px + spacing.3 padding + overflow-y auto.
 * In-sheet → overflow-y only (BottomSheetBody owns padding + scroll bounds). Both carry
 * `blade-actionlist-scroll` so the plugin's section-separator-hide rule applies.
 */
export const actionListWrapperCva = cva('', {
  variants: {
    isInBottomSheet: {
      true: wrapperInSheetClass,
      false: wrapperClass,
    },
  },
  defaultVariants: {
    isInBottomSheet: false,
  },
});

export function getActionListWrapperClasses(props: ActionListWrapperVariants): string {
  return actionListWrapperCva(props);
}

export type ActionListItemVariants = {
  intent?: 'default' | 'negative';
};

/**
 * Row container (inlined BaseMenuItem). `.item` carries layout + hover/selected/
 * focus states; `.itemNegative` adds the negative-faded hover for
 * `intent="negative"`.
 */
export const actionListItemCva = cva(itemClass, {
  variants: {
    intent: {
      default: null,
      negative: itemNegativeClass,
    },
  },
  defaultVariants: {
    intent: 'default',
  },
});

export function getActionListItemClasses(props: ActionListItemVariants): string {
  return actionListItemCva(props);
}

/**
 * Structural/template classes. Call from the Svelte component so Svelte does
 * not tree-shake CVA class references that only appear in compound selectors.
 */
export function getActionListTemplateClasses(): {
  wrapper: string;
  wrapperInSheet: string;
  item: string;
  itemNegative: string;
  itemInner: string;
  itemLeading: string;
  itemSelector: string;
  itemContent: string;
  itemContentWithLeading: string;
  itemTitleRow: string;
  itemTrailing: string;
  itemBadgeGroup: string;
  section: string;
  sectionTitle: string;
  sectionItems: string;
} {
  return {
    wrapper: wrapperClass,
    wrapperInSheet: wrapperInSheetClass,
    item: itemClass,
    itemNegative: itemNegativeClass,
    itemInner: itemInnerClass,
    itemLeading: itemLeadingClass,
    itemSelector: itemSelectorClass,
    itemContent: itemContentClass,
    itemContentWithLeading: itemContentWithLeadingClass,
    itemTitleRow: itemTitleRowClass,
    itemTrailing: itemTrailingClass,
    itemBadgeGroup: itemBadgeGroupClass,
    section: sectionClass,
    sectionTitle: sectionTitleClass,
    sectionItems: sectionItemsClass,
  };
}
