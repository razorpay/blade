import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { TableData, TableProps } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from '../../TableFooter';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';

export default {
  title: 'Components/Table/Spanning',
  component: TableComponent,
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="Table with rowspan and colspan support."
          componentName="Table Spanning"
        />
      ),
    },
  },
} as Meta<TableProps<unknown>>;

type TransactionItem = {
  id: string;
  merchant: string;
  method: string;
  amount: number;
  fee: number;
  gst: number;
  settlement: number;
};

const razorpayData: TableData<TransactionItem> = {
  nodes: [
    {
      id: 'txn_001',
      merchant: 'Flipkart',
      method: 'UPI',
      amount: 2500,
      fee: 12.5,
      gst: 2.25,
      settlement: 2485.25,
    },
    {
      id: 'txn_002',
      merchant: 'Flipkart',
      method: 'Card',
      amount: 1200,
      fee: 24,
      gst: 4.32,
      settlement: 1171.68,
    },
    {
      id: 'txn_003',
      merchant: 'Swiggy',
      method: 'UPI',
      amount: 850,
      fee: 4.25,
      gst: 0.77,
      settlement: 844.98,
    },
    {
      id: 'txn_004',
      merchant: 'Swiggy',
      method: 'Wallet',
      amount: 450,
      fee: 9,
      gst: 1.62,
      settlement: 439.38,
    },
  ],
};

/**
 * const data = [
 *   { merchant: 'Flipkart', amount: 100 },
 *   { merchant: 'Flipkart', amount: 200 },
 *   { merchant: 'Swiggy', amount: 150 }
 * ];
 * const grouped = groupBy(data, 'merchant');
 * // Result: { 'Flipkart': [item1, item2], 'Swiggy': [item3] }
 */
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Helper to calculate row span positions
 * const spans = calculateRowSpans(data, 'merchant');
 * // Use spans[index].shouldSpan to determine if cell should span
 * // Use spans[index].rowSpan to get number of rows to span
 */
function calculateRowSpans<T>(
  data: T[],
  groupKey: keyof T,
): Array<{ item: T; shouldSpan: boolean; rowSpan: number }> {
  const grouped = groupBy(data, groupKey);
  const result: Array<{ item: T; shouldSpan: boolean; rowSpan: number }> = [];

  data.forEach((item) => {
    const group = String(item[groupKey]);
    const groupItems = grouped[group];
    const isFirstInGroup = groupItems[0] === item;

    result.push({
      item,
      shouldSpan: isFirstInGroup && groupItems.length > 1,
      rowSpan: groupItems.length,
    });
  });
  return result;
}

const headers = (
  <TableHeader>
    <TableHeaderRow>
      <TableHeaderCell>Merchant</TableHeaderCell>
      <TableHeaderCell>Method</TableHeaderCell>
      <TableHeaderCell>Amount</TableHeaderCell>
      <TableHeaderCell>Fee</TableHeaderCell>
      <TableHeaderCell>GST</TableHeaderCell>
      <TableHeaderCell>Settlement</TableHeaderCell>
    </TableHeaderRow>
  </TableHeader>
);

