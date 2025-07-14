import React, { useEffect } from 'react';
import { Body, Row, Cell } from '@table-library/react-table-library/table';
import { Virtualized } from '@table-library/react-table-library/virtualized';
import styled from 'styled-components';
import { useTableContext } from './TableContext';
import { checkboxCellWidth, classes, tableRow } from './tokens';
import { ComponentIds } from './componentIds';
import type {
  TableProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableBackgroundColors,
  VirtualizedWrapperProps,
  RowHeightType,
  TableNode,
} from './types';
import { getTableActionsHoverStyles, getTableRowBackgroundTransition } from './utils';
import { getTableBodyStyles } from './commonStyles';
import getIn from '~utils/lodashButBetter/get';
import { Text } from '~components/Typography';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { getMediaQuery, makeMotionTime, makeSize, makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { size } from '~tokens/global';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
const StyledBody = styled(Body)<{
  $isSelectable: boolean;
  $showStripedRows: boolean;
}>(({ theme, $showStripedRows, $isSelectable }) => {
  const rowBackgroundTransition = getTableRowBackgroundTransition(theme);

  return {
    '&&&': {
      border: 'none',
      transition: rowBackgroundTransition,

      '& tr:last-child .cell-wrapper': {
        borderBottom: 'none',
      },

      ...{
        ...getTableBodyStyles({
          addCommonStyles: true,
          theme,
          isSelectable: $isSelectable,
          showStripedRows: $showStripedRows,
          isVirtualized: false,
        }),
      },
    },
  };
});

const _TableBody = <Item,>({ children, ...rest }: TableBodyProps<Item>): React.ReactElement => {
  const { showStripedRows, selectionType } = useTableContext();
  const isSelectable = selectionType !== 'none';

  return (
    <StyledBody
      $isSelectable={isSelectable}
      $showStripedRows={showStripedRows}
      $showBorderedCells={true}
      {...metaAttribute({ name: MetaConstants.TableBody })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledBody>
  );
};

const TableBody = assignWithoutSideEffects(_TableBody, {
  componentId: ComponentIds.TableBody,
});

export const StyledCell = styled(Cell)<{
  $backgroundColor: TableBackgroundColors;
}>(({ theme, $backgroundColor }) => ({
  '&&&': {
    height: '100%',
    backgroundColor: getIn(theme.colors, $backgroundColor),
    '& > div:first-child': {
      alignSelf: 'stretch',
    },
    '&:focus-visible': { ...getFocusRingStyles({ theme, negativeOffset: true }) },
  },
}));

export const CellWrapper = styled(BaseBox)<{
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  showStripedRows?: boolean;
  hasPadding?: boolean;
  textAlign?: TableCellProps['textAlign'];
}>(({ theme, $rowDensity, showStripedRows, hasPadding = true, textAlign }) => {
  const rowBackgroundTransition = `background-color ${makeMotionTime(
    getIn(theme.motion, tableRow.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`;

  return {
    '&&&': {
      transition: rowBackgroundTransition,
      backgroundColor: tableRow.nonStripeWrapper.backgroundColor,
      paddingLeft: hasPadding ? makeSpace(getIn(theme, tableRow.paddingLeft[$rowDensity])) : '0px',
      paddingRight: hasPadding
        ? makeSpace(getIn(theme, tableRow.paddingRight[$rowDensity]))
        : '0px',
      minHeight: makeSize(getIn(size, tableRow.minHeight[$rowDensity])),
      height: '100%',
      width: '100%',
      justifyContent: textAlign,
      ...(!showStripedRows && {
        borderBottomWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
        borderBottomColor: getIn(theme.colors, tableRow.borderColor),
        borderBottomStyle: 'solid',
      }),
    },
  };
});

const _TableCell = ({
  children,
  textAlign,
  _hasPadding,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  ...rest
}: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { selectionType, rowDensity, showStripedRows, backgroundColor } = useTableContext();
  const isSelectable = selectionType !== 'none';

  const hasRowSpan = Boolean(gridRowStart && gridRowEnd);
  const gridRowValue = hasRowSpan ? `${gridRowStart} / ${gridRowEnd}` : undefined;

  return (
    <StyledCell
      tabIndex={0}
      role="cell"
      className={hasRowSpan ? 'has-row-spanning' : ''}
      $backgroundColor={backgroundColor}
      gridColumnStart={gridColumnStart}
      gridColumnEnd={gridColumnEnd}
      style={{ gridRow: gridRowValue }}
      {...metaAttribute({ name: MetaConstants.TableCell })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox className="cell-wrapper-base" display="flex" alignItems="center" height="100%">
        <CellWrapper
          className="cell-wrapper"
          $rowDensity={rowDensity}
          showStripedRows={showStripedRows}
          display="flex"
          alignItems="center"
          hasPadding={_hasPadding}
          flex={1}
          textAlign={textAlign}
          // when a direct string child is passed we want to disable pointer events
          // for custom cells components, consumers can handle pointer events themselves
          pointerEvents={isChildrenString && isSelectable ? 'none' : 'auto'}
          // allow text to wrap, so that if the <Text> overflows it can truncate
          whiteSpace="normal"
          position="relative"
          {...metaAttribute({ name: MetaConstants.TableCellWrapper })}
        >
          {isChildrenString ? (
            <Text size="medium" truncateAfterLines={1}>
              {children}
            </Text>
          ) : (
            children
          )}
        </CellWrapper>
      </BaseBox>
    </StyledCell>
  );
};

const TableCell = assignWithoutSideEffects(_TableCell, {
  componentId: ComponentIds.TableCell,
});

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
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          isDisabled={isDisabled}
          isChecked={isChecked}
          onChange={onChange}
          {...makeAccessible({ label: 'Select Row' })}
        />
      </BaseBox>
    </TableCell>
  );
};

const StyledRow = styled(Row)<{
  $isSelectable: boolean;
  $isHoverable: boolean;
  $showBorderedCells: boolean;
  $isGrouped: boolean;
  $isGroupHeader: boolean;
}>(({ theme, $isSelectable, $isHoverable, $showBorderedCells, $isGrouped, $isGroupHeader }) => {
  const { hasHoverActions } = useTableContext();

  const rowBackgroundTransition = `background-color ${makeMotionTime(
    getIn(theme.motion, tableRow.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`;

  return {
    '&&&': {
      backgroundColor: 'transparent',
      '& .cell-wrapper': $showBorderedCells
        ? {
            borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
            borderRightStyle: 'solid',
            borderRightColor: getIn(theme.colors, tableRow.borderColor),
          }
        : undefined,
      '& td:last-child .cell-wrapper': {
        borderRight: 'none',
      },
      ...(hasHoverActions
        ? {
            [`@media ${getMediaQuery({ min: theme.breakpoints.m })}`]: {
              '& td:last-child': {
                opacity: 0,
                position: 'sticky',
                zIndex: 2,
                right: 0,
                width: '0px',
                '& > div:first-child': {
                  overflow: 'visible',
                },
              },
              '& td:last-child:focus-within': {
                opacity: 1,
                ...getTableActionsHoverStyles({
                  theme,
                  hoverColor: tableRow.nonStripe.backgroundColor,
                }),
              },
              '&:hover td:last-child': {
                opacity: 1,
              },
            },
          }
        : {}),
      ...(($isHoverable || $isSelectable) && {
        '&:hover:not(.disabled-row) .cell-wrapper-base': {
          transition: rowBackgroundTransition,
          cursor: 'pointer',
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorHover),
          ...getTableActionsHoverStyles({
            hoverColor: tableRow.nonStripe.backgroundColorHover,
            theme,
          }),
        },
      }),
      ...($isSelectable && {
        '&:focus:not(.disabled-row) .cell-wrapper-base': {
          transition: rowBackgroundTransition,
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorFocus),
          cursor: 'pointer',
          ...getTableActionsHoverStyles({
            hoverColor: tableRow.nonStripe.backgroundColorFocus,
            backgroundGradientColor: tableRow.nonStripe.backgroundColorHover,
            theme,
          }),
        },
        '&:active:not(.disabled-row) .cell-wrapper-base': {
          transition: rowBackgroundTransition,
          backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorActive),
          cursor: 'pointer',
        },
      }),
      '&:focus': getFocusRingStyles({ theme, negativeOffset: true }),
      ...($isGroupHeader && {
        '& td': {
          backgroundColor: getIn(theme.colors, tableRow.groupHeaderBackgroundColor),
        },
        '& .cell-wrapper': {
          borderTopWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderTopStyle: 'solid',
          borderTopColor: getIn(theme.colors, tableRow.borderColor),
          borderRight: 'none',
        },
      }),
      ...($isGrouped &&
        !$isGroupHeader && {
          '& .cell-wrapper': {
            border: 'none',
          },
        }),
    },
  };
});

