import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import cardGroupStyles from './cardGroup.module.css';

// --- CardGroup surface ---

export function getCardGroupSurfaceClasses(): string {
  return cardGroupStyles.cardGroup;
}

// --- CardGroupItem (row) ---

export type CardGroupItemVariants = {
  /** Interactive rows (navigate or select) get pointer + hover/focus affordances. */
  isInteractive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
};

export const cardGroupItemCva = cva(cardGroupStyles.cardGroupItem, {
  variants: {
    isInteractive: {
      true: cardGroupStyles.cardGroupItemInteractive,
      false: '',
    },
    isSelected: {
      true: cardGroupStyles.cardGroupItemSelected,
      false: '',
    },
    isDisabled: {
      true: cardGroupStyles.cardGroupItemDisabled,
      false: '',
    },
  },
  defaultVariants: {
    isInteractive: false,
    isSelected: false,
    isDisabled: false,
  },
});

export function getCardGroupItemClasses(props: CardGroupItemVariants): string {
  return cardGroupItemCva(props);
}

// --- Chevron ---

export type CardGroupChevronVariants = {
  isExpanded?: boolean;
};

export const cardGroupChevronCva = cva(cardGroupStyles.cardGroupChevron, {
  variants: {
    isExpanded: {
      true: cardGroupStyles.cardGroupChevronExpanded,
      false: '',
    },
  },
  defaultVariants: {
    isExpanded: false,
  },
});

export function getCardGroupChevronClasses(props: CardGroupChevronVariants): string {
  return cardGroupChevronCva(props);
}

/**
 * Static template classes. Called at the top of each `.svelte` module so Svelte's
 * compiler does not tree-shake the CSS-module references away.
 */
export function getCardGroupTemplateClasses(): Record<string, string> {
  return {
    cardGroup: cardGroupStyles.cardGroup,
    cardGroupBody: cardGroupStyles.cardGroupBody,
    cardGroupItem: cardGroupStyles.cardGroupItem,
    cardGroupItemLeading: cardGroupStyles.cardGroupItemLeading,
    cardGroupItemTrailing: cardGroupStyles.cardGroupItemTrailing,
    cardGroupItemContent: cardGroupStyles.cardGroupItemContent,
    cardGroupChevron: cardGroupStyles.cardGroupChevron,
    cardGroupCollapsibleBody: cardGroupStyles.cardGroupCollapsibleBody,
  };
}
