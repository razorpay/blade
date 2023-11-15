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
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';

type TableBodyProps = {
  children: React.ReactNode;
};

const StyledBody = styled(Body)(({ theme, showStripes }) => ({
  '&&': {
    '& tr:nth-child(even)': {
      backgroundColor: showStripes ? theme.colors.brand.gray.a50.lowContrast : undefined,
    },
  },
  '&&&': {
    border: 'none',

    '& tr:last-child td': {
      borderBottom: 'none',
    },
    '& .row-select-single-selected, .row-select-selected': {
      transition: `background-color ${makeMotionTime(
        getIn(theme.motion, tableRow.backgroundColorMotionDuration),
      )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
      backgroundColor: getIn(theme.colors, tableRow.backgroundColorSelected),
    },
    '& .row-select-single-selected:hover, .row-select-selected:hover': {
      transition: `background-color ${makeMotionTime(
        getIn(theme.motion, tableRow.backgroundColorMotionDuration),
      )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
      backgroundColor: getIn(theme.colors, tableRow.backgroundColorSelectedHover),
    },
  },
}));

const TableBody = ({ children }: TableBodyProps): React.ReactElement => {
  const { showStripes } = useTableContext();
  return <StyledBody showStripes={showStripes}>{children}</StyledBody>;
};

type TableCellProps = {
  children: React.ReactNode;
};

const StyledCell = styled(Cell)<{
  isSelectable: boolean;
  rowDensity: NonNullable<TableProps['rowDensity']>;
  showStripes?: boolean;
}>(({ theme, isSelectable, rowDensity, showStripes }) => ({
  '&&&': {
    paddingTop: makeSpace(getIn(theme, tableRow.paddingTop[rowDensity])),
    paddingBottom: makeSpace(getIn(theme, tableRow.paddingBottom[rowDensity])),
    paddingLeft: makeSpace(getIn(theme, tableRow.paddingLeft[rowDensity])),
    paddingRight: makeSpace(getIn(theme, tableRow.paddingRight[rowDensity])),
    ...(!showStripes && {
      borderBottomWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
      borderBottomColor: getIn(theme.colors, tableRow.borderBottomColor),
      borderBottomStyle: 'solid',
    }),
    '& div:first-child': {
      pointerEvents: isSelectable ? 'none' : 'auto',
    },
    '&: focus-visible': {
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${getIn(theme.colors, tableRow.focusRingColor)} inset`,
    },
  },
}));

const TableCell = ({ children }: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { selectionType, rowDensity, showStripes } = useTableContext();
  const isSelectable = Boolean(selectionType);
  return (
    <StyledCell
      tabIndex={0}
      isSelectable={isSelectable}
      rowDensity={rowDensity}
      showStripes={showStripes}
    >
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

const StyledRow = styled(Row)<{ isSelectable: boolean; showStripes?: boolean }>(
  ({ theme, isSelectable, showStripes }) => ({
    '&&&': {
      backgroundColor: 'transparent',
      '&:hover': isSelectable
        ? {
            transition: `background-color ${makeMotionTime(
              getIn(theme.motion, tableRow.backgroundColorMotionDuration),
            )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
            backgroundColor: getIn(
              theme.colors,
              showStripes ? tableRow.backgroundColorStripesHover : tableRow.backgroundColorHover,
            ),
            cursor: 'pointer',
          }
        : undefined,
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${getIn(theme.colors, 'brand.primary.300')}`,
      },
    },
  }),
);

const TableRow = ({ children, item }: TableRowProps): React.ReactElement => {
  const { selectionType, selectedRows, toggleRowSelectionById, showStripes } = useTableContext();
  const isSelectable = Boolean(selectionType);
  const isMultiSelect = selectionType === 'multiple';
  const isSelected = selectedRows?.includes(item.id);
  return (
    <StyledRow isSelectable={isSelectable} showStripes={showStripes} item={item}>
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
