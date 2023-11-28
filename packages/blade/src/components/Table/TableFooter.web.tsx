import React from 'react';
import { Footer, FooterRow, FooterCell } from '@table-library/react-table-library/table';
import getIn from 'lodash/get';
import styled from 'styled-components';
import { tableFooter } from './tokens';
import { useTableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import type { TableFooterProps, TableFooterRowProps, TableFooterCellProps } from './types';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { SurfaceLevels } from '~tokens/theme/theme';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

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
  $surfaceLevel: SurfaceLevels;
}>(({ theme, $surfaceLevel }) => ({
  '&&&': {
    height: '100%',
    backgroundColor: getIn(theme.colors, `surface.background.level${$surfaceLevel}.lowContrast`),
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
      paddingTop: makeSpace(getIn(theme, tableFooter.paddingTop)),
      paddingBottom: makeSpace(getIn(theme, tableFooter.paddingBottom)),
      paddingLeft: makeSpace(getIn(theme, tableFooter.paddingLeft)),
      paddingRight: makeSpace(getIn(theme, tableFooter.paddingRight)),
    },
  },
}));

const _TableFooterCell = ({ children }: TableFooterCellProps): React.ReactElement => {
  const { surfaceLevel } = useTableContext();
  const isChildrenString = typeof children === 'string';
  return (
    <StyledFooterCell
      $surfaceLevel={surfaceLevel}
      {...metaAttribute({ name: MetaConstants.TableFooterCell })}
    >
      {isChildrenString ? (
        <Text size="medium" weight="semibold">
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
