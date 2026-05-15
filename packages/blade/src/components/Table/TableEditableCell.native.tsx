/* eslint-disable @typescript-eslint/no-unused-vars */
import { Text } from '~components/Typography';

import type { TableEditableCellProps, TableEditableDropdownCellProps } from './types';

const TableEditableCell = (props: TableEditableCellProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

const TableEditableDropdownCell = (props: TableEditableDropdownCellProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

export { TableEditableCell, TableEditableDropdownCell };
