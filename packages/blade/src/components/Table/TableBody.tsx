import React from 'react';
import { Body, Row, Cell } from '@table-library/react-table-library/table';
import styled from 'styled-components';
import getIn from 'lodash/get';
import { useTableContext } from './TableContext';
import { tableRow } from './tokens';
import type { TableProps } from './Table';
import { Text } from '~components/Typography';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { makeSpace } from '~utils';

type TableBodyProps = {
  children: React.ReactNode;
};

const StyledBody = styled(Body)(({ theme }) => ({
  '&&&': {
    border: 'none',
    '& .row-select-single-selected, .row-select-selected': {
      backgroundColor: getIn(theme.colors, tableRow.backgroundColorSelected),
    },
    '& .row-select-single-selected:hover, .row-select-selected:hover': {
      backgroundColor: getIn(theme.colors, tableRow.backgroundColorSelectedHover),
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
}));

const TableBody = ({ children }: TableBodyProps): React.ReactElement => {
  return <StyledBody>{children}</StyledBody>;
};

type TableCellProps = {
  children: React.ReactNode;
};

const StyledCell = styled(Cell)<{
  isSelectable: boolean;
  cellDensity: NonNullable<TableProps['cellDensity']>;
}>(({ theme, isSelectable, cellDensity }) => ({
  '&&&': {
    paddingTop: makeSpace(getIn(theme, tableRow.paddingTop[cellDensity])),
    paddingBottom: makeSpace(getIn(theme, tableRow.paddingBottom[cellDensity])),
    paddingLeft: makeSpace(getIn(theme, tableRow.paddingLeft[cellDensity])),
    paddingRight: makeSpace(getIn(theme, tableRow.paddingRight[cellDensity])),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
    borderBottomColor: getIn(theme.colors, tableRow.borderBottomColor),
    borderBottomStyle: 'solid',
    '& div:first-child': {
      pointerEvents: isSelectable ? 'none' : 'auto',
    },
  },
}));

const TableCell = ({ children }: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { selectionType, cellDensity } = useTableContext();
  const isSelectable = Boolean(selectionType);
  return (
    <StyledCell isSelectable={isSelectable} cellDensity={cellDensity}>
      {isChildrenString ? <Text size="medium">{children}</Text> : children}
    </StyledCell>
  );
};

const TableCheckboxCell = ({
  isChecked,
  onChange,
}: {
  isChecked: CheckboxProps['isChecked'];
  onChange: CheckboxProps['onChange'];
}): React.ReactElement => {
  return (
    <TableCell>
      <Checkbox isChecked={isChecked} onChange={onChange} />
    </TableCell>
  );
};

type TableRowProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any; // TODO: Fix type
};

const StyledRow = styled(Row)<{ isSelectable: boolean }>(({ theme, isSelectable }) => ({
  '&&&': {
    '&:hover': isSelectable
      ? {
          backgroundColor: getIn(theme.colors, tableRow.backgroundColorHover),
          cursor: 'pointer',
        }
      : undefined,
  },
}));

const TableRow = ({ children, item }: TableRowProps): React.ReactElement => {
  const { selectionType, selectedRows, toggleRowSelectionById } = useTableContext();
  const isSelectable = Boolean(selectionType);
  const isMultiSelect = selectionType === 'multiple';
  const isSelected = selectedRows?.includes(item.id);
  return (
    <StyledRow isSelectable={isSelectable} item={item}>
      {isMultiSelect && (
        <TableCheckboxCell
          isChecked={isSelected}
          onChange={() => toggleRowSelectionById(item.id)}
        />
      )}
      {children}
    </StyledRow>
  );
};

export { TableBody, TableRow, TableCell, TableCheckboxCell };