export const RowSpan: StoryFn<typeof TableComponent> = () => {
  const rowSpans = calculateRowSpans(razorpayData.nodes, 'merchant');

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={razorpayData} showBorderedCells>
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              {tableData.map((item, index) => {
                const spanInfo = rowSpans[index];

                return (
                  <TableRow key={item.id} item={item}>
                    {spanInfo.shouldSpan && (
                      <TableCell gridRowStart={index + 2} gridRowEnd={index + 2 + spanInfo.rowSpan}>
                        {item.merchant}
                      </TableCell>
                    )}
                    <TableCell>{item.method}</TableCell>
                    <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                    <TableCell>₹{item.fee.toFixed(2)}</TableCell>
                    <TableCell>₹{item.gst.toFixed(2)}</TableCell>
                    <TableCell>₹{item.settlement.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const ColumnSpan: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={razorpayData} showBorderedCells>
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              <TableRow item={tableData[0]}>
                <TableCell gridColumnStart={1} gridColumnEnd={7}>
                  Transaction Summary - Total: {razorpayData.nodes.length} transactions processed
                </TableCell>
              </TableRow>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>{item?.merchant}</TableCell>
                  <TableCell>{item?.method}</TableCell>
                  <TableCell>₹{item?.amount.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.fee.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.gst.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.settlement.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const HeaderSpan: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={razorpayData} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell gridColumnStart={4} gridColumnEnd={7}>
                  Charge Breakup
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>{item?.merchant}</TableCell>
                  <TableCell>{item?.method}</TableCell>
                  <TableCell>₹{item?.amount.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.fee.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.gst.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.settlement.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const FooterSpan: StoryFn<typeof TableComponent> = () => {
  const grouped = groupBy(razorpayData.nodes, 'merchant');
  const totalSettlement = razorpayData.nodes.reduce((sum, item) => sum + item.settlement, 0);

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={razorpayData} showBorderedCells>
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>{item?.merchant}</TableCell>
                  <TableCell>{item?.method}</TableCell>
                  <TableCell>₹{item?.amount.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.fee.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.gst.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.settlement.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell gridColumnStart={1} gridColumnEnd={6}>
                  Total Summary ({Object.keys(grouped).length} merchants,{' '}
                  {razorpayData.nodes.length} transactions)
                </TableFooterCell>
                <TableFooterCell>₹{totalSettlement.toFixed(2)}</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const ColumnRowSpan: StoryFn<typeof TableComponent> = () => {
  const merchantSpans = calculateRowSpans(razorpayData.nodes, 'merchant');

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={razorpayData} showBorderedCells>
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              {tableData.map((item, index) => {
                const spanInfo = merchantSpans[index];

                return (
                  <TableRow key={item.id} item={item}>
                    {spanInfo.shouldSpan && (
                      <TableCell
                        gridRowStart={index + 2}
                        gridRowEnd={index + 2 + spanInfo.rowSpan}
                        gridColumnStart={index < 2 ? 1 : undefined}
                        gridColumnEnd={index < 2 ? 3 : undefined}
                      >
                        {item.merchant}
                      </TableCell>
                    )}
                    {index >= 2 && <TableCell>{item?.method}</TableCell>}
                    <TableCell gridColumnStart={spanInfo.shouldSpan ? 3 : 1}>
                      ₹{item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>₹{item.fee.toFixed(2)}</TableCell>
                    <TableCell>₹{item.gst.toFixed(2)}</TableCell>
                    <TableCell>₹{item.settlement.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const ColumnSpanWithSelection: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent
        data={razorpayData}
        showBorderedCells
        selectionType="multiple"
        onSelectionChange={({ selectedIds }) => console.log('Selected:', selectedIds)}
      >
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                  <TableCell gridColumnStart={5} gridColumnEnd={7}>
                    ₹{(Number(item.fee) + Number(item.gst)).toFixed(2)}
                  </TableCell>
                  <TableCell>₹{Number(item.settlement).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell gridColumnStart={1} gridColumnEnd={7}>
                  Summary
                </TableFooterCell>
                <TableFooterCell>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.settlement, 0).toFixed(2)}
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const ColumnSpanWithStickyFirstColumn: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent
        data={razorpayData}
        showBorderedCells
        isHeaderSticky
        isFooterSticky
        isFirstColumnSticky
        height="400px"
      >
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                  <TableCell gridColumnStart={4} gridColumnEnd={6}>
                    ₹{(Number(item.fee) + Number(item.gst)).toFixed(2)}
                  </TableCell>
                  <TableCell>₹{Number(item.settlement).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell gridColumnStart={1} gridColumnEnd={3}>
                  Summary
                </TableFooterCell>
                <TableFooterCell>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </TableFooterCell>
                <TableFooterCell gridColumnStart={4} gridColumnEnd={6}>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.fee, 0).toFixed(2)}
                </TableFooterCell>
                <TableFooterCell>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.settlement, 0).toFixed(2)}
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const RowSpanWithStickyFirstColumn: StoryFn<typeof TableComponent> = () => {
  const merchantSpans = calculateRowSpans(razorpayData.nodes, 'merchant');

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent
        data={razorpayData}
        showBorderedCells
        isHeaderSticky
        isFooterSticky
        isFirstColumnSticky
        height="400px"
      >
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              {tableData.map((item, index) => {
                const spanInfo = merchantSpans[index];

                return (
                  <TableRow key={item.id} item={item}>
                    {spanInfo.shouldSpan && (
                      <TableCell gridRowStart={index + 2} gridRowEnd={index + 2 + spanInfo.rowSpan}>
                        {item.merchant}
                      </TableCell>
                    )}
                    <TableCell>{item.method}</TableCell>
                    <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                    <TableCell>₹{item.fee.toFixed(2)}</TableCell>
                    <TableCell>₹{item.gst.toFixed(2)}</TableCell>
                    <TableCell>₹{item.settlement.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Summary</TableFooterCell>
                <TableFooterCell>Items: {razorpayData.nodes.length}</TableFooterCell>
                <TableFooterCell>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </TableFooterCell>
                <TableFooterCell>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.fee, 0).toFixed(2)}
                </TableFooterCell>
                <TableFooterCell>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.gst, 0).toFixed(2)}
                </TableFooterCell>
                <TableFooterCell>
                  ₹{razorpayData.nodes.reduce((sum, item) => sum + item.settlement, 0).toFixed(2)}
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const RowColumnSpanWithStickyFirstColumn: StoryFn<typeof TableComponent> = () => {
  const merchantSpans = calculateRowSpans(razorpayData.nodes, 'merchant');

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent
        data={razorpayData}
        showBorderedCells
        isFirstColumnSticky
        isHeaderSticky
        isFooterSticky
      >
        {(tableData) => (
          <>
            {headers}
            <TableBody>
              {tableData.map((item, index) => {
                const spanInfo = merchantSpans[index];

                return (
                  <TableRow key={item.id} item={item}>
                    {spanInfo.shouldSpan && (
                      <TableCell
                        gridRowStart={index + 2}
                        gridRowEnd={index + 2 + spanInfo.rowSpan}
                        gridColumnStart={index < 2 ? 1 : undefined}
                        gridColumnEnd={index < 2 ? 3 : undefined}
                      >
                        {item.merchant}
                      </TableCell>
                    )}
                    {index >= 2 && <TableCell>{item?.method}</TableCell>}
                    <TableCell gridColumnStart={spanInfo.shouldSpan ? 3 : 1}>
                      ₹{item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>₹{item.fee.toFixed(2)}</TableCell>
                    <TableCell>₹{item.gst.toFixed(2)}</TableCell>
                    <TableCell>₹{item.settlement.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};
