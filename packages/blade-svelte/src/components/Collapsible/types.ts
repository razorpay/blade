import type { Component, Snippet } from 'svelte';
import type { IconProps } from '../Icons/types';

/** A Svelte component that accepts IconProps — same shape as Button's icon prop. */
export type IconComponent = Component<IconProps>;

export type CollapsibleProps = {
  /**
   * Body content rendered inside the collapsible section.
   */
  children: Snippet;

  /**
   * Opens the collapsible by default (uncontrolled).
   * @default false
   */
  defaultIsExpanded?: boolean;

  /**
   * Controlled expanded state. Pass `true` to expand, `false` to collapse.
   */
  isExpanded?: boolean;

  /**
   * Callback fired when the expanded state changes.
   */
  onExpandChange?: (isExpanded: boolean) => void;

  /**
   * Disables the trigger button so the panel cannot be toggled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Size variant — affects font size and spacing.
   * @default 'large'
   */
  size?: 'large' | 'medium';

  /**
   * Test ID for the root element.
   */
  testID?: string;
};

export type CollapsibleTriggerProps = {
  /**
   * Text label shown inside the trigger.
   */
  label?: string;

  /**
   * Optional leading icon component (e.g. `InfoIcon` from Blade icons).
   * The icon is rendered to the left of the label at a size appropriate
   * to the `size` prop inherited from the parent `Collapsible`.
   *
   * **Design assumption:** icon is always leading (left); no trailing icon
   * position is supported on the trigger — only on AccordionItemHeader.
   */
  icon?: IconComponent;

  /**
   * Custom trigger content. When provided, replaces the default
   * `icon + label` layout. The chevron is always shown.
   */
  children?: Snippet;

  /**
   * Test ID for the trigger button.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type CollapsibleBodyProps = {
  /**
   * Content to render inside the collapsible body.
   */
  children: Snippet | string;

  /**
   * Test ID for the body element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};