const _TableRow = <Item,>({
  children,
  item,
  isDisabled,
  onHover,
  onClick,
  hoverActions,
  testID,
  ...rest
}: TableRowProps<Item>): React.ReactElement => {
  const {
    selectionType,
    selectedRows,
    toggleRowSelectionById,
    setDisabledRows,
    showBorderedCells,
    setHasHoverActions,
    isVirtualized,
    isGrouped,
  } = useTableContext();
  const isSelectable = selectionType !== 'none';
  const isMultiSelect = selectionType === 'multiple';
  const isSelected = selectedRows?.includes(item.id);
  const hasHoverActions = Boolean(hoverActions);
  const isGroupHeader =
    isGrouped &&
    (item as { treeXLevel?: number }).treeXLevel === 0 &&
    ((item as { nodes?: unknown[] }).nodes?.length ?? 0) > 0;

  useEffect(() => {
    if (isDisabled) {
      setDisabledRows((prev) => [...prev, item.id]);
    }
  }, [isDisabled, item.id, setDisabledRows]);

  useIsomorphicLayoutEffect(() => {
    if (hasHoverActions) {
      setHasHoverActions(true);
    }
  }, [hasHoverActions]);

  return (
    <StyledRow
      disabled={isDisabled}
      $isSelectable={isDisabled ? false : isSelectable}
      $isHoverable={isDisabled ? false : Boolean(onHover) || Boolean(onClick)}
      $showBorderedCells={showBorderedCells}
      item={item}
      className={isDisabled ? 'disabled-row' : ''}
      onMouseEnter={() => onHover?.({ item })}
      onClick={() => {
        onClick?.({ item });
        if (selectionType !== 'none' && !isDisabled) {
          toggleRowSelectionById(item.id);
        }
      }}
      {...makeAccessible({ selected: isSelected })}
      {...metaAttribute({ name: MetaConstants.TableRow, testID })}
      {...makeAnalyticsAttribute(rest)}
      $isVirtualized={isVirtualized}
      $isGrouped={isGrouped}
      $isGroupHeader={isGroupHeader}
    >
      {isMultiSelect && (
        <TableCheckboxCell
          isChecked={isSelected}
          onChange={() => !isDisabled && toggleRowSelectionById(item.id)}
          isDisabled={isDisabled}
        />
      )}
      {children}
      {hoverActions ? (
        <TableCell _hasPadding={false}>
          <BaseBox
            className={classes.HOVER_ACTIONS}
            position={{ base: 'relative', m: 'absolute' }}
            top="spacing.0"
            right="spacing.0"
            height="100%"
            flexShrink={0}
            flexGrow={1}
            width="max-content"
          >
            <BaseBox
              className={classes.HOVER_ACTIONS_LAYER2}
              height="100%"
              width="max-content"
              display="flex"
              alignItems="center"
            >
              <BaseBox
                height="100%"
                width="max-content"
                className={classes.HOVER_ACTIONS_LAYER3}
                display="flex"
                alignItems="center"
                paddingLeft={{ base: 'spacing.4', m: 'spacing.6' }}
                paddingRight="spacing.4"
                gap="spacing.3"
              >
                {hoverActions}
              </BaseBox>
            </BaseBox>
          </BaseBox>
        </TableCell>
      ) : null}
    </StyledRow>
  );
};

