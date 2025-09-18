import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../index';
import type { TableProps, Identifier } from '../../types';
import { Box } from '~components/Box';
import { Amount } from '~components/Amount';

const meta: Meta<TableProps<unknown>> = {
  title: 'Components/Table/Grouping',
  component: Table,
  parameters: {
    docs: {
      page: null,
    },
  },
};

const sampleData = {
  nodes: [
    {
      id: 'july13',
      method: 'Rzp - July 13',
      amount: 245000,
      fees: 8750,
      total: 253750,
      nodes: [
        {
          id: 'july13-card',
          method: 'Card',
          amount: 150000,
          fees: 6000,
          total: 156000,
          nodes: null,
        },
        {
          id: 'july13-upi',
          method: 'UPI',
          amount: 65000,
          fees: 0,
          total: 65000,
          nodes: null,
        },
        {
          id: 'july13-netbanking',
          method: 'Net Banking',
          amount: 30000,
          fees: 2750,
          total: 32750,
          nodes: null,
        },
      ],
    },
    {
      id: 'july12',
      method: 'Rzp - July 12',
      amount: 185000,
      fees: 5950,
      total: 190950,
      nodes: [
        {
          id: 'july12-card',
          method: 'Card',
          amount: 120000,
          fees: 4800,
          total: 124800,
          nodes: null,
        },
        {
          id: 'july12-upi',
          method: 'UPI',
          amount: 45000,
          fees: 0,
          total: 45000,
          nodes: null,
        },
        {
          id: 'july12-netbanking',
          method: 'Net Banking',
          amount: 20000,
          fees: 1150,
          total: 21150,
          nodes: null,
        },
      ],
    },
    {
      id: 'july11',
      method: 'Rzp - July 11',
      amount: 125000,
      fees: 4250,
      total: 129250,
      nodes: [
        {
          id: 'july11-card',
          method: 'Card',
          amount: 85000,
          fees: 3400,
          total: 88400,
          nodes: null,
        },
        {
          id: 'july11-upi',
          method: 'UPI',
          amount: 25000,
          fees: 0,
          total: 25000,
          nodes: null,
        },
        {
          id: 'july11-netbanking',
          method: 'Net Banking',
          amount: 15000,
          fees: 850,
          total: 15850,
          nodes: null,
        },
      ],
    },
  ],
};

const GroupingTableTemplate = ({
  data,
  selectionType,
  onSelectionChange,
  gridColumnStart,
  gridColumnEnd,
  defaultSelectedIds,
  disabledIds,
}: {
  data: typeof sampleData;
  selectionType: 'none' | 'multiple';
  onSelectionChange?: ({ selectedIds }: { selectedIds: Identifier[] }) => void;
  gridColumnStart?: number;
  gridColumnEnd?: number;
  defaultSelectedIds?: Identifier[];
  disabledIds?: Identifier[];
}): React.ReactElement => {
  return (
    <Table
      data={data}
      selectionType={selectionType}
      isGrouped
      onSelectionChange={onSelectionChange}
      showBorderedCells
      defaultSelectedIds={defaultSelectedIds}
    >
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Payment Method</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Fees</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={index} item={item} isDisabled={disabledIds?.includes(item.id)}>
                <TableCell
                  gridColumnStart={
                    (item as { treeXLevel?: number }).treeXLevel === 0
                      ? gridColumnStart ?? 1
                      : undefined
                  }
                  gridColumnEnd={
                    (item as { treeXLevel?: number }).treeXLevel === 0
                      ? gridColumnEnd ?? 5
                      : undefined
                  }
                >
                  {item.method}
                </TableCell>
                {(item as { treeXLevel?: number }).treeXLevel !== 0 && (
                  <>
                    <TableCell>
                      <Amount value={item.amount} isAffixSubtle={false} />
                    </TableCell>
                    <TableCell>
                      <Amount value={item.fees} isAffixSubtle={false} />
                    </TableCell>
                    <TableCell>
                      <Amount value={item.total} isAffixSubtle={false} />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};

export const BasicGrouping: StoryFn<TableProps<unknown>> = () => {
  return (
    <Box>
      <GroupingTableTemplate data={sampleData} selectionType="none" />
    </Box>
  );
};

BasicGrouping.storyName = 'Basic Grouping';

export const TableGroupingWithSelection: StoryFn<TableProps<unknown>> = () => {
  const [ignoredSelectedIds, setIgnoredSelectedIds] = useState<Identifier[]>([]);

  const handleSelectionChange = ({ selectedIds }: { selectedIds: Identifier[] }): void => {
    console.log('selectedIds', selectedIds);
    setIgnoredSelectedIds(selectedIds);
  };

  return (
    <Box>
      <GroupingTableTemplate
        data={sampleData}
        selectionType="multiple"
        onSelectionChange={handleSelectionChange}
        gridColumnStart={2}
        gridColumnEnd={6}
      />
    </Box>
  );
};

TableGroupingWithSelection.storyName = 'Table Grouping with Selection';

export const TableGroupingWithDisabledRows: StoryFn<TableProps<unknown>> = () => {
  const [ignoredSelectedIds, setIgnoredSelectedIds] = useState<Identifier[]>([]);

  const handleSelectionChange = ({ selectedIds }: { selectedIds: Identifier[] }): void => {
    console.log('selectedIds', selectedIds);
    setIgnoredSelectedIds(selectedIds);
  };

  const july12GroupIds = ['july12', 'july12-card', 'july12-upi', 'july12-netbanking'];

  return (
    <Box>
      <GroupingTableTemplate
        data={sampleData}
        selectionType="multiple"
        onSelectionChange={handleSelectionChange}
        gridColumnStart={2}
        gridColumnEnd={6}
        defaultSelectedIds={july12GroupIds}
        disabledIds={july12GroupIds}
      />
    </Box>
  );
};

TableGroupingWithDisabledRows.storyName = 'Table Grouping with Disabled Rows';

export default meta;
