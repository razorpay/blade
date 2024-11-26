import type React from 'react';
import type { BoxProps } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type AccordionVariantType = 'filled' | 'transparent';

type StyledAccordionButtonProps = {
  isExpanded: boolean;
};

type AccordionButtonProps = {
  index?: number;
  icon?: IconComponent;
  title?: string;
  isDeprecatedAPI: boolean;
  header: React.ReactNode;
  isDisabled?: boolean;
} & DataAnalyticsAttribute;

type AccordionProps = {
  /**
   * Makes the passed item index expanded by default (uncontrolled)
   */
  defaultExpandedIndex?: number;

  /**
   * Expands the passed index (controlled), `-1` implies no expanded items
   */
  expandedIndex?: number;

  /**
   * Callback for change in any item's expanded state,
   * `-1` implies no expanded items
   */
  onExpandChange?: ({ expandedIndex }: { expandedIndex: number }) => void;

  /**
   * Adds numeric index at the beginning of items
   *
   * @default false
   */
  showNumberPrefix?: boolean;

  /**
   * Visual variant of AccordionItem
   *
   * @default transparent
   */
  variant?: AccordionVariantType;

  /**
   * Size of the Accordion
   *
   * @default large
   */
  size?: 'large' | 'medium';

  /**
   * maxWidth prop of Accordion
   *
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * Accepts `AccordionItem` child nodes
   */
  children: React.ReactElement | React.ReactElement[];
} & TestID &
  StyledPropsBlade;

export type {
  StyledAccordionButtonProps,
  AccordionButtonProps,
  AccordionVariantType,
  AccordionProps,
};
