import type { Component } from 'svelte';
import type { IconProps } from '../../Icons/types';

export type IconComponent = Component<IconProps>;

export type IconButtonProps = {
  /**
   * Icon component to render
   */
  icon: IconComponent;

  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Emphasis level
   * @default 'intense'
   */
  emphasis?: 'subtle' | 'intense';

  /**
   * Accessibility label (required)
   */
  accessibilityLabel: string;

  /**
   * Disabled state
   */
  isDisabled?: boolean;

  /**
   * Highlighted state (hover emphasis)
   */
  isHighlighted?: boolean;

  /**
   * Tab index
   */
  tabIndex?: number;

  /**
   * Click handler
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Focus handler
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: FocusEvent) => void;
};

