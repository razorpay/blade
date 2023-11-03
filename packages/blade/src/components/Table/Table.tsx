import React, { useEffect, useMemo } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import filter from 'lodash/filter';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import type { Identifier } from '@table-library/react-table-library/table';
import { SelectTypes, useRowSelect } from '@table-library/react-table-library/select';
import type { TableContextType } from './TableContext';
import { TableProvider } from './TableContext';
import { makeBorderSize, useTheme } from '~utils';

type TableNode = {
  id: Identifier;
  nodes?: null;
  [key: string]: unknown;
};

export type TableProps = {
  children: React.ReactNode;
  data: { nodes: TableNode[] };
  selectionType?: 'single' | 'multiple';
  onSelectionChange?: ({ values }: { values: TableNode[] }) => void;
  isHeaderSticky?: boolean;
  isFooterSticky?: boolean;
};

const rowSelectType: Record<NonNullable<TableProps['selectionType']>, SelectTypes> = {
  single: SelectTypes.SingleSelect,
  multiple: SelectTypes.MultiSelect,
};

const Table: React.FC<TableProps> = ({
  children,
  data,
  selectionType,
  onSelectionChange,
  isHeaderSticky,
  isFooterSticky,
}) => {
  const { theme } = useTheme();
  const [selectedRows, setSelectedRows] = React.useState<TableNode['id'][]>([]);
  const [totalItems, setTotalItems] = React.useState(data.nodes.length || 0);

  // TODO: Dynamically set the grid-template-columns based on the number of columns
  const tableTheme = useTableTheme({
    Table: `
    height:${isFooterSticky ? `100%` : undefined};
    border: ${makeBorderSize(theme.border.width.thin)} solid ${
      theme.colors.surface.border.normal.lowContrast
    };
    background-color: ${theme.colors.surface.background.level2.lowContrast};
    --data-table-library_grid-template-columns:  min-content repeat(4,minmax(0px, 1fr)) !important; 
    `,
    Footer: `
    .tr-footer th {
      position: ${isFooterSticky ? `sticky` : undefined};
      bottom: ${isFooterSticky ? `0` : undefined};
    };
    `,
  });

  useEffect(() => {
    setTotalItems(data.nodes.length);
  }, [data.nodes]);

  const onSelectChange: MiddlewareFunction = (action, state): void => {
    const selectedIDs: TableNode['id'][] = state.id ? [state.id] : state.ids ?? [];
    setSelectedRows(selectedIDs);
    onSelectionChange?.({
      values: filter(data.nodes, (node) => selectedIDs.includes(node.id)),
    });
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

  const toggleRowSelectionById = useMemo(
    () => (id: TableNode['id']): void => {
      rowSelectConfig.fns.onToggleById(id);
    },
    [rowSelectConfig.fns],
  );

  const toggleAllRowsSelection = useMemo(
    () => (): void => {
      rowSelectConfig.fns.onToggleAll({});
    },
    [rowSelectConfig.fns],
  );

  const tableContext: TableContextType = useMemo(
    () => ({
      selectionType,
      selectedRows,
      totalItems,
      toggleRowSelectionById,
      toggleAllRowsSelection,
    }),
    [selectionType, selectedRows, totalItems, toggleRowSelectionById, toggleAllRowsSelection],
  );

  return (
    <TableProvider value={tableContext}>
      <ReactTable
        layout={{ fixedHeader: isHeaderSticky, horizontalScroll: true }}
        data={data}
        theme={tableTheme}
        select={selectionType ? rowSelectConfig : null}
      >
        {children}
      </ReactTable>
    </TableProvider>
  );
};

export { Table };
