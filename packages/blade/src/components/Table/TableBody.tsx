import React from 'react';
import { Body, Row, Cell } from '@table-library/react-table-library/table';
import { tableRow } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type TableBodyProps = {
  children: React.ReactNode;
};

const TableBody = ({ children }: TableBodyProps): React.ReactElement => {
  return <Body>{children}</Body>;
};

type TableRowProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any; // TODO: Fix type
};

const TableRow = ({ children, item }: TableRowProps): React.ReactElement => {
  return <Row item={item}>{children}</Row>;
};

type TableCellProps = {
  children: React.ReactNode;
};

const TableCell = ({ children }: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';

  return (
    <Cell>
      <BaseBox
        paddingTop={tableRow.paddingTop}
        paddingBottom={tableRow.paddingBottom}
        paddingLeft={tableRow.paddingLeft}
        paddingRight={tableRow.paddingRight}
        borderBottomWidth={tableRow.borderBottomWidth}
        borderBottomColor={tableRow.borderBottomColor}
      >
        {isChildrenString ? <Text size="medium">{children}</Text> : children}
      </BaseBox>
    </Cell>
  );
};

export { TableBody, TableRow, TableCell };
