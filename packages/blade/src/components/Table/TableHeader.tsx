import React from 'react';
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';
import { tableHeader } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type TableHeaderProps = {
  children: React.ReactNode;
};

const TableHeader = ({ children }: TableHeaderProps): React.ReactElement => {
  return <Header>{children}</Header>;
};

type TableHeaderRowProps = {
  children: React.ReactNode;
};

const TableHeaderRow = ({ children }: TableHeaderRowProps): React.ReactElement => {
  return <HeaderRow>{children}</HeaderRow>;
};

type TableHeaderCellProps = {
  children: string | React.ReactNode;
};

const TableHeaderCell = ({ children }: TableHeaderCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';

  return (
    <HeaderCell>
      <BaseBox
        paddingTop={tableHeader.paddingTop}
        paddingBottom={tableHeader.paddingBottom}
        paddingLeft={tableHeader.paddingLeft}
        paddingRight={tableHeader.paddingRight}
        backgroundColor={tableHeader.backgroundColor}
        borderBottomWidth={tableHeader.borderBottomWidth}
        borderBottomColor={tableHeader.borderBottomColor}
      >
        {isChildrenString ? (
          <Text size="medium" weight="bold">
            {children}
          </Text>
        ) : (
          children
        )}
      </BaseBox>
    </HeaderCell>
  );
};

export { TableHeader, TableHeaderRow, TableHeaderCell };
