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
import { makeMotionTime, makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';

type TableBodyProps = {
  children: React.ReactNode;
};

const StyledBody = styled(Body)(({ theme, showStripes }) => ({
  '&&&': {
    border: 'none',
    transition: `background-color ${makeMotionTime(
      getIn(theme.motion, tableRow.backgroundColorMotionDuration),
    )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,

    ...(showStripes && {
      '& tr:nth-child(even) .cell-wrapper': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColor),
      },
      '& tr:nth-child(even):hover .cell-wrapper': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorHover),
      },
      '& tr:nth-child(even):focus .cell-wrapper': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorFocus),
      },
      '& tr:nth-child(even):active .cell-wrapper': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorActive),
      },
      '& .row-select-single-selected:nth-child(even) .cell-wrapper, .row-select-selected:nth-child(even) .cell-wrapper ': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorSelected),
      },
      '& .row-select-single-selected:nth-child(even):hover .cell-wrapper, .row-select-selected:nth-child(even):hover .cell-wrapper ': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorSelectedHover),
      },
      '& .row-select-single-selected:nth-child(even):focus .cell-wrapper, .row-select-selected:nth-child(even):focus .cell-wrapper ': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorSelectedFocus),
      },
      '& .row-select-single-selected:nth-child(even):active .cell-wrapper, .row-select-selected:nth-child(even):active .cell-wrapper ': {
        backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorSelectedActive),
      },
      '& tr:nth-child(even) td': {
        backgroundColor: tableRow.stripe.backgroundColor,
      },
      '& tr:nth-child(even):hover td': {
        backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorHover),
      },
      '& tr:nth-child(even):focus td': {
        backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorFocus),
      },
      '& tr:nth-child(even):active td': {
        backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorActive),
      },

      '& .row-select-single-selected:nth-child(even) td, .row-select-selected:nth-child(even) td ': {
        backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelected),
      },
      '& .row-select-single-selected:nth-child(even):hover td, .row-select-selected:nth-child(even):hover td ': {
        backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedHover),
      },
      '& .row-select-single-selected:nth-child(even):focus td, .row-select-selected:nth-child(even):focus td ': {
        backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedFocus),
      },
      '& .row-select-single-selected:nth-child(even):active td, .row-select-selected:nth-child(even):active td ': {
        backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedActive),
      },
    }),

    '& tr:last-child td': {
      borderBottom: 'none',
    },
    '& .row-select-single-selected td, .row-select-selected td': {
      backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelected),
    },
    '& .row-select-single-selected:hover td, .row-select-selected:hover td': {
      backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedHover),
    },
    '& .row-select-single-selected:focus td, .row-select-selected:focus td': {
      backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedFocus),
    },
    '& .row-select-single-selected:active td, .row-select-selected:active td': {
      backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedActive),
    },
    '& tr:active .cell-wrapper': {
      backgroundColor: getIn(theme.colors, tableRow.nonStripeWrapper.backgroundColorActive),
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
    height: '100%',
    paddingTop: makeSpace(getIn(theme, tableRow.paddingTop[rowDensity])),
    paddingBottom: makeSpace(getIn(theme, tableRow.paddingBottom[rowDensity])),
    paddingLeft: makeSpace(getIn(theme, tableRow.paddingLeft[rowDensity])),
    paddingRight: makeSpace(getIn(theme, tableRow.paddingRight[rowDensity])),
    backgroundColor: tableRow.nonStripe.backgroundColor,
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

const CellWrapper = styled(BaseBox)(({ theme }) => ({
  '&&&': {
    transition: `background-color ${makeMotionTime(
      getIn(theme.motion, tableRow.backgroundColorMotionDuration),
    )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
    backgroundColor: tableRow.nonStripeWrapper.backgroundColor,
  },
}));

const TableCell = ({ children }: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { selectionType, rowDensity, showStripes } = useTableContext();
  const isSelectable = Boolean(selectionType);
  return (
    <CellWrapper className="cell-wrapper">
      <StyledCell
        tabIndex={0}
        isSelectable={isSelectable}
        rowDensity={rowDensity}
        showStripes={showStripes}
      >
        {isChildrenString ? <Text size="medium">{children}</Text> : children}
      </StyledCell>
    </CellWrapper>
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
      ...(isSelectable && {
        '&:hover td': {
          transition: `background-color ${makeMotionTime(
            getIn(theme.motion, tableRow.backgroundColorMotionDuration),
          )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorHover),
          cursor: 'pointer',
        },
        '&:focus td': {
          transition: `background-color ${makeMotionTime(
            getIn(theme.motion, tableRow.backgroundColorMotionDuration),
          )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorFocus),
          cursor: 'pointer',
        },
        '&:active td': {
          transition: `background-color ${makeMotionTime(
            getIn(theme.motion, tableRow.backgroundColorMotionDuration),
          )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorActive),
          cursor: 'pointer',
        },
      }),
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
