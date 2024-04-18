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

  _nestingLevel?: number;
} & StyledPropsBlade &
  TestID;

type StepGroupContextType = Pick<StepGroupProps, 'size' | 'orientation'> & {
  itemsInGroupCount: number;
  totalItemsInParentGroupCount: number;
};

type StepItemProps = {
  _index?: number;
  _nestingLevel?: StepGroupProps['_nestingLevel'];
  _totalIndex?: number;
};

export type { StepGroupProps, StepGroupContextType, StepItemProps };
