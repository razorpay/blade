import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

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

  _isFirstGroup?: boolean;
  _isLastGroup?: boolean;
} & StyledPropsBlade &
  TestID;

type StepGroupContextType = Pick<StepGroupProps, 'size' | 'orientation'> & {
  nestingLevel: number;
  itemsCount: number;
};

type StepItemProps = {
  _index?: number;
  _isFirstItem?: boolean;
  _isLastItem?: boolean;
};

export type { StepGroupProps, StepGroupContextType, StepItemProps };