const _Virtulized = <Item,>({
  headerHeight,
  rowHeight,
  children,
}: VirtualizedWrapperProps): React.ReactElement => {
  const [parsedHeader = null, parsedBody = null] = React.Children.toArray(children);
  const { rowDensity, tableData } = useTableContext<Item>();
  const _tableRow = Number(tableRow.minHeight[rowDensity]);

  const _rowHeight = (item: TableNode<Item>, index: number): number => {
    if (index === 0) {
      return headerHeight ?? _tableRow;
    }
    return rowHeight ? rowHeight(item, index - 1) : _tableRow;
  };

  const bodyFunction =
    React.isValidElement(parsedBody) &&
    parsedBody.props &&
    typeof parsedBody.props === 'object' &&
    'children' in parsedBody.props
      ? parsedBody.props.children
      : null;

  return (
    <Virtualized
      tableList={tableData}
      rowHeight={_rowHeight as RowHeightType}
      header={() => parsedHeader}
      body={bodyFunction as (node: TableNode<Item>, index: number) => React.ReactNode}
    />
  );
};

const TableRow = assignWithoutSideEffects(_TableRow, {
  componentId: ComponentIds.TableRow,
});

const TableVirtualizedWrapper = assignWithoutSideEffects(_Virtulized, {
  componentId: ComponentIds.VirtualizedTable,
});
export { TableBody, TableRow, TableCell, TableVirtualizedWrapper };
