import React, { useMemo } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import type { TableNode, Data } from '@table-library/react-table-library/table';
import { SelectTypes, useRowSelect } from '@table-library/react-table-library/select';
import type { TableContextType } from './TableContext';
import { TableProvider } from './TableContext';
import { makeBorderSize, useTheme } from '~utils';

export type TableProps = {
  children: React.ReactNode;
  data: Data<TableNode>;
  selectionType?: 'single' | 'multiple';
};

const rowSelectType: Record<NonNullable<TableProps['selectionType']>, SelectTypes> = {
  single: SelectTypes.SingleSelect,
  multiple: SelectTypes.MultiSelect,
};

const Table: React.FC<TableProps> = ({ children, data, selectionType }) => {
  const { theme } = useTheme();
  const tableTheme = useTableTheme({
    Table: `
    border: ${makeBorderSize(theme.border.width.thin)} solid ${
      theme.colors.surface.border.normal.lowContrast
    };
    background-color: ${theme.colors.surface.background.level2.lowContrast};
    `,
  });

  const tableContext: TableContextType = useMemo(
    () => ({
      selectionType,
    }),
    [selectionType],
  );

  const onSelectChange: MiddlewareFunction = (action, state, context): void => {
    console.log(action, state, context);
  };

  const rowSelectConfig = useRowSelect(
    data,
    {
      onChange: onSelectChange,
    },
    {
      rowSelect: selectionType ? rowSelectType[selectionType] : undefined,
    },
  );

  return (
    <TableProvider value={tableContext}>
      <ReactTable data={data} theme={tableTheme} select={selectionType ? rowSelectConfig : null}>
        {children}
      </ReactTable>
    </TableProvider>
  );
};

export { Table };
