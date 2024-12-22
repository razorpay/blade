import React, { useEffect } from 'react';
import { Body, Row, Cell } from '@table-library/react-table-library/table';
import styled from 'styled-components';
import { useTableContext } from './TableContext';
import { checkboxCellWidth, classes, tableBackgroundColor, tableRow } from './tokens';
import { ComponentIds } from './componentIds';
import type {
  TableProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableBackgroundColors,
} from './types';
import getIn from '~utils/lodashButBetter/get';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
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
import type { Theme } from '~components/BladeProvider';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const getTableRowBackgroundTransition = (theme: Theme): string => {
  const rowBackgroundTransition = `background-color ${makeMotionTime(
    getIn(theme.motion, tableRow.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`;

  return rowBackgroundTransition;
};

const getTableActionsHoverStyles = ({
  hoverColor,
  theme,
  backgroundGradientColor,
}: {
  hoverColor: DotNotationToken<Theme['colors']>;
  backgroundGradientColor?: DotNotationToken<Omit<Theme['colors'], 'name'>>;
  theme: Theme;
}): React.CSSProperties => {
  const rowBackgroundTransition = getTableRowBackgroundTransition(theme);

  return {
    // Solid layer 1 background - should match the table background
    [`& .${classes.HOVER_ACTIONS}`]: {
      backgroundColor: getIn(theme.colors, tableBackgroundColor),
      transition: rowBackgroundTransition,
    },
    // Alpha layer 2 background - Stripped row background, Hover background in selected state, etc
    [`& .${classes.HOVER_ACTIONS_LAYER2}`]: {
      backgroundColor: getIn(theme.colors, backgroundGradientColor ?? 'transparent'),
      transition: rowBackgroundTransition,
    },
    // Alpha layer 3 background - Hover, selection, active background
    [`& .${classes.HOVER_ACTIONS_LAYER3}`]: {
      backgroundColor: getIn(theme.colors, hoverColor),
      transition: rowBackgroundTransition,
    },
  };
};

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

      '& .row-select-single-selected .cell-wrapper-base, .row-select-selected .cell-wrapper-base': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelected),
      },
      '& .row-select-single-selected:hover:not(.disabled-row) .cell-wrapper-base, .row-select-selected:hover:not(.disabled-row) .cell-wrapper-base': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedHover),
        ...getTableActionsHoverStyles({
          hoverColor: tableRow.nonStripe.backgroundColorSelectedHover,
          backgroundGradientColor: tableRow.nonStripeWrapper.backgroundColorSelectedHover,
          theme,
        }),
      },
      '& .row-select-single-selected:focus:not(.disabled-row) .cell-wrapper-base, .row-select-selected:focus:not(.disabled-row) .cell-wrapper-base': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedFocus),
        ...getTableActionsHoverStyles({
          hoverColor: tableRow.nonStripe.backgroundColorSelectedFocus,
          backgroundGradientColor: tableRow.nonStripeWrapper.backgroundColorSelectedFocus,
          theme,
        }),
      },
      '& .row-select-single-selected:active:not(.disabled-row) .cell-wrapper-base, .row-select-selected:active:not(.disabled-row) .cell-wrapper-base': {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedActive),
        ...getTableActionsHoverStyles({
          hoverColor: tableRow.nonStripe.backgroundColorSelectedActive,
          backgroundGradientColor: tableRow.nonStripe.backgroundColorHover,
          theme,
        }),
      },

      ...($isSelectable && {
        '& tr:active:not(.disabled-row) .cell-wrapper': {
          backgroundColor: getIn(theme.colors, tableRow.nonStripeWrapper.backgroundColorActive),
        },
      }),

      ...($showStripedRows && {
        '& tr:nth-child(even) .cell-wrapper': {
          backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColor),
        },
        '& tr:nth-child(even) .cell-wrapper-base': {
          backgroundColor: tableRow.stripe.backgroundColor,
        },
      }),

      ...($showStripedRows &&
        $isSelectable && {
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

          '& tr:nth-child(even):hover:not(.disabled-row) .cell-wrapper-base': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorHover),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorHover,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorHover,
            }),
          },
          '& tr:nth-child(even):focus:not(.disabled-row) .cell-wrapper-base': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorFocus),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorFocus,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorFocus,
            }),
          },
          '& tr:nth-child(even):active:not(.disabled-row) .cell-wrapper-base': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorActive),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorActive,
              backgroundGradientColor: tableRow.stripe.backgroundColorHover,
              theme,
            }),
          },

          '& .row-select-single-selected:nth-child(even) .cell-wrapper-base, .row-select-selected:nth-child(even) .cell-wrapper-base ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelected),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelected,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorSelected,
            }),
          },
          '& .row-select-single-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper-base, .row-select-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper-base ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedHover),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelectedHover,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorSelectedHover,
            }),
          },
          '& .row-select-single-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper-base, .row-select-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper-base ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedFocus),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelectedFocus,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorSelectedFocus,
            }),
          },
          '& .row-select-single-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper-base, .row-select-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper-base ': {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedActive),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelectedActive,
              theme,
              backgroundGradientColor: tableRow.stripe.backgroundColorHover,
            }),
          },
        }),
    },
  };
});

const _TableBody = ({ children, ...rest }: TableBodyProps): React.ReactElement => {
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
}>(({ theme, $rowDensity, showStripedRows, hasPadding = true }) => {
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
      ...(!showStripedRows && {
        borderBottomWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
        borderBottomColor: getIn(theme.colors, tableRow.borderColor),
        borderBottomStyle: 'solid',
      }),
    },
  };
});

const _TableCell = ({ children, _hasPadding, ...rest }: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { selectionType, rowDensity, showStripedRows, backgroundColor } = useTableContext();
  const isSelectable = selectionType !== 'none';

  return (
    <StyledCell
      tabIndex={0}
      role="cell"
      $backgroundColor={backgroundColor}
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
          // when a direct string child is passed we want to disable pointer events
          // for custom cells components, consumers can handle pointer events themselves
          pointerEvents={isChildrenString && isSelectable ? 'none' : 'auto'}
          // allow text to wrap, so that if the <Text> overflows it can truncate
          whiteSpace="normal"
          position="relative"
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
        <Checkbox isDisabled={isDisabled} isChecked={isChecked} onChange={onChange} />
      </BaseBox>
    </TableCell>
  );
};

const StyledRow = styled(Row)<{
  $isSelectable: boolean;
  $isHoverable: boolean;
  $showBorderedCells: boolean;
}>(({ theme, $isSelectable, $isHoverable, $showBorderedCells }) => {
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
          ...getTableActionsHoverStyles({
            hoverColor: tableRow.nonStripe.backgroundColorActive,
            backgroundGradientColor: tableRow.nonStripe.backgroundColorHover,
            theme,
          }),
        },
      }),
      '&:focus': getFocusRingStyles({ theme, negativeOffset: true }),
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
  } = useTableContext();
  const isSelectable = selectionType !== 'none';
  const isMultiSelect = selectionType === 'multiple';
  const isSelected = selectedRows?.includes(item.id);
  const hasHoverActions = Boolean(hoverActions);

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
      onClick={() => onClick?.({ item })}
      {...makeAccessible({ selected: isSelected })}
      {...metaAttribute({ name: MetaConstants.TableRow, testID })}
      {...makeAnalyticsAttribute(rest)}
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

const TableRow = assignWithoutSideEffects(_TableRow, {
  componentId: ComponentIds.TableRow,
});

export { TableBody, TableRow, TableCell };
