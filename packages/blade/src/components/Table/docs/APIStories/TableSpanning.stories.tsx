import type { StoryFn, Meta } from '@storybook/react';
import type { TableData, TableProps } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from '../../TableFooter';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';

export default {
  title: 'Components/Table/API/Spanning',
  component: TableComponent,
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="Table with rowspan and colspan support"
          componentName="Table Spanning"
        />
      ),
    },
  },
} as Meta<TableProps<unknown>>;

type Item = {
  id: string;
  component: string;
  breakdown: string;
  price: number;
  gst: number;
  convenience: number;
  total: number;
};

const spanningData: TableData<Item> = {
  nodes: [
    {
      id: '1',
      component: 'Engine Oil',
      breakdown: 'Product Charge',
      price: 3421,
      gst: 145,
      convenience: 50,
      total: 3616,
    },
    {
      id: '2',
      component: 'Engine Oil',
      breakdown: 'Service Charge',
      price: 3421,
      gst: 145,
      convenience: 50,
      total: 3616,
    },
    {
      id: '3',
      component: 'Brake Shoes',
      breakdown: 'Product Charge',
      price: 3421,
      gst: 145,
      convenience: 50,
      total: 3616,
    },
    {
      id: '4',
      component: 'Brake Shoes',
      breakdown: 'Service Charge',
      price: 3421,
      gst: 145,
      convenience: 50,
      total: 3616,
    },
  ],
};

export const RowSpanExample: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={spanningData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Component</TableHeaderCell>
                <TableHeaderCell>Breakdown</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>GST</TableHeaderCell>
                <TableHeaderCell>Convenience</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableRow item={tableData[0]}>
                <TableCell gridRowStart={2} gridRowEnd={4}>
                  Engine Oil
                </TableCell>
                <TableCell>{tableData[0]?.breakdown}</TableCell>
                <TableCell>₹{tableData[0]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow item={tableData[1]}>
                <TableCell>{tableData[1]?.breakdown}</TableCell>
                <TableCell>₹{tableData[1]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow item={tableData[2]}>
                <TableCell gridRowStart={4} gridRowEnd={6}>
                  Brake Shoes
                </TableCell>
                <TableCell>{tableData[2]?.breakdown}</TableCell>
                <TableCell>₹{tableData[2]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[2]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[2]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[2]?.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow item={tableData[3]}>
                <TableCell>{tableData[3]?.breakdown}</TableCell>
                <TableCell>₹{tableData[3]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[3]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[3]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[3]?.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const ColSpanExample: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={spanningData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Component</TableHeaderCell>
                <TableHeaderCell>Breakdown</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>GST</TableHeaderCell>
                <TableHeaderCell>Convenience</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableRow item={tableData[0]}>
                <TableCell gridColumnStart={1} gridColumnEnd={7}>
                  Service Summary - Total: 4 items
                </TableCell>
              </TableRow>
              <TableRow item={tableData[1]}>
                <TableCell>{tableData[0]?.component}</TableCell>
                <TableCell>{tableData[0]?.breakdown}</TableCell>
                <TableCell>₹{tableData[0]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow item={tableData[2]}>
                <TableCell>{tableData[1]?.component}</TableCell>
                <TableCell>{tableData[1]?.breakdown}</TableCell>
                <TableCell>₹{tableData[1]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const HeaderSpanExample: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={spanningData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell gridColumnStart={1} gridColumnEnd={6}>
                  Invoice Summary
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>{item?.component}</TableCell>
                  <TableCell>₹{item?.price.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.gst.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.convenience.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const FooterSpanExample: StoryFn<typeof TableComponent> = () => {
  const totalAmount = spanningData.nodes.reduce((sum, item) => sum + item.total, 0);

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={spanningData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Component</TableHeaderCell>
                <TableHeaderCell>Breakdown</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>GST</TableHeaderCell>
                <TableHeaderCell>Convenience</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>{item?.component}</TableCell>
                  <TableCell>{item?.breakdown}</TableCell>
                  <TableCell>₹{item?.price.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.gst.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.convenience.toFixed(2)}</TableCell>
                  <TableCell>₹{item?.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell gridColumnStart={1} gridColumnEnd={6}>
                  Total Amount
                </TableFooterCell>
                <TableFooterCell>₹{totalAmount.toFixed(2)}</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const ColRowSpanExample: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" overflow="auto">
      <TableComponent data={spanningData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Component</TableHeaderCell>
                <TableHeaderCell>Breakdown</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>GST</TableHeaderCell>
                <TableHeaderCell>Convenience</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableRow item={tableData[0]}>
                <TableCell gridRowStart={2} gridRowEnd={4} gridColumnStart={1} gridColumnEnd={3}>
                  Engine Oil
                </TableCell>
                <TableCell>₹{tableData[0]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[0]?.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow item={tableData[1]}>
                <TableCell>₹{tableData[1]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[1]?.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow item={tableData[2]}>
                <TableCell gridRowStart={4} gridRowEnd={6}>
                  Brake Shoes
                </TableCell>
                <TableCell>{tableData[2]?.breakdown}</TableCell>
                <TableCell>₹{tableData[2]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[2]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[2]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[2]?.total.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow item={tableData[3]}>
                <TableCell>{tableData[3]?.breakdown}</TableCell>
                <TableCell>₹{tableData[3]?.price.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[3]?.gst.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[3]?.convenience.toFixed(2)}</TableCell>
                <TableCell>₹{tableData[3]?.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};
