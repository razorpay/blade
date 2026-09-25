// @ts-expect-error - CSS modules may not have type definitions in build
import amountStyles from './amount.module.css';

export {
  subtleFontSizes,
  normalAmountSizes,
  currencyHardcodedSizes,
  amountLineHeights,
} from './amountTokens';
export type {
  AmountTypeProps,
  AmountBodyProps,
  AmountDisplayProps,
  AmountHeadingProps,
} from './amountTokens';
export type { AmountSlot } from './slots';

/** Strikethrough line class for the striked-through Amount variant. */
export const amountStrikethroughClass: string = amountStyles.strikethrough;
