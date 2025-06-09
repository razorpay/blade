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
   * Defines the alignment of the key content
   * @default 'left'
   */
  keyAlign?: 'left' | 'right';

  /**
   * Defines the alignment of the value content
   * @default 'left'
   */
  valueAlign?: 'left' | 'right';

  /**
   * Controls whether vertical dividers are rendered
   * @default false
   */
  isHighlighted?: boolean;

  /**
   * Custom grid template columns for the InfoGroup layout
   *
   * @default 'max-content 1fr' for horizontal itemOrientation
   * @default 'repeat(min(4, ${React.Children.count(children)}), 1fr)' for vertical itemOrientation
   */
  gridTemplateColumns?: BoxProps['gridAutoColumns'];

  /**
   * Children should be InfoItem components
   */
  children: React.ReactNode;
} & TestID &
  StyledPropsBlade &
  Pick<
    BoxProps,
    | 'width'
    | 'maxWidth'
    | 'minWidth'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingTop'
    | 'paddingBottom'
    | 'padding'
    | 'paddingX'
    | 'paddingY'
  >;

export type InfoItemProps = {
  /**
   * Content should be InfoItemKey and InfoItemValue components
   */
  children: React.ReactNode;

  /**
   * Controls whether vertical dividers are rendered for this item
   * @default false
   */
  isHighlighted?: boolean;
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

  /**
   * Truncates text after specified number of lines
   * @default undefined
   */
  truncateAfterLines?: number;
};

export type TitleCollectionProps = {
  children: string | React.ReactNode;
  titleWeight: 'medium' | 'semibold';
  titleColor: 'surface.text.gray.muted' | 'surface.text.gray.subtle';
  paddingLeft?: BoxProps['paddingLeft'];
  paddingRight?: BoxProps['paddingRight'];
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
} & TitlePeripheralProps &
  TestID;
