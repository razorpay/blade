import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import type { LinkProps } from '~components/Link';
import type { DataAnalyticsAttribute, StringChildrenType } from '~utils/types';

type BreadcrumbProps = StyledPropsBlade & {
  /**
   * Size of the Breadcrumb
   *
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color of the Breadcrumb
   *
   * @default neutral
   */
  color?: 'neutral' | 'primary' | 'white';
  /**
   * Content of the Breadcrumb, accepts BreadcrumbItem
   */
  children: React.ReactNode;
  /**
   * Whether to show the last separator
   */
  showLastSeparator?: boolean;
  /**
   * aria-label for breadcrumb
   */
  accessibilityLabel?: string;
} & DataAnalyticsAttribute;

type BreadcrumbItemProps = {
  /**
   * Href of the BreadcrumbItem
   */
  href: string;
  /**
   * Function to be called on click of the BreadcrumbItem,
   *
   * This can be used to integrate with routing libraries like `react-router-dom`
   */
  onClick?: LinkProps['onClick'];
  /**
   * Whether the BreadcrumbItem is the current page,
   * Sets the aria-current attribute to `page`
   *
   * @default false
   */
  isCurrentPage?: boolean;
  /**
   * Content of the BreadcrumbItem
   */
  children?: StringChildrenType;
  /**
   * Icon to be shown before the BreadcrumbItem
   */
  icon?: IconComponent;
  /**
   * Accessibility label for the BreadcrumbItem, can be used in icon only variant
   */
  accessibilityLabel?: string;
} & DataAnalyticsAttribute;

export type { BreadcrumbProps, BreadcrumbItemProps };
