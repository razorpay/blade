import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type SubtleOrIntense = 'subtle' | 'intense';

export type PrimaryAction = {
  text: string;
  onClick: () => void;
};

export type SecondaryActionButton = {
  text: string;
  onClick: () => void;
};

export type SecondaryActionLinkButton = {
  text: string;
  href: string;
  onClick?: () => void;
  target?: string;
  /**
   * When `target` is set to `_blank` this is automatically set to `noopener noreferrer`
   */
  rel?: string;
};

export type SecondaryAction = SecondaryActionButton | SecondaryActionLinkButton;

export type AlertProps = {
  /**
   * Body content, pass text or JSX snippet. Avoid passing components except Link to customize the content.
   */
  description: string | Snippet;

  /**
   * A brief heading
   */
  title?: string;

  /**
   * Shows a dismiss button
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * A callback when the dismiss button is clicked
   */
  onDismiss?: () => void;

  /**
   * Can be used to render custom icon
   */
  icon?: Snippet;

  /**
   * Can be set to `intense` for a more prominent look. Not to be confused with a11y emphasis.
   *
   * @default subtle
   */
  emphasis?: SubtleOrIntense;

  /**
   * Makes the Alert span the entire container width, instead of the default max width of `584px`.
   * This also makes the alert borderless, useful for creating full bleed layouts.
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets the color tone
   *
   * @default neutral
   */
  color?: FeedbackColors;

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: {
    /**
     * Renders a button (should **always** be present if `secondary` action is being used)
     */
    primary?: PrimaryAction;
    /**
     * Renders a Link button
     */
    secondary?: SecondaryAction;
  };

  /**
   * Test id that can be used to select element in testing environments
   */
  testID?: string;

  /**
   * Analytics attributes
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;
