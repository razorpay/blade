import React from 'react';
import { Footer, FooterRow, FooterCell } from '@table-library/react-table-library/table';
import styled from 'styled-components';
import { tableFooter, tableRow } from './tokens';
import { ComponentIds } from './componentIds';
import type {
  TableFooterProps,
  TableFooterRowProps,
  TableFooterCellProps,
  TableBackgroundColors,
  TableProps,
} from './types';
import { useTableContext } from './TableContext';
import { Text } from '~components/Typography';
import { makeSize, makeSpace } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import getIn from '~utils/lodashButBetter/get';
import { size } from '~tokens/global';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const StyledFooter = styled(Footer)(({ theme }) => ({
  '&&&': {
    backgroundColor: getIn(theme.colors, tableFooter.backgroundColor),
    '& tr:last-child th': {
      borderBottom: 'none',
    },
  },
}));

const _TableFooter = ({ children, ...rest }: TableFooterProps): React.ReactElement => {
  return (
    <StyledFooter
      isFooter
      {...metaAttribute({ name: MetaConstants.TableFooter })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledFooter>
  );
};

const TableFooter = assignWithoutSideEffects(_TableFooter, {
  componentId: ComponentIds.TableFooter,
});

const StyledFooterRow = styled(FooterRow)<{ $showBorderedCells: boolean }>(
  ({ theme, $showBorderedCells }) => ({
    '& th': $showBorderedCells
      ? {
          borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderRightColor: getIn(theme.colors, tableRow.borderColor),
          borderRightStyle: 'solid',
        }
      : undefined,
    '& th:last-child ': {
      borderRight: 'none',
    },
  }),
);

const _TableFooterRow = ({ children, ...rest }: TableFooterRowProps): React.ReactElement => {
  const { showBorderedCells } = useTableContext();
  return (
    <StyledFooterRow
      {...metaAttribute({ name: MetaConstants.TableFooterRow })}
      {...makeAnalyticsAttribute(rest)}
      $showBorderedCells={showBorderedCells}
    >
      {children}
    </StyledFooterRow>
  );
};

const TableFooterRow = assignWithoutSideEffects(_TableFooterRow, {
  componentId: ComponentIds.TableFooterRow,
});

const StyledFooterCell = styled(FooterCell)<{
  $backgroundColor: TableBackgroundColors;
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  $textAlign?: string;
}>(({ theme, $backgroundColor, $rowDensity, $textAlign }) => ({
  '&&&': {
    height: '100%',
    backgroundColor: getIn(theme.colors, $backgroundColor),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableFooter.borderBottomAndTopWidth)),
    borderTopWidth: makeSpace(getIn(theme.border.width, tableFooter.borderBottomAndTopWidth)),
    borderBottomColor: getIn(theme.colors, tableFooter.borderBottomAndTopColor),
    borderTopColor: getIn(theme.colors, tableFooter.borderBottomAndTopColor),
    borderBottomStyle: 'solid',
    borderTopStyle: 'solid',
    '> div': {
      backgroundColor: getIn(theme.colors, tableFooter.backgroundColor),
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      paddingLeft: makeSpace(getIn(theme, tableRow.paddingLeft[$rowDensity])),
      paddingRight: makeSpace(getIn(theme, tableRow.paddingRight[$rowDensity])),
      minHeight: makeSize(getIn(size, tableRow.minHeight[$rowDensity])),
      alignItems: 'center',
      justifyContent: $textAlign ? $textAlign : 'left',
    },
  },
}));

const _TableFooterCell = ({
  children,
  textAlign,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  ...rest
}: TableFooterCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { backgroundColor, rowDensity } = useTableContext();

  const hasRowSpan = Boolean(gridRowStart && gridRowEnd);
  const gridRowValue = hasRowSpan ? `${gridRowStart} / ${gridRowEnd}` : undefined;

  return (
    <StyledFooterCell
      className={hasRowSpan ? 'has-row-spanning' : ''}
      gridColumnStart={gridColumnStart}
      gridColumnEnd={gridColumnEnd}
      $backgroundColor={backgroundColor}
      $rowDensity={rowDensity}
      $textAlign={textAlign}
      style={{ gridRow: gridRowValue }}
      {...metaAttribute({ name: MetaConstants.TableFooterCell })}
      {...makeAnalyticsAttribute(rest)}
    >
      {isChildrenString ? (
        <Text size="medium" weight="medium">
          {children}
        </Text>
      ) : (
        children
      )}
    </StyledFooterCell>
  );
};

const TableFooterCell = assignWithoutSideEffects(_TableFooterCell, {
  componentId: ComponentIds.TableFooterCell,
});

export { TableFooter, TableFooterRow, TableFooterCell };
