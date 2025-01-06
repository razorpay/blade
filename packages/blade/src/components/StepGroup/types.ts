import type React from 'react';
import type { BoxProps } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { LinkProps } from '~components/Link';
import type { FeedbackColors } from '~tokens/theme/theme';
import type { DataAnalyticsAttribute, DotNotationSpacingStringToken, TestID } from '~utils/types';

type StepGroupProps = {
  /**
   * size of step group
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * orientation of step group
   *
   * @default vertical
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * children slot for StepItem components
   */
  children: React.ReactElement | React.ReactElement[];

  /**
   * Width of StepGroup. By default it takes the width of its items.
   */
  width?: BoxProps['width'];

  /**
   * minWidth prop of StepGroup
   */
  minWidth?: BoxProps['minWidth'];

  /**
   * maxWidth prop of StepGroup
   *
   * @default 100%
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * @private
   *
   * DO NOT USE THIS PROP OR YOU WILL BE FIRED (joking. you won't be fired. But something bad will happen for sure)
   *
   * This is an internal prop to keep track of nestingLevel of StepGroup
   */
  _nestingLevel?: number;
} & StyledPropsBlade &
  DataAnalyticsAttribute &
  TestID;

type StepGroupContextType = Required<Pick<StepGroupProps, 'size' | 'orientation'>> & {
  itemsInGroupCount: number;
  totalItemsInParentGroupCount: number;
};

type StepItemProps = {
  _index?: number;
  _nestingLevel?: StepGroupProps['_nestingLevel'];
  _totalIndex?: number;

  /**
   * title of StepItem
   */
  title: string;

  /**
   * color of StepItem title
   */
  titleColor?: `feedback.text.${FeedbackColors}.intense` | `surface.text.primary.normal`;

  /**
   * A string that renders in italic font. Made for adding timestamp values.
   *
   * ```jsx
   * timestamp="Thu, 11th Oct23 | 12:00pm"
   * ```
   */
  timestamp?: string;

  /**
   * Description of StepItem
   */
  description?: string;

  /**
   * Progress line of step. When its start only starting part is highlighted and rest is kept dotted
   *
   * @default full
   */
  stepProgress?: 'start' | 'end' | 'full' | 'none';

  /**
   * marker JSX slot. It can be StepItemIndicator or StepItemIcon
   *
   * ```jsx
   * marker={<StepItemIndicator color="positive" />}
   * marker={<StepItemIcon icon={CheckIcon} color="positive" />}
   * ```
   */
  marker?: React.ReactElement;

  /**
   * trailing slot for StepItem. Mostly meant for Badge
   */
  trailing?: React.ReactElement;

  /**
   * Controlled state of selected item
   */
  isSelected?: boolean;

  /**
   * State for disabling the step item
   */
  isDisabled?: boolean;

  /**
   * Anchor tag's href value. Turns StepItem into interactive item and render it as `<a>` tag
   */
  href?: LinkProps['href'];

  /**
   * Anchjor tag's taget value. Meant to be used alongside `href` prop
   */
  target?: LinkProps['target'];

  /**
   * StepItem's click handler. Turns StepItem into interactive item and render it as button tag
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Children slot for adding additional custom elements to item
   */
  children?: React.ReactNode;
} & DataAnalyticsAttribute;

type InteractiveItemHeaderProps = {
  isSelected: StepItemProps['isSelected'];
  paddingY: DotNotationSpacingStringToken;
  paddingX: DotNotationSpacingStringToken;
  minWidth?: `min(${string})`;
};

export type { StepGroupProps, StepGroupContextType, StepItemProps, InteractiveItemHeaderProps };
