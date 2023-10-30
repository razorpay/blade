import React from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import type { TableNode } from '@table-library/react-table-library/table';
import { makeBorderSize, useTheme } from '~utils';

export type TableProps = {
  children: React.ReactNode;
  data: TableNode;
};

const Table: React.FC<TableProps> = ({ children, data }) => {
  const { theme } = useTheme();
  const tableTheme = useTableTheme({
    Table: `
    border: ${makeBorderSize(theme.border.width.thin)} solid ${
      theme.colors.surface.border.normal.lowContrast
    };
    `,
  });

  return (
    <ReactTable data={data} theme={tableTheme}>
      {children}
    </ReactTable>
  );
};

export { Table };
