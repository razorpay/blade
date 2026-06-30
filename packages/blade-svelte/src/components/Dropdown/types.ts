import type { Snippet, Component } from 'svelte';
import type { Placement } from '@floating-ui/dom';
import type { IconProps } from '../Icons/types';

export type IconComponent = Component<IconProps>;

export type DropdownProps = {
  /**
   * Child components: trigger + DropdownOverlay
   */
  children: Snippet;
  /**
   * Control open / close state of the Dropdown component
   *
   * This can be used to close the dropdown when button in the footer of dropdown is clicked
   */
  isOpen?: boolean;
  /**
   * Callback when open state of the dropdown changes
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether to allow single or multiple selection
   *
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Test ID for the root element
   */
  testID?: string;
  /**
   * @private
   * Width prop for outer relative container of Dropdown.
   * Use width prop on DropdownOverlay to change width of menu.
   */
  _width?: string;
};

export type DropdownOverlayProps = {
  /**
   * Content of the overlay (usually ActionList)
   */
  children: Snippet;
  /**
   * Sets the z-index of the DropdownOverlay
   *
   * @default 1001
   */
  zIndex?: number;
  /**
   * Override the default width of dropdown
   */
  width?: string;
  /**
   * Override the default minWidth of dropdown
   */
  minWidth?: string;
  /**
   * Override the default maxWidth of dropdown
   */
  maxWidth?: string;
  /**
   * Reference element for positioning (overrides triggerer refs)
   */
  referenceRef?: { current: HTMLElement | null };
  /**
   * Sets the placement of the DropdownOverlay
   *
   * @default 'bottom-start'
   */
  defaultPlacement?: Placement;
  /**
   * Nested Dropdown Overlay (Input Search Dropdown)
   *
   * @default false
   * @private
   */
  _isNestedDropdown?: boolean;
  /**
   * Test ID for the overlay element
   */
  testID?: string;
};

export type DropdownButtonProps = {
  /**
   * Button label text
   */
  children?: Snippet | string;
  /**
   * Icon component to render inside button
   */
  icon?: IconComponent;
  /**
   * Position of icon relative to label
   *
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Disable the button
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Make button full width
   *
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * Show loading spinner
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * Click handler
   */
  onClick?: (e: MouseEvent) => void;
  /**
   * Blur handler
   */
  onBlur?: (e: FocusEvent) => void;
  /**
   * Keydown handler
   */
  onKeyDown?: (e: KeyboardEvent) => void;
  /**
   * Button size
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * HTML button type
   *
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Button variant
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Button color
   *
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative';
  /**
   * Accessible label for screen readers
   */
  accessibilityLabel?: string;
  /**
   * Test ID
   */
  testID?: string;
};

export type DropdownIconButtonProps = {
  /**
   * Icon component to render
   */
  icon: IconComponent;
  /**
   * Disable the button
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Click handler
   */
  onClick?: (e: MouseEvent) => void;
  /**
   * Blur handler
   */
  onBlur?: (e: FocusEvent) => void;
  /**
   * Keydown handler
   */
  onKeyDown?: (e: KeyboardEvent) => void;
  /**
   * Button size
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Accessible label (required for icon-only buttons)
   */
  accessibilityLabel: string;
  /**
   * Visual emphasis
   *
   * @default 'intense'
   */
  emphasis?: 'intense' | 'subtle';
  /**
   * Test ID
   */
  testID?: string;
};

export type DropdownLinkProps = {
  /**
   * Link label text
   */
  children?: Snippet | string;
  /**
   * Icon component
   */
  icon?: IconComponent;
  /**
   * Position of icon relative to label
   *
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Click handler
   */
  onClick?: (e: MouseEvent) => void;
  /**
   * Blur handler
   */
  onBlur?: (e: FocusEvent) => void;
  /**
   * Keydown handler
   */
  onKeyDown?: (e: KeyboardEvent) => void;
  /**
   * Disable the link
   */
  isDisabled?: boolean;
  /**
   * href for anchor-based link
   */
  href?: string;
  /**
   * Target attribute
   */
  target?: string;
  /**
   * Rel attribute
   */
  rel?: string;
  /**
   * Accessible label
   */
  accessibilityLabel?: string;
  /**
   * Link size
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Test ID
   */
  testID?: string;
};

export type DropdownHeaderProps = {
  /**
   * Header title text
   */
  title?: string;
  /**
   * Header subtitle text
   */
  subtitle?: string;
  /**
   * Leading slot content
   */
  leading?: Snippet;
  /**
   * Trailing slot content
   */
  trailing?: Snippet;
  /**
   * Title suffix content
   */
  titleSuffix?: Snippet;
  /**
   * Child content (e.g. autocomplete input)
   */
  children?: Snippet;
  /**
   * Test ID
   */
  testID?: string;
};

export type DropdownFooterProps = {
  /**
   * Footer content (actions)
   */
  children: Snippet;
  /**
   * Test ID
   */
  testID?: string;
};
