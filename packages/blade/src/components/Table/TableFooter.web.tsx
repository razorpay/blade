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

const StyledFooter = styled(Footer)(({ theme }) => ({
  '&&&': {
    backgroundColor: getIn(theme.colors, tableFooter.backgroundColor),
    '& tr:last-child th': {
      borderBottom: 'none',
    },
  },
}));

const _TableFooter = ({ children }: TableFooterProps): React.ReactElement => {
  return (
    <StyledFooter isFooter {...metaAttribute({ name: MetaConstants.TableFooter })}>
      {children}
    </StyledFooter>
  );
};

const TableFooter = assignWithoutSideEffects(_TableFooter, {
  componentId: ComponentIds.TableFooter,
});

const _TableFooterRow = ({ children }: TableFooterRowProps): React.ReactElement => {
  return (
    <FooterRow {...metaAttribute({ name: MetaConstants.TableFooterRow })}>{children}</FooterRow>
  );
};

const TableFooterRow = assignWithoutSideEffects(_TableFooterRow, {
  componentId: ComponentIds.TableFooterRow,
});

const StyledFooterCell = styled(FooterCell)<{
  $backgroundColor: TableBackgroundColors;
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
}>(({ theme, $backgroundColor, $rowDensity }) => ({
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
    },
  },
}));

const _TableFooterCell = ({ children }: TableFooterCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { backgroundColor, rowDensity } = useTableContext();

  return (
    <StyledFooterCell
      $backgroundColor={backgroundColor}
      $rowDensity={rowDensity}
      {...metaAttribute({ name: MetaConstants.TableFooterCell })}
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
