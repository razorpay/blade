import React, { useEffect } from 'react';
import { Body, Row, Cell } from '@table-library/react-table-library/table';
import styled from 'styled-components';
import getIn from 'lodash/get';
import { useTableContext } from './TableContext';
import { checkboxCellWidth, tableRow } from './tokens';
import type { TableNode, TableProps } from './Table';
import { Text } from '~components/Typography';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { makeMotionTime, makeSize, makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { SurfaceLevels } from '~tokens/theme/theme';

type TableBodyProps = {
  /**
   * The children of the TableBody component should be TableRow components.
   * @example
   * <TableBody>
   *   <TableRow>
   *     <TableCell>...</TableCell>
   *   </TableRow>
   * </TableBody>
   **/
  children: React.ReactNode;
};

const StyledBody = styled(Body)<{ isSelectable: boolean; showStripedRows: boolean }>(
  ({ theme, showStripedRows, isSelectable }) => ({
    '&&&': {
      border: 'none',
      transition: `background-color ${makeMotionTime(
        getIn(theme.motion, tableRow.backgroundColorMotionDuration),
      )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
      '& tr:last-child td': {
        borderBottom: 'none',
      },

      '& .row-select-single-selected td, .row-select-selected td': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelected),
      },
      '& .row-select-single-selected:hover:not(.disabled-row) td, .row-select-selected:hover:not(.disabled-row) td': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedHover),
      },
      '& .row-select-single-selected:focus:not(.disabled-row) td, .row-select-selected:focus:not(.disabled-row) td': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedFocus),
      },
      '& .row-select-single-selected:active:not(.disabled-row) td, .row-select-selected:active:not(.disabled-row) td': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedActive),
      },

      ...(isSelectable && {
        '& tr:active:not(.disabled-row) .cell-wrapper': {
          backgroundColor: getIn(theme.colors, tableRow.nonStripeWrapper.backgroundColorActive),
        },
      }),

      ...(showStripedRows && {
        '& tr:nth-child(even) .cell-wrapper': {
          backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColor),
        },
        '& tr:nth-child(even) td': {
          backgroundColor: tableRow.stripe.backgroundColor,
        },
      }),

      ...(showStripedRows &&
        isSelectable && {
          '& tr:nth-child(even):hover:not(.disabled-row) .cell-wrapper': {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorHover),
          },
          '& tr:nth-child(even):focus:not(.disabled-row) .cell-wrapper': {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorFocus),
          },
          '& tr:nth-child(even):active:not(.disabled-row) .cell-wrapper': {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorActive),
          },
          '& .row-select-single-selected:nth-child(even) .cell-wrapper, .row-select-selected:nth-child(even) .cell-wrapper': {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorSelected),
          },
          '& .row-select-single-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper, .row-select-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper': {
            backgroundColor: getIn(
              theme.colors,
              tableRow.stripeWrapper.backgroundColorSelectedHover,
            ),
          },
          '& .row-select-single-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper, .row-select-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper': {
            backgroundColor: getIn(
              theme.colors,
              tableRow.stripeWrapper.backgroundColorSelectedFocus,
            ),
          },
          '& .row-select-single-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper, .row-select-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper': {
            backgroundColor: getIn(
              theme.colors,
              tableRow.stripeWrapper.backgroundColorSelectedActive,
            ),
          },

          '& tr:nth-child(even):hover:not(.disabled-row) td': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorHover),
          },
          '& tr:nth-child(even):focus:not(.disabled-row) td': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorFocus),
          },
          '& tr:nth-child(even):active:not(.disabled-row) td': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorActive),
          },

          '& .row-select-single-selected:nth-child(even) td, .row-select-selected:nth-child(even) td ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelected),
          },
          '& .row-select-single-selected:nth-child(even):hover:not(.disabled-row) td, .row-select-selected:nth-child(even):hover:not(.disabled-row) td ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedHover),
          },
          '& .row-select-single-selected:nth-child(even):focus:not(.disabled-row) td, .row-select-selected:nth-child(even):focus:not(.disabled-row) td ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedFocus),
          },
          '& .row-select-single-selected:nth-child(even):active:not(.disabled-row) td, .row-select-selected:nth-child(even):active:not(.disabled-row) td ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedActive),
          },
        }),
    },
  }),
);

const TableBody = ({ children }: TableBodyProps): React.ReactElement => {
  const { showStripedRows, selectionType } = useTableContext();
  const isSelectable = selectionType !== 'none';

  return (
    <StyledBody
      isSelectable={isSelectable}
      showStripedRows={showStripedRows}
      {...metaAttribute({ name: MetaConstants.TableBody })}
    >
      {children}
    </StyledBody>
  );
};

type TableCellProps = {
  /**
   * The children of the TableCell component should be a string or a ReactNode.
   * @example
   * <TableCell>{'Hello'}</TableCell>
   * <TableCell>
   *  <Text>...</Text>
   * </TableCell>
   * <TableCell>
   * <Button>...</Button>
   * </TableCell>
   **/
  children: React.ReactNode;
};

const StyledCell = styled(Cell)<{
  surfaceLevel: SurfaceLevels;
}>(({ theme, surfaceLevel }) => ({
  '&&&': {
    height: '100%',
    backgroundColor: getIn(theme.colors, `surface.background.level${surfaceLevel}.lowContrast`),
    '& > div:first-child': {
      alignSelf: 'stretch',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${getIn(theme.colors, tableRow.focusRingColor)} inset`,
    },
  },
}));

