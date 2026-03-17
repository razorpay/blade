import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons';

export type AlertColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type AlertEmphasis = 'subtle' | 'intense';

export type PrimaryAction = {
  /** Button label text */
  text: string;
  /** Callback when button is clicked */
  onClick: () => void;
};

export type SecondaryActionButton = {
  /** Link button label text */
  text: string;
  /** Callback when link button is clicked */
  onClick: () => void;
};

export type SecondaryActionLinkButton = {
  /** Link button label text */
  text: string;
  /** URL to navigate to */
  href: string;
  /** Optional click callback */
  onClick?: () => void;
  /** Link target attribute */
  target?: string;
  /**
   * Link rel attribute.
   * When `target` is set to `_blank` this is automatically set to `noopener noreferrer`
   */
  rel?: string;
};

export type SecondaryAction = SecondaryActionButton | SecondaryActionLinkButton;

export type AlertActions = {
  /**
   * Renders a button (should **always** be present if `secondary` action is being used)
   */
  primary?: PrimaryAction;
  /**
   * Renders a Link button
   */
  secondary?: SecondaryAction;
};

export interface AlertProps extends StyledPropsBlade {
  /**
   * Body content, pass text or a Snippet. Avoid passing components except `Link` to customize the content.
   */
  description: Snippet | string;

  /**
   * A brief heading
   */
  title?: string;

  /**
   * Shows a dismiss button
   * @default true
   */
  isDismissible?: boolean;

  /**
   * A callback when the dismiss button is clicked
   */
  onDismiss?: () => void;

  /**
   * Can be used to render a custom icon
   */
  icon?: IconComponent;

  /**
   * Can be set to `intense` for a more prominent look. Not to be confused with a11y emphasis.
   * @default 'subtle'
   */
  emphasis?: AlertEmphasis;

  /**
   * Makes the Alert span the entire container width, instead of the default max width of `584px`.
   * This also makes the alert borderless, useful for creating full bleed layouts.
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets the color tone
   * @default 'neutral'
   */
  color?: AlertColor;

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: AlertActions;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
