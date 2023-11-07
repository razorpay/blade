import React from 'react';
import getIn from 'lodash/get';
import styled from 'styled-components';
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';
import { tableHeader } from './tokens';
import { useTableContext } from './TableContext';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { castWebType, makeMotionTime, makeSpace, useTheme } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';

const SortButton = styled.button(({ theme }) => ({
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  margin: 0,
  borderRadius: theme.border.radius.small,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transitionProperty: 'color, box-shadow',
  transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, 'duration.quick'))),
  transitionTimingFunction: (theme.motion.easing.standard as unknown) as string,
  '&:focus-visible': {
    boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    outline: 'none',
  },
}));

const SortIcon = ({
  isSorted,
  isSortReversed,
  onClick,
}: {
  isSorted: boolean;
  isSortReversed: boolean;
  onClick: () => void;
}): React.ReactElement => {
  const { theme } = useTheme();
  const defaultColor = getIn(theme.colors, 'surface.action.icon.default.lowContrast');
  const activeColor = getIn(theme.colors, 'brand.primary.500');
  const upArrowColor = isSorted && isSortReversed ? activeColor : defaultColor;
  const downArrowColor = isSorted && !isSortReversed ? activeColor : defaultColor;
  return (
    <SortButton {...makeAccessible({ label: 'Toggle Sort', role: 'button' })} onClick={onClick}>
      <svg width={20} height={20} fill="none">
        <path
          fill={upArrowColor}
          fillRule="evenodd"
          d="M14.342 7.854a.5.5 0 0 1-.707 0l-2.647-2.647-2.646 2.647a.5.5 0 1 1-.707-.708l3-3a.5.5 0 0 1 .707 0l3 3a.5.5 0 0 1 0 .708Z"
          clipRule="evenodd"
        />
        <path
          fill={downArrowColor}
          fillRule="evenodd"
          d="M7.635 12.146a.5.5 0 0 1 .707 0l2.646 2.647 2.647-2.647a.5.5 0 0 1 .707.708l-3 3a.5.5 0 0 1-.707 0l-3-3a.5.5 0 0 1 0-.708Z"
          clipRule="evenodd"
        />
      </svg>
    </SortButton>
  );
};

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

export type TableHeaderCellProps = {
  children: string | React.ReactNode;
  headerKey: string;
};

const StyledHeaderCell = styled(HeaderCell)(({ theme }) => ({
  '&&&': {
    backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderTopWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderTopColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderBottomStyle: 'solid',
    borderTopStyle: 'solid',
    '> div': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: makeSpace(getIn(theme, tableHeader.paddingTop)),
      paddingBottom: makeSpace(getIn(theme, tableHeader.paddingBottom)),
      paddingLeft: makeSpace(getIn(theme, tableHeader.paddingLeft)),
      paddingRight: makeSpace(getIn(theme, tableHeader.paddingRight)),
    },
  },
}));

const TableHeaderCell = ({ children, headerKey }: TableHeaderCellProps): React.ReactElement => {
  const { toggleSort, currentSortedState } = useTableContext();
  const isChildrenString = typeof children === 'string';
  const isSortable = Boolean(currentSortedState.sortableColumns?.find((key) => key === headerKey));
  return (
    <StyledHeaderCell>
      {isChildrenString ? (
        <Text size="medium" weight="bold">
          {children}
        </Text>
      ) : (
        children
      )}
      {isSortable && (
        <SortIcon
          isSorted={currentSortedState.sortKey === headerKey}
          isSortReversed={currentSortedState.isSortReversed}
          onClick={() => toggleSort(headerKey)}
        />
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
    <TableHeaderCell headerKey="SELECT">
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
