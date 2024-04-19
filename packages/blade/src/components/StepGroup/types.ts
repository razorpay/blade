import type React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { LinkProps } from '~components/Link';
import type { DotNotationSpacingStringToken, TestID } from '~utils/types';

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

  _nestingLevel?: number;
} & StyledPropsBlade &
  TestID;

type StepGroupContextType = Required<Pick<StepGroupProps, 'size' | 'orientation'>> & {
  itemsInGroupCount: number;
  totalItemsInParentGroupCount: number;
};

type StepItemProps = {
  _index?: number;
  _nestingLevel?: StepGroupProps['_nestingLevel'];
  _totalIndex?: number;

  title: string;
  timestamp?: string;
  description?: string;
  /**
   * Progress line of step. When its start only starting part is highlighted and rest is kept dotted
   *
   * @default full
   */
  stepProgress?: 'start' | 'end' | 'full' | 'none';

  marker?: React.ReactElement;
  trailing?: React.ReactElement;
  isSelected?: boolean;
  href?: LinkProps['href'];
  target?: LinkProps['target'];
  onClick?: (event: React.MouseEvent) => void;
  children?: React.ReactNode;
};

type InteractiveItemHeaderProps = {
  isSelected: StepItemProps['isSelected'];
  paddingY: DotNotationSpacingStringToken;
  paddingX: DotNotationSpacingStringToken;
  minWidth?: `min(${string})`;
};

export type { StepGroupProps, StepGroupContextType, StepItemProps, InteractiveItemHeaderProps };
