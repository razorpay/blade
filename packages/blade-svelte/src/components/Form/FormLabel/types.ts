import type { Snippet } from 'svelte';

export type FormLabelProps = {
  /**
   * Label text content (can be string or snippet)
   */
  children?: Snippet | string;

  /**
   * HTML element to render as
   * @default 'label'
   */
  as?: 'label' | 'span';

  /**
   * ID for the label element
   */
  id?: string;

  /**
   * For attribute to associate with input
   */
  htmlFor?: string;

  /**
   * Position of the label
   * @default 'top'
   */
  position?: 'top' | 'left';

  /**
   * Necessity indicator
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Size of the label
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Suffix element to render after label text (e.g., tooltip icon)
   */
  labelSuffix?: Snippet;

  /**
   * Trailing element to render at the end of the label row
   */
  labelTrailing?: Snippet;

  /**
   * Accessibility text (visually hidden)
   */
  accessibilityText?: string;
};

