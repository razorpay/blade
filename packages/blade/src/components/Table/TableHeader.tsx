import React from 'react';
import getIn from 'lodash/get';
import styled from 'styled-components';
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';
import { tableHeader } from './tokens';
import { useTableContext } from './TableContext';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';

type TableHeaderProps = {
  children: React.ReactNode;
};

const StyledHeader = styled(Header)(({ theme }) => ({
  '&&&': {
    backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
    '& tr:first-child th': {
      borderTop: 'none',
    },
  },
}));

const TableHeader = ({ children }: TableHeaderProps): React.ReactElement => {
  return <StyledHeader>{children}</StyledHeader>;
};

type TableHeaderCellProps = {
  children: string | React.ReactNode;
};

const StyledHeaderCell = styled(HeaderCell)(({ theme }) => ({
  '&&&': {
    paddingTop: makeSpace(getIn(theme, tableHeader.paddingTop)),
    paddingBottom: makeSpace(getIn(theme, tableHeader.paddingBottom)),
    paddingLeft: makeSpace(getIn(theme, tableHeader.paddingLeft)),
    paddingRight: makeSpace(getIn(theme, tableHeader.paddingRight)),
    backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderTopWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderTopColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderBottomStyle: 'solid',
    borderTopStyle: 'solid',
  },
}));

const TableHeaderCell = ({ children }: TableHeaderCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';

  return (
    <StyledHeaderCell>
      {isChildrenString ? (
        <Text size="medium" weight="bold">
          {children}
        </Text>
      ) : (
        children
      )}
    </StyledHeaderCell>
  );
};

const TableHeaderCellCheckbox = ({
  isChecked,
  isIndeterminate,
  onChange,
}: {
  isChecked: CheckboxProps['isChecked'];
  isIndeterminate?: CheckboxProps['isIndeterminate'];
  onChange: CheckboxProps['onChange'];
}): React.ReactElement => {
  return (
    <TableHeaderCell>
      <Checkbox isChecked={isChecked} isIndeterminate={isIndeterminate} onChange={onChange} />
    </TableHeaderCell>
  );
};
type TableHeaderRowProps = {
  children: React.ReactNode;
};

const TableHeaderRow = ({ children }: TableHeaderRowProps): React.ReactElement => {
  const { selectionType, selectedRows, totalItems, toggleAllRowsSelection } = useTableContext();
  const isMultiSelect = selectionType === 'multiple';
  const isAllSelected = selectedRows && selectedRows.length === totalItems;
  const isIndeterminate = selectedRows && selectedRows.length > 0 && !isAllSelected;
  return (
    <HeaderRow>
      {isMultiSelect && (
        <TableHeaderCellCheckbox
          isChecked={isAllSelected}
          isIndeterminate={isIndeterminate}
          onChange={() => toggleAllRowsSelection()}
        />
      )}
      {children}
    </HeaderRow>
  );
};

export { TableHeader, TableHeaderRow, TableHeaderCell, TableHeaderCellCheckbox };