const CellWrapper = styled(BaseBox)<{
  rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  showStripedRows?: boolean;
}>(({ theme, rowDensity, showStripedRows }) => ({
  '&&&': {
    transition: `background-color ${makeMotionTime(
      getIn(theme.motion, tableRow.backgroundColorMotionDuration),
    )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
    backgroundColor: tableRow.nonStripeWrapper.backgroundColor,
    paddingTop: makeSpace(getIn(theme, tableRow.paddingTop[rowDensity])),
    paddingBottom: makeSpace(getIn(theme, tableRow.paddingBottom[rowDensity])),
    paddingLeft: makeSpace(getIn(theme, tableRow.paddingLeft[rowDensity])),
    paddingRight: makeSpace(getIn(theme, tableRow.paddingRight[rowDensity])),
    height: '100%',
    ...(!showStripedRows && {
      borderBottomWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
      borderBottomColor: getIn(theme.colors, tableRow.borderBottomColor),
      borderBottomStyle: 'solid',
    }),
  },
}));

const TableCell = ({ children }: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { selectionType, rowDensity, showStripedRows, surfaceLevel } = useTableContext();
  const isSelectable = selectionType !== 'none';

  return (
    <StyledCell
      tabIndex={0}
      surfaceLevel={surfaceLevel}
      {...metaAttribute({ name: MetaConstants.TableCell })}
    >
      <CellWrapper
        className="cell-wrapper"
        rowDensity={rowDensity}
        showStripedRows={showStripedRows}
        display="flex"
        alignItems="center"
        // when a direct string child is passed we want to disable pointer events
        // for custom cells components, consumers can handle pointer events themselves
        pointerEvents={isChildrenString && isSelectable ? 'none' : 'auto'}
      >
        {isChildrenString ? <Text size="medium">{children}</Text> : children}
      </CellWrapper>
    </StyledCell>
  );
};

const TableCheckboxCell = ({
  isChecked,
  onChange,
  isDisabled,
}: {
  isChecked: CheckboxProps['isChecked'];
  onChange: CheckboxProps['onChange'];
  isDisabled?: boolean;
}): React.ReactElement => {
  return (
    <TableCell>
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex={1}
        width={makeSize(checkboxCellWidth)}
      >
        <Checkbox isDisabled={isDisabled} isChecked={isChecked} onChange={onChange} />
      </BaseBox>
    </TableCell>
  );
};

type TableRowProps<Item> = {
  /**
   * The children of the TableRow component should be TableCell components.
   * @example
   * <TableRow>
   *   <TableCell>...</TableCell>
   * </TableRow>
   **/
  children: React.ReactNode;
  /**
   * The item prop is used to pass the individual table item to the TableRow component.
   * @example
   * tableData.map((tableItem) => (
   *   <TableRow item={item}>
   *     <TableCell>...</TableCell>
   *   </TableRow>
   * ));
   **/
  item: TableNode<Item>;
  /**
   * The isDisabled prop is used to disable the TableRow component.
   * @example
   * <TableRow isDisabled>
   *   <TableCell>...</TableCell>
   * </TableRow>
   **/
  isDisabled?: boolean;
};

const StyledRow = styled(Row)<{ isSelectable: boolean; showStripedRows?: boolean }>(
  ({ theme, isSelectable }) => ({
    '&&&': {
      backgroundColor: 'transparent',
      ...(isSelectable && {
        '&:hover:not(.disabled-row) td': {
          transition: `background-color ${makeMotionTime(
            getIn(theme.motion, tableRow.backgroundColorMotionDuration),
          )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorHover),
          cursor: 'pointer',
        },
        '&:focus:not(.disabled-row) td': {
          transition: `background-color ${makeMotionTime(
            getIn(theme.motion, tableRow.backgroundColorMotionDuration),
          )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorFocus),
          cursor: 'pointer',
        },
        '&:active:not(.disabled-row) td': {
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

const TableRow = <Item,>({
  children,
  item,
  isDisabled,
}: TableRowProps<Item>): React.ReactElement => {
  const {
    selectionType,
    selectedRows,
    toggleRowSelectionById,
    showStripedRows,
    setDisabledRows,
  } = useTableContext();
  const isSelectable = selectionType !== 'none';
  const isMultiSelect = selectionType === 'multiple';
  const isSelected = selectedRows?.includes(item.id);
  useEffect(() => {
    if (isDisabled) {
      setDisabledRows((prev) => [...prev, item.id]);
    }
  }, [isDisabled, item.id, setDisabledRows]);

  return (
    <StyledRow
      disabled={isDisabled}
      isSelectable={isDisabled ? false : isSelectable}
      showStripedRows={showStripedRows}
      item={item}
      className={isDisabled ? 'disabled-row' : ''}
      {...metaAttribute({ name: MetaConstants.TableRow })}
    >
      {isMultiSelect && (
        <TableCheckboxCell
          isChecked={isSelected}
          onChange={() => !isDisabled && toggleRowSelectionById(item.id)}
          isDisabled={isDisabled}
        />
      )}
      {children}
    </StyledRow>
  );
};

export { TableBody, TableRow, TableCell };
