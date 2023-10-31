import React from 'react';
import { Body, Row, Cell } from '@table-library/react-table-library/table';
import styled from 'styled-components';
import getIn from 'lodash/get';
import { tableRow } from './tokens';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';

type TableBodyProps = {
  children: React.ReactNode;
};

const StyledBody = styled(Body)({
  '&&&': {
    border: 'none',
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
});

const TableBody = ({ children }: TableBodyProps): React.ReactElement => {
  return <StyledBody>{children}</StyledBody>;
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

const StyledCell = styled(Cell)(({ theme }) => ({
  '&&&': {
    paddingTop: makeSpace(getIn(theme, tableRow.paddingTop)),
    paddingBottom: makeSpace(getIn(theme, tableRow.paddingBottom)),
    paddingLeft: makeSpace(getIn(theme, tableRow.paddingLeft)),
    paddingRight: makeSpace(getIn(theme, tableRow.paddingRight)),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
    borderBottomColor: getIn(theme.colors, tableRow.borderBottomColor),
    borderBottomStyle: 'solid',
  },
}));

const TableCell = ({ children }: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';

  return (
    <StyledCell>{isChildrenString ? <Text size="medium">{children}</Text> : children}</StyledCell>
  );
};

export { TableBody, TableRow, TableCell };
