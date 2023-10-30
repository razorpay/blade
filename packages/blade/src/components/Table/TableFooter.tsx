import React from 'react';
import { Footer, FooterRow, FooterCell } from '@table-library/react-table-library/table';
import { tableFooter } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type TableFooterProps = {
  children: React.ReactNode;
};

const TableFooter = ({ children }: TableFooterProps): React.ReactElement => {
  return <Footer>{children}</Footer>;
};

type TableFooterRowProps = {
  children: React.ReactNode;
};

const TableFooterRow = ({ children }: TableFooterRowProps): React.ReactElement => {
  return <FooterRow>{children}</FooterRow>;
};

type TableFooterCellProps = {
  children?: string;
};

const TableFooterCell = ({ children }: TableFooterCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  return (
    <FooterCell>
      <BaseBox
        paddingTop={tableFooter.paddingTop}
        paddingBottom={tableFooter.paddingBottom}
        paddingLeft={tableFooter.paddingLeft}
        paddingRight={tableFooter.paddingRight}
        backgroundColor={tableFooter.backgroundColor}
        borderBottomWidth={tableFooter.borderBottomAndTopWidth}
        borderTopWidth={tableFooter.borderBottomAndTopWidth}
        borderBottomColor={tableFooter.borderBottomAndTopColor}
        borderTopColor={tableFooter.borderBottomAndTopColor}
      >
        {isChildrenString ? (
          <Text size="medium" weight="bold">
            {children}
          </Text>
        ) : (
          children
        )}
      </BaseBox>
    </FooterCell>
  );
};

export { TableFooter, TableFooterRow, TableFooterCell };
