import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { ButtonProps } from '../Button/types';
import type { TextColors } from '../Typography/BaseText/types';
import type { CollapsibleDirection } from './context';

type CollapsibleLinkColor = 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
type CollapsibleLinkSize = 'xsmall' | 'small' | 'medium' | 'large';

export type CollapsibleTextColor = TextColors;
export type CollapsibleTextSize = 'small' | 'medium' | 'large';
export type CollapsibleTextWeight = 'regular' | 'medium' | 'semibold';

export type CollapsibleProps = {
  /**
   * Composes `CollapsibleButton`, `CollapsibleLink`, `CollapsibleText`, `CollapsibleBody`
   */
  children: Snippet;

  /**
   * Direction in which the content expands
   *
   * @default 'bottom'
   */
  direction?: CollapsibleDirection;

  /**
   * Expands the collapsible content by default (uncontrolled)
   *
   * @default false
   */
  defaultIsExpanded?: boolean;

  /**
   * Expands the collapsible content (controlled)
   *
   * @default undefined
   */
  isExpanded?: boolean;

  /**
   * Callback for change in collapsible's expanded state
   *
   * @default undefined
   */
  onExpandChange?: (args: { isExpanded: boolean }) => void;

  /**
   * Test ID for the root element.
   */
  testID?: string;

  /**
   * **Internal**: used to override responsive width restrictions
   */
  _shouldApplyWidthRestrictions?: boolean;

  /**
   * **Internal**: disables trigger validations. Used for AccordionItem internally
   * so an `AccordionItemHeader` can act as the trigger without tripping the
   * allowed-children check.
   *
   * @default false
   */
  _dangerouslyDisableValidations?: boolean;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type CollapsibleButtonProps = Pick<
  ButtonProps,
  | 'variant'
  | 'size'
  | 'iconPosition'
  | 'isDisabled'
  | 'testID'
  | 'accessibilityLabel'
  | 'icon'
  | 'children'
> & {
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type CollapsibleLinkProps = {
  /** Link color */
  color?: CollapsibleLinkColor;
  /** Link size */
  size?: CollapsibleLinkSize;
  /** Whether the link is disabled */
  isDisabled?: boolean;
  /** Test ID for the link */
  testID?: string;
  /** Accessible label for the link */
  accessibilityLabel?: string;
  /** Link content */
  children?: Snippet | string;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type CollapsibleTextProps = {
  /** Text content rendered alongside the chevron. */
  children: Snippet | string;

  /**
   * Size of the text.
   * @default 'medium'
   */
  size?: CollapsibleTextSize;

  /**
   * Weight of the text.
   * @default 'regular'
   */
  weight?: CollapsibleTextWeight;

  /**
   * Overrides the color of the text.
   */
  color?: CollapsibleTextColor;

  /**
   * Whether the trigger is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /** Accessible label for the trigger. */
  accessibilityLabel?: string;

  /** Test ID for the trigger. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type CollapsibleBodyProps = {
  /**
   * Content to render inside the collapsible body.
   */
  children: Snippet | string;

  /**
   * Width of the collapsible body content.
   */
  width?: string;

  /**
   * Test ID for the body element.
   */
  testID?: string;

  /**
   * **Internal**: Set to false to remove margin of CollapsibleBody
   */
  _hasMargin?: boolean;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};
