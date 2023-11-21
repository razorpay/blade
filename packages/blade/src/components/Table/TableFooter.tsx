import React from 'react';
import { Footer, FooterRow, FooterCell } from '@table-library/react-table-library/table';
import getIn from 'lodash/get';
import styled from 'styled-components';
import { tableFooter } from './tokens';
import { useTableContext } from './TableContext';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { SurfaceLevels } from '~tokens/theme/theme';

type TableFooterProps = {
  children: React.ReactNode;
};

const StyledFooter = styled(Footer)(({ theme }) => ({
  '&&&': {
    backgroundColor: getIn(theme.colors, tableFooter.backgroundColor),
    '& tr:last-child th': {
      borderBottom: 'none',
    },
  },
}));

const TableFooter = ({ children }: TableFooterProps): React.ReactElement => {
  return (
    <StyledFooter isFooter {...metaAttribute({ name: MetaConstants.TableFooter })}>
      {children}
    </StyledFooter>
  );
};

type TableFooterRowProps = {
  children: React.ReactNode;
};

const TableFooterRow = ({ children }: TableFooterRowProps): React.ReactElement => {
  return (
    <FooterRow {...metaAttribute({ name: MetaConstants.TableFooterRow })}>{children}</FooterRow>
  );
};

type TableFooterCellProps = {
  children?: string;
};

const StyledFooterCell = styled(FooterCell)<{
  surfaceLevel: SurfaceLevels;
}>(({ theme, surfaceLevel }) => ({
  '&&&': {
    height: '100%',
    backgroundColor: getIn(theme.colors, `surface.background.level${surfaceLevel}.lowContrast`),
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

const TableFooterCell = ({ children }: TableFooterCellProps): React.ReactElement => {
  const { surfaceLevel } = useTableContext();
  const isChildrenString = typeof children === 'string';
  return (
    <StyledFooterCell
      surfaceLevel={surfaceLevel}
      {...metaAttribute({ name: MetaConstants.TableFooterCell })}
    >
      {isChildrenString ? (
        <Text size="medium" weight="bold">
          {children}
        </Text>
      ) : (
        children
      )}
    </StyledFooterCell>
  );
};

export { TableFooter, TableFooterRow, TableFooterCell };
