import type { Snippet } from 'svelte';
import type { Component } from 'svelte';

export type StepGroupSize = 'medium' | 'large';
export type StepGroupOrientation = 'horizontal' | 'vertical';
export type StepItemMarkerColor =
  | 'primary'
  | 'positive'
  | 'negative'
  | 'notice'
  | 'information'
  | 'neutral';
export type StepProgress = 'start' | 'end' | 'full' | 'none';

export type StepGroupProps = {
  /**
   * Size of step group.
   * @default 'medium'
   */
  size?: StepGroupSize;

  /**
   * Orientation of step group.
   * @default 'vertical'
   */
  orientation?: StepGroupOrientation;

  /**
   * Children slot for StepItem and nested StepGroup components.
   */
  children: Snippet;

  /**
   * Width of StepGroup. Accepts any valid CSS width value.
   */
  width?: string;

  /**
   * minWidth prop of StepGroup.
   */
  minWidth?: string;

  /**
   * maxWidth prop of StepGroup.
   * @default '100%'
   */
  maxWidth?: string;

  /**
   * Test ID for automation testing.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type StepItemProps = {
  /**
   * Title of StepItem.
   */
  title: string;

  /**
   * Color of StepItem title.
   */
  titleColor?: string;

  /**
   * A string rendered in italic font. Useful for timestamps.
   */
  timestamp?: string;

  /**
   * Description of StepItem.
   */
  description?: string;

  /**
   * minWidth prop of StepItem.
   */
  minWidth?: string;

  /**
   * Progress line of step. Controls which segments are highlighted vs dotted.
   * @default 'none'
   */
  stepProgress?: StepProgress;

  /**
   * Marker slot. Can be StepItemIndicator or StepItemIcon snippet.
   */
  marker?: Snippet;

  /**
   * Trailing slot for StepItem. Mostly meant for Badge.
   */
  trailing?: Snippet;

  /**
   * Controlled selected state.
   */
  isSelected?: boolean;

  /**
   * Disabled state of the step item.
   */
  isDisabled?: boolean;

  /**
   * Anchor href. Turns StepItem into an interactive `<a>` tag.
   */
  href?: string;

  /**
   * Anchor target. Used with `href`.
   */
  target?: string;

  /**
   * Click handler. Turns StepItem into an interactive `<button>` tag.
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Children slot for additional custom elements.
   */
  children?: Snippet;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type StepItemIndicatorProps = {
  /**
   * Color of the indicator.
   * @default 'neutral'
   */
  color?: StepItemMarkerColor;
};

export type StepItemIconProps = {
  /**
   * Icon Svelte component to render.
   */
  icon: Component<{ size?: string; color?: string }>;

  /**
   * Color variant of the icon background and icon itself.
   * @default 'neutral'
   */
  color?: StepItemMarkerColor;

  /**
   * Whether the icon marker is disabled.
   * @default false
   */
  isDisabled?: boolean;
};
