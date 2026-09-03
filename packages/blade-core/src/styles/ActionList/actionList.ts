import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './actionList.module.css';

export type ActionListWrapperVariants = {
  isInBottomSheet?: boolean;
};

/**
 * ListBox scroll wrapper. Standalone → `.wrapper` (max-height 300px + spacing.3
 * padding + overflow-y auto). In-sheet → `.wrapperInSheet` (overflow-y only;
 * BottomSheetBody owns padding + scroll bounds).
 */
export const actionListWrapperCva = cva('', {
  variants: {
    isInBottomSheet: {
      true: styles.wrapperInSheet,
      false: styles.wrapper,
    },
  },
  defaultVariants: {
    isInBottomSheet: false,
  },
});

export function getActionListWrapperClasses(props: ActionListWrapperVariants): string {
  return actionListWrapperCva(props);
}

/**
 * Item density, controlled via the `ActionList` `density` prop.
 *
 * When `undefined`, items fall back to the default responsive behavior
 * (compact `spacing-2` padding on mobile, roomier `spacing-3` on desktop,
 * driven by the `@media (min-width: 768px)` block in the stylesheet). Setting a
 * density pins the item padding to a single value across all breakpoints so
 * consumers (e.g. surfaces that must match a specific design) get predictable,
 * controllable density.
 */
export type ActionListDensity = 'normal' | 'dense';

export type ActionListItemVariants = {
  intent?: 'default' | 'negative';
  density?: ActionListDensity;
};

/**
 * Row container (inlined BaseMenuItem). `.item` carries layout + hover/selected/
 * focus states; `.itemNegative` adds the negative-faded hover for
 * `intent="negative"`.
 */
export const actionListItemCva = cva(styles.item, {
  variants: {
    intent: {
      default: null,
      negative: styles.itemNegative,
    },
    density: {
      normal: styles.itemNormal,
      dense: styles.itemDense,
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
  itemNormal: string;
  itemDense: string;
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
    wrapper: styles.wrapper,
    wrapperInSheet: styles.wrapperInSheet,
    item: styles.item,
    itemNegative: styles.itemNegative,
    itemNormal: styles.itemNormal,
    itemDense: styles.itemDense,
    itemInner: styles.itemInner,
    itemLeading: styles.itemLeading,
    itemSelector: styles.itemSelector,
    itemContent: styles.itemContent,
    itemContentWithLeading: styles.itemContentWithLeading,
    itemTitleRow: styles.itemTitleRow,
    itemTrailing: styles.itemTrailing,
    itemBadgeGroup: styles.itemBadgeGroup,
    section: styles.section,
    sectionTitle: styles.sectionTitle,
    sectionItems: styles.sectionItems,
  };
}
