import React from 'react';
import { Footer, FooterRow, FooterCell } from '@table-library/react-table-library/table';

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
  return <FooterCell>{children}</FooterCell>;
};

export { TableFooter, TableFooterRow, TableFooterCell };
