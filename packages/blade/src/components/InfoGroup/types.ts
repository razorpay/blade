import type { IconComponent } from '~components/Icons';
import type { StringChildrenType, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';

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
  StyledPropsBlade &
  Pick<BoxProps, 'width' | 'maxWidth' | 'minWidth'>;

export type InfoItemProps = {
  /**
   * Content should be InfoItemKey and InfoItemValue components
   */
  children: React.ReactNode;
} & TestID;

type TitlePeripheralProps = {
  /**
   * Leading element - can be icon component, avatar, or any React element
   */
  leading?: IconComponent | React.ReactElement;

  /**
   * Trailing element - can be icon component, avatar, or any React element
   */
  trailing?: IconComponent | React.ReactElement;

  /**
   * Additional help text to provide context
   */
  helpText?: string;
};

export type TitleCollectionProps = {
  children: string | React.ReactNode;
  titleWeight: 'medium' | 'semibold';
  titleColor: 'surface.text.gray.muted' | 'surface.text.gray.subtle';
} & TitlePeripheralProps;

export type InfoItemKeyProps = {
  /**
   * Content of the key.
   */
  children?: StringChildrenType;
} & TitlePeripheralProps &
  TestID;

export type InfoItemValueProps = {
  /**
   * Content of the value - text, components, or other ReactNode
   */
  children?: StringChildrenType | React.ReactNode;

  /**
   * Defines whether the value is aligned left or right
   *
   * @default 'left'
   */
  textAlign?: 'left' | 'right';
} & TitlePeripheralProps &
  TestID;
