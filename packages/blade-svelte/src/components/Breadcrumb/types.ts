import type { Snippet } from 'svelte';
import type { Component } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconProps } from '../Icons/types';

export type BreadcrumbSize = 'small' | 'medium' | 'large';
export type BreadcrumbColor = 'neutral' | 'primary' | 'white';

export interface BreadcrumbProps extends StyledPropsBlade {
  /**
   * Content of the Breadcrumb, accepts BreadcrumbItem components.
   */
  children: Snippet;

  /**
   * Size of the Breadcrumb.
   * @default 'medium'
   */
  size?: BreadcrumbSize;

  /**
   * Color of the Breadcrumb.
   * @default 'primary'
   */
  color?: BreadcrumbColor;

  /**
   * Whether to show the last separator.
   * @default false
   */
  showLastSeparator?: boolean;

  /**
   * Accessibility label for the breadcrumb navigation.
   * @default 'Breadcrumb'
   */
  accessibilityLabel?: string;

  /** Test ID for the element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

export interface BreadcrumbItemProps {
  /**
   * Href of the BreadcrumbItem.
   */
  href: string;

  /**
   * Function to be called on click of the BreadcrumbItem.
   * Can be used to integrate with routing libraries.
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Whether the BreadcrumbItem is the current page.
   * Sets the aria-current attribute to `page`.
   * @default false
   */
  isCurrentPage?: boolean;

  /**
   * Content of the BreadcrumbItem.
   */
  children?: Snippet | string;

  /**
   * Icon to be shown before the BreadcrumbItem.
   */
  icon?: Component<IconProps>;

  /**
   * Accessibility label for the BreadcrumbItem, can be used in icon-only variants.
   */
  accessibilityLabel?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

/**
 * Context value passed from Breadcrumb to BreadcrumbItem.
 */
export type BreadcrumbContextValue = {
  size: BreadcrumbSize;
  color: BreadcrumbColor;
};
