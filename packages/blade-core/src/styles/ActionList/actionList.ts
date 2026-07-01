import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './actionList.module.css';

export type ActionListBoxVariants = {
  isInBottomSheet?: boolean;
};

/**
 * Outer StyledActionList box. Present ONLY when NOT inside a BottomSheet
 * (border + radius + mid-raised shadow). Inside a sheet the ActionList renders
 * the scroll wrapper directly, so no box class is emitted.
 */
export const actionListBoxCva = cva('', {
  variants: {
    isInBottomSheet: {
      true: null,
      false: styles.box,
    },
  },
  defaultVariants: {
    isInBottomSheet: false,
  },
});

export function getActionListBoxClasses(props: ActionListBoxVariants): string {
  return actionListBoxCva(props);
}

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

export type ActionListItemVariants = {
  intent?: 'default' | 'negative';
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
  box: string;
  wrapper: string;
  wrapperInSheet: string;
  item: string;
  itemNegative: string;
  itemInner: string;
  itemLeading: string;
  itemContent: string;
  itemContentWithLeading: string;
  itemTitleRow: string;
  itemTrailing: string;
  section: string;
  sectionTitle: string;
  sectionItems: string;
} {
  return {
    box: styles.box,
    wrapper: styles.wrapper,
    wrapperInSheet: styles.wrapperInSheet,
    item: styles.item,
    itemNegative: styles.itemNegative,
    itemInner: styles.itemInner,
    itemLeading: styles.itemLeading,
    itemContent: styles.itemContent,
    itemContentWithLeading: styles.itemContentWithLeading,
    itemTitleRow: styles.itemTitleRow,
    itemTrailing: styles.itemTrailing,
    section: styles.section,
    sectionTitle: styles.sectionTitle,
    sectionItems: styles.sectionItems,
  };
}
