import type { IconComponent } from '~components/Icons';
import type { StringChildrenType, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

export type InfoGroupProps = {
  /**
   * Defines how Key and Value are arranged — side by side or stacked
   * @default 'horizontal'
   */
  itemOrientation?: 'horizontal' | 'vertical';

  /**
   * Shows the size of the component
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Defines whether the value is aligned left or right
   * @default 'left'
   */
  textAlign?: 'left' | 'right';

  /**
   * Children should be InfoItem components
   */
  children: React.ReactNode;
} & TestID &
  StyledPropsBlade;

export type InfoItemProps = {
  /**
   * Toggles divider below the item (for horizontal orientation) or on the left (for vertical)
   * @default false
   */
  showDivider?: boolean;

  /**
   * Content should be InfoItemKey and InfoItemValue components
   */
  children: React.ReactNode;
} & TestID;

export type InfoItemKeyProps = {
  /**
   * Leading element - can be icon, avatar, or any React element
   */
  leading?: React.ReactElement;

  /**
   * Trailing element - can be icon, avatar, or any React element
   */
  trailing?: React.ReactElement;

  /**
   * Additional help text to provide context for the key
   */
  helpText?: string;

  /**
   * Content of the key.
   */
  children?: StringChildrenType;
} & TestID;

export type InfoItemValueProps = {
  /**
   * Leading element - can be icon, avatar, or any React element
   */
  leading?: React.ReactElement;

  /**
   * Trailing element - can be icon, avatar, or any React element
   */
  trailing?: React.ReactElement;

  /**
   * Content of the value - text, components, or other ReactNode
   */
  children?: React.ReactNode;
} & TestID;

export type InfoItemIconProps = {
  /**
   * Icon component to be rendered
   */
  icon: IconComponent;
} & TestID;
