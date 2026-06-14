import type { ReactNode } from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type CollapsibleBodyProps = {
  children: ReactNode;
  width?: BaseBoxProps['width'];
  /**
   * Internal
   *
   * Set to false to remove margin of CollapsibleBody
   */
  _hasMargin?: boolean;
} & DataAnalyticsAttribute &
  TestID;

type CollapsibleBodyContentProps = {
  children: ReactNode;
  _hasMargin?: CollapsibleBodyProps['_hasMargin'];
};

type CollapsibleTextProps = {
  /**
   * Text content for the trigger
   */
  children: ReactNode;

  /**
   * Size of the text
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Weight of the text
   *
   * @default 'regular'
   */
  weight?: 'regular' | 'medium' | 'semibold';

  /**
   * Color of the text
   */
  color?: BaseTextProps['color'];

  /**
   * Disables the trigger
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Accessibility label for the trigger
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { CollapsibleBodyProps, CollapsibleBodyContentProps, CollapsibleTextProps };
