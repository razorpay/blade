import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { Table } from '../Table';
import { TableBody, TableCell, TableRow, TableVirtualizedWrapper } from '../TableBody';
import { TableFooter, TableFooterCell, TableFooterRow } from '../TableFooter';
import { TableHeader, TableHeaderCell, TableHeaderRow } from '../TableHeader';
import { TableToolbar } from '../TableToolbar';
import { TablePagination } from '../TablePagination';
import { TableEditableCell, TableEditableDropdownCell } from '../TableEditableCell';
import type { TableProps } from '../types';
import { firstColumnStickyZIndex } from '../tokens';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import * as useIsMobileModule from '~utils/useIsMobile';
import { Amount } from '~components/Amount';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { InfoIcon } from '~components/Icons';

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  type: string;
  method: string;
  name: string;
};

const nodes: Item[] = [
  {
    id: '1',
    paymentId: 'rzp01',
    amount: 100,
    status: 'pending',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '2',
    paymentId: 'rzp02',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '3',
    paymentId: 'rzp03',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '4',
    paymentId: 'rzp04',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '5',
    paymentId: 'rzp05',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '6',
    paymentId: 'rzp06',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '7',
    paymentId: 'rzp07',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '8',
    paymentId: 'rzp08',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '9',
    paymentId: 'rzp09',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '10',
    paymentId: 'rzp10',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '11',
    paymentId: 'rzp11',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '12',
    paymentId: 'rzp12',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '13',
    paymentId: 'rzp13',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '14',
    paymentId: 'rzp14',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '15',
    paymentId: 'rzp15',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '16',
    paymentId: 'rzp16',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '17',
    paymentId: 'rzp17',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '18',
    paymentId: 'rzp18',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '19',
    paymentId: 'rzp19',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '20',
    paymentId: 'rzp20',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '21',
    paymentId: 'rzp21',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '22',
    paymentId: 'rzp22',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '23',
    paymentId: 'rzp23',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '24',
    paymentId: 'rzp24',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '25',
    paymentId: 'rzp25',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
];

// Grouped data for testing
const groupedNodes = [
  {
    id: 'group1',
    name: 'Group 1',
    amount: 500,
    treeXLevel: 0,
    nodes: [
      { id: 'child1-1', name: 'Child 1-1', amount: 200, treeXLevel: 1, nodes: null },
      { id: 'child1-2', name: 'Child 1-2', amount: 300, treeXLevel: 1, nodes: null },
    ],
  },
  {
    id: 'group2',
    name: 'Group 2',
    amount: 400,
    treeXLevel: 0,
    nodes: [{ id: 'child2-1', name: 'Child 2-1', amount: 400, treeXLevel: 1, nodes: null }],
  },
];

// Spanning data for testing
const spanningNodes = [
  { id: '1', merchant: 'Flipkart', method: 'UPI', amount: 100 },
  { id: '2', merchant: 'Flipkart', method: 'Card', amount: 200 },
  { id: '3', merchant: 'Swiggy', method: 'UPI', amount: 150 },
];

describe('<Table />', () => {
  it('should render table', () => {
    const { container, getAllByRole } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} toolbar={<TableToolbar />}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
    expect(getAllByRole('row')).toHaveLength(5);
    expect(getAllByRole('rowgroup')).toHaveLength(3);
    expect(getAllByRole('columnheader')).toHaveLength(6);
    expect(getAllByRole('cell')).toHaveLength(30);
    expect(getAllByRole('rowheader')).toHaveLength(1);
    expect(getAllByRole('rowfooter')).toHaveLength(1);
    expect(getAllByRole('columnfooter')).toHaveLength(6);
  });

  it('should render table with compact rowDensity', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} rowDensity="compact">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with comfortable rowDensity', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} rowDensity="comfortable">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with showStripedRows', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} showStripedRows={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with isLoading', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} isLoading={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with isRefreshing', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} isRefreshing={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with TableEditableCell and Bordered cells', () => {
    const { container } = renderWithTheme(
      <Table showBorderedCells={true} data={{ nodes: nodes.slice(0, 2) }} isRefreshing={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableEditableCell placeholder="Enter Amount" accessibilityLabel="Amount" />
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with sticky header, footer & first column', () => {
    const { container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 10) }}
        height="300px"
        isHeaderSticky
        isFooterSticky
        isFirstColumnSticky
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should stack the sticky first header cell above sticky first column body cells', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 10) }} height="300px" isFirstColumnSticky isHeaderSticky>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    // The corner header cell (sticky both vertically and horizontally) must outrank the sticky
    // first column body cells, otherwise the body cells paint over the header label on scroll.
    const headerCell = container.querySelector('th') as HTMLElement;
    const bodyCell = container.querySelector('td') as HTMLElement;
    const headerCellZIndex = Number(window.getComputedStyle(headerCell).zIndex);
    const bodyCellZIndex = Number(window.getComputedStyle(bodyCell).zIndex);

    expect(headerCellZIndex).toBeGreaterThan(0);
    expect(bodyCellZIndex).toBeGreaterThan(0);
    expect(headerCellZIndex).toBeGreaterThan(bodyCellZIndex);
  });

  it('should stack the sticky multi-select checkbox header cell above its body cells', () => {
    const { container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 10) }}
        height="300px"
        selectionType="multiple"
        isFirstColumnSticky
        isHeaderSticky
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const headerCells = container.querySelectorAll('th');
    const bodyCells = container.querySelectorAll('td');

    // With multiple selection the checkbox column (nth-of-type(1)) and the first data column
    // (nth-of-type(2)) are both sticky, each must clear its own body cells.
    [0, 1].forEach((cellIndex) => {
      const headerCellZIndex = Number(
        window.getComputedStyle(headerCells[cellIndex] as HTMLElement).zIndex,
      );
      const bodyCellZIndex = Number(
        window.getComputedStyle(bodyCells[cellIndex] as HTMLElement).zIndex,
      );
      expect(headerCellZIndex).toBeGreaterThan(bodyCellZIndex);
    });

    // The corner (checkbox) header cell is never below the sticky first data column header cell.
    // They share the corner z-index on purpose: the data column sticks at the fixed 44px offset
    // while the checkbox column can be wider, and on that overlap the later cell in the DOM
    // (the data column) must win, exactly like on master.
    const cornerZIndex = Number(window.getComputedStyle(headerCells[0] as HTMLElement).zIndex);
    const firstDataColumnZIndex = Number(
      window.getComputedStyle(headerCells[1] as HTMLElement).zIndex,
    );
    expect(cornerZIndex).toBeGreaterThanOrEqual(firstDataColumnZIndex);
  });

  it('should not cover the first data column cells when the checkbox column is wider than 44px', () => {
    const { container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        height="300px"
        selectionType="multiple"
        isFirstColumnSticky
        isHeaderSticky
        isFooterSticky
        gridTemplateColumns="min-content 280px 280px 280px"
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.name}</TableCell>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                {/* text in the first footer cell widens the checkbox column beyond 44px, so the
                sticky first data column footer cell sticks at 44px and overlaps it */}
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );

    const headerCells = container.querySelectorAll('th');
    const footerCells = container.querySelectorAll('tfoot td, [role="columnfooter"]');

    // The first data column header/footer cells share the checkbox cells' z-index instead of
    // sitting below them, so the overlap is resolved by DOM order (the data column is later)
    // and "Name" and the footer "-" stay visible when the table is scrolled right.
    const checkboxHeaderZIndex = Number(
      window.getComputedStyle(headerCells[0] as HTMLElement).zIndex,
    );
    const firstDataColumnHeaderZIndex = Number(
      window.getComputedStyle(headerCells[1] as HTMLElement).zIndex,
    );
    expect(checkboxHeaderZIndex).toBe(firstDataColumnHeaderZIndex);

    const checkboxFooterZIndex = Number(
      window.getComputedStyle(footerCells[0] as HTMLElement).zIndex,
    );
    const firstDataColumnFooterZIndex = Number(
      window.getComputedStyle(footerCells[1] as HTMLElement).zIndex,
    );
    expect(checkboxFooterZIndex).toBe(firstDataColumnFooterZIndex);

    // and both still clear the sticky first column body cells
    const bodyCellZIndex = Number(
      window.getComputedStyle(container.querySelector('td') as HTMLElement).zIndex,
    );
    expect(firstDataColumnHeaderZIndex).toBeGreaterThan(bodyCellZIndex);
  });

  it('should keep the refresh overlay above the sticky header cells while refreshing', () => {
    const renderTable = (selectionType: 'none' | 'multiple'): HTMLElement => {
      const { container } = renderWithTheme(
        <Table
          data={{ nodes: nodes.slice(0, 5) }}
          height="300px"
          isHeaderSticky
          isFirstColumnSticky
          isRefreshing={true}
          selectionType={selectionType}
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );
      return container;
    };

    const getRefreshOverlayZIndex = (container: HTMLElement): number => {
      const spinner = container.querySelector('[data-blade-component="spinner"]');
      // the refresh overlay is the wrapper that renders the spinner
      const refreshOverlay = spinner!.parentElement!;
      expect(refreshOverlay).not.toBeNull();
      return Number(window.getComputedStyle(refreshOverlay).zIndex);
    };

    // Without selection the corner header cell is the highest sticky cell.
    const singleSelectContainer = renderTable('none');
    const cornerHeaderCellZIndex = Number(
      window.getComputedStyle(singleSelectContainer.querySelector('th') as HTMLElement).zIndex,
    );
    expect(getRefreshOverlayZIndex(singleSelectContainer)).toBeGreaterThan(cornerHeaderCellZIndex);

    // With multiple selection the corner (checkbox) and the first data column header cells are
    // both sticky - the overlay must clear them too.
    const multiSelectContainer = renderTable('multiple');
    const multiSelectHeaderCells = multiSelectContainer.querySelectorAll('th');
    const multiSelectCornerZIndex = Number(
      window.getComputedStyle(multiSelectHeaderCells[0] as HTMLElement).zIndex,
    );
    const multiSelectFirstDataColumnZIndex = Number(
      window.getComputedStyle(multiSelectHeaderCells[1] as HTMLElement).zIndex,
    );
    const multiSelectOverlayZIndex = getRefreshOverlayZIndex(multiSelectContainer);
    expect(multiSelectOverlayZIndex).toBeGreaterThan(multiSelectCornerZIndex);
    expect(multiSelectOverlayZIndex).toBeGreaterThan(multiSelectFirstDataColumnZIndex);
  });

  it('should keep the editable dropdown cell trigger vertically centred with its icons', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 1) }}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableEditableDropdownCell>
                    <SelectInput
                      icon={InfoIcon}
                      placeholder="Select Status"
                      accessibilityLabel="Status"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Pending" value="pending" />
                        <ActionListItem title="Completed" value="completed" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const selectInputRoot = container.querySelector(
      '[data-blade-component="select-input"]',
    ) as HTMLElement;
    const tagsSlot = selectInputRoot.querySelector('.tags-slot')!;
    const trigger = tagsSlot.querySelector('button') as HTMLElement;

    // The trigger already fills the full input height inside a table cell, so the tag slot must
    // not add vertical padding on top of it — that pushes the value 4px below the leading icon
    // and the chevron and clips the trigger.
    expect(window.getComputedStyle(tagsSlot).paddingTop).toBe('0px');
    expect(window.getComputedStyle(tagsSlot).paddingBottom).toBe('0px');
    // trigger is a medium (36px) input for the default row density
    expect(window.getComputedStyle(trigger).height).toBe('36px');
    expect(window.getComputedStyle(tagsSlot).maxHeight).toBe('36px');
  });

  it('should render table with sorting', () => {
    const onSortChange = jest.fn();
    const { getByLabelText, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        sortFunctions={{
          STATUS: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
        }}
        onSortChange={onSortChange}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    const sortButton = getByLabelText('Toggle Sort');
    expect(sortButton).toBeInTheDocument();
    fireEvent.click(sortButton);
    expect(getAllByRole('row')[0]).toHaveTextContent('pending');
    expect(onSortChange).toHaveBeenCalledWith({ sortKey: 'STATUS', isSortReversed: false });
    fireEvent.click(sortButton);
    expect(onSortChange).toHaveBeenCalledWith({ sortKey: 'STATUS', isSortReversed: true });
    expect(getAllByRole('row')[0]).toHaveTextContent('completed');
  });

  it('should call onHover when mouse enters the row', async () => {
    const onHover = jest.fn();
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} selectionType="single">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index} onHover={onHover}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const firstSelectableRow = getByText('rzp01').closest('td');
    if (firstSelectableRow) await user.hover(firstSelectableRow);
    expect(onHover).toHaveBeenCalledWith({ item: nodes[0] });
  });

  it('should call onClick when the row is clicked', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} selectionType="single">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index} onClick={onClick}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const firstSelectableRow = getByText('rzp01').closest('td');
    if (firstSelectableRow) await user.click(firstSelectableRow);
    expect(onClick).toHaveBeenCalledWith({ item: nodes[0] });
  });

  it('should render table with single select', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText, container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="single"
        onSelectionChange={onSelectionChange}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const firstSelectableRow = getByText('rzp01').closest('td');
    if (firstSelectableRow) await user.click(firstSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [nodes[0]], selectedIds: ['1'] });

    // Check that the selected row has the intended styles
    const selectedRow = getByText('rzp01').closest('tr');
    expect(selectedRow).toHaveAttribute('aria-selected', 'true');
    expect(container).toMatchSnapshot();

    const secondSelectableRow = getByText('rzp02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [nodes[1]], selectedIds: ['2'] });

    // Check that the new selected row has the intended styles and previous is deselected
    const newSelectedRow = getByText('rzp02').closest('tr');
    const previousRow = getByText('rzp01').closest('tr');
    expect(newSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(previousRow).toHaveAttribute('aria-selected', 'false');
  });

  it('should render table with multi select', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText, getAllByRole, getByRole, container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        toolbar={<TableToolbar />}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    expect(getByRole('table')).toHaveAttribute('aria-multiselectable', 'true');
    expect(getByText('Showing 1-5 Items')).toBeInTheDocument();
    expect(getAllByRole('checkbox')).toHaveLength(6);
    const firstSelectableRow = getByText('rzp01').closest('td');
    if (firstSelectableRow) await user.click(firstSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [nodes[0]], selectedIds: ['1'] });

    // Check that the first selected row has the intended styles
    const firstSelectedRow = getByText('rzp01').closest('tr');
    expect(firstSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(container).toMatchSnapshot();

    const secondSelectableRow = getByText('rzp02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({
      values: [nodes[0], nodes[1]],
      selectedIds: ['1', '2'],
    });
    expect(getByText('2 Items Selected')).toBeInTheDocument();

    // Check that both selected rows have the intended styles
    const secondSelectedRow = getByText('rzp02').closest('tr');
    expect(firstSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(secondSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(container).toMatchSnapshot();

    const deselectButton = getByText('Deselect');
    await user.click(deselectButton);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [], selectedIds: [] });

    // Check that all rows are deselected after clicking deselect
    expect(firstSelectedRow).toHaveAttribute('aria-selected', 'false');
    expect(secondSelectedRow).toHaveAttribute('aria-selected', 'false');
    expect(container).toMatchSnapshot();
  });

  it('should render table with single select and defaultSelectedIds', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="single"
        onSelectionChange={onSelectionChange}
        defaultSelectedIds={['1']}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    const firstSelectableRow = getByText('rzp01').closest('tr');
    expect(firstSelectableRow).toHaveAttribute('aria-selected', 'true');
    const secondSelectableRow = getByText('rzp02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({
      values: [nodes[1]],
      selectedIds: ['2'],
    });
  });

  it('should render table with multi select and defaultSelectedIds', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        defaultSelectedIds={['1', '2']}
        toolbar={<TableToolbar />}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    expect(getByText('2 Items Selected')).toBeInTheDocument();
    expect(getAllByRole('checkbox')).toHaveLength(6);
    const firstSelectableRow = getByText('rzp01').closest('tr');
    expect(firstSelectableRow).toHaveAttribute('aria-selected', 'true');
    const secondSelectableRow = getByText('rzp02').closest('tr');
    expect(secondSelectableRow).toHaveAttribute('aria-selected', 'true');
    const thirdSelectableRow = getByText('rzp03').closest('td');
    if (thirdSelectableRow) await user.click(thirdSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({
      values: [nodes[0], nodes[1], nodes[2]],
      selectedIds: ['1', '2', '3'],
    });

    expect(getByText('3 Items Selected')).toBeInTheDocument();
    const deselectButton = getByText('Deselect');
    await user.click(deselectButton);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [], selectedIds: [] });
  });

  it('should render table with client side pagination', async () => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();
    const user = userEvent.setup();
    const { getByLabelText, queryByText, getByRole, getAllByRole } = renderWithTheme(
      <Table
        data={{
          nodes: [...nodes, ...nodes, ...nodes, ...nodes, ...nodes, ...nodes, ...nodes, ...nodes],
        }}
        pagination={
          <TablePagination
            onPageChange={onPageChange}
            defaultPageSize={10}
            onPageSizeChange={onPageSizeChange}
            showPageSizePicker
            showPageNumberSelector
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    const nextPageButton = getByLabelText('Next Page');
    const previousPageButton = getByLabelText('Previous Page');
    const goForward5PagesButton = getByLabelText('Go forward 5 pages');
    // Check if pagination buttons work
    expect(nextPageButton).toBeInTheDocument();
    expect(previousPageButton).toBeInTheDocument();
    expect(goForward5PagesButton).toBeInTheDocument();
    expect(queryByText('rzp01')).toBeInTheDocument();
    // Go to next page
    fireEvent.click(nextPageButton);
    expect(queryByText('rzp01')).not.toBeInTheDocument();
    expect(queryByText('rzp11')).toBeInTheDocument();
    expect(onPageChange).toHaveBeenCalledTimes(1);
    // Go to previous page
    fireEvent.click(previousPageButton);
    expect(queryByText('rzp01')).toBeInTheDocument();

    // Check if page size picker works
    const selectInput = getByRole('combobox', { name: 'Select items per page' });
    expect(getAllByRole('row')).toHaveLength(10);
    expect(selectInput).toBeInTheDocument();
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    await user.click(getByRole('option', { name: '25' }));
    expect(getAllByRole('row')).toHaveLength(25);
    await user.click(goForward5PagesButton);
    expect(onPageChange).toHaveBeenLastCalledWith({ page: 5 });
    const goBack5PagesButton = getByLabelText('Go back 5 pages');
    fireEvent.click(goBack5PagesButton);
    expect(onPageChange).toHaveBeenLastCalledWith({ page: 0 });
  }, 10000);

  it('should render table with server side pagination', () => {
    const ServerPaginatedTable = (): React.ReactElement => {
      const [apiData, setAPIData] = useState({ nodes: nodes.slice(0, 10) });
      const onPageChange = ({ page }: { page: number }): void => {
        setAPIData({ nodes: nodes.slice(page * 10, page * 10 + 10) });
      };

      return (
        <Table
          data={apiData}
          pagination={
            <TablePagination
              onPageChange={onPageChange}
              paginationType="server"
              totalItemCount={nodes.length}
              showPageSizePicker
              showPageNumberSelector
            />
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                    <TableCell>{tableItem.type}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      );
    };
    const { getByLabelText, queryByText } = renderWithTheme(<ServerPaginatedTable />);
    const nextPageButton = getByLabelText('Next Page');
    const previousPageButton = getByLabelText('Previous Page');
    // Check if pagination buttons work
    expect(nextPageButton).toBeInTheDocument();
    expect(previousPageButton).toBeInTheDocument();
    expect(queryByText('rzp01')).toBeInTheDocument();
    // Go to next page
    fireEvent.click(nextPageButton);
    expect(queryByText('rzp01')).not.toBeInTheDocument();
    expect(queryByText('rzp11')).toBeInTheDocument();
    // Go to previous page
    fireEvent.click(previousPageButton);
    expect(queryByText('rzp01')).toBeInTheDocument();
  });

  beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
  afterAll(() => jest.restoreAllMocks());

  it('should throw error for missing props in server side pagination', () => {
    const ServerPaginatedTable = (): React.ReactElement => {
      const [apiData] = useState({ nodes: nodes.slice(0, 10) });

      return (
        <Table
          data={apiData}
          pagination={
            // @ts-expect-error onPageChange and totalItemCount are missing intentionally
            <TablePagination paginationType="server" showPageSizePicker showPageNumberSelector />
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                    <TableCell>{tableItem.type}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      );
    };
    try {
      renderWithTheme(<ServerPaginatedTable />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          '[Blade: TablePagination]: `onPageChange` and `totalItemCount` props are required when paginationType is server.',
        );
      }
    }
  });
  it('should accept data-analytics-* props', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} data-analytics-table="test">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell data-analytics-table-header="table-header-cell-test">
                  Payment ID
                </TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody data-analytics-body="table-body-test">
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index} data-analytics-row="table-row-test">
                  <TableCell data-analytics-cell="table-cell-test">{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render virtualized table', () => {
    const ReactVirtualTable = (): React.ReactElement => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [apiData, _] = useState({ nodes: nodes.slice(0, 10) });
      return (
        <Box>
          <Table
            data={apiData}
            onSelectionChange={console.log}
            selectionType="multiple"
            sortFunctions={{
              ID: (array) => array.sort((a, b) => Number(a.id) - Number(b.id)),
              AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
              PAYMENT_ID: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
              STATUS: (array) => array.sort((a, b) => a.status.localeCompare(b.status)),
            }}
            defaultSelectedIds={['1', '3']}
            rowDensity="normal"
            isFirstColumnSticky
            height="500px"
          >
            {() => (
              <TableVirtualizedWrapper>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                    <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                    <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                    <TableHeaderCell headerKey="STATUS">Status </TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody<Item>>
                  {(tableItem, index) => (
                    <TableRow
                      key={index}
                      item={tableItem}
                      onClick={() => {
                        console.log('where');
                      }}
                    >
                      <TableCell>
                        <Code size="medium">{tableItem.paymentId}</Code>
                      </TableCell>
                      <TableEditableCell
                        accessibilityLabel="Amount"
                        placeholder="Enter text"
                        successText="Amount is valid"
                      />

                      <TableCell>{tableItem.method}</TableCell>
                      <TableCell>
                        <Badge
                          size="medium"
                          color={
                            tableItem.status === 'Completed'
                              ? 'positive'
                              : tableItem.status === 'Pending'
                              ? 'notice'
                              : tableItem.status === 'Failed'
                              ? 'negative'
                              : 'primary'
                          }
                        >
                          {tableItem.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableVirtualizedWrapper>
            )}
          </Table>
        </Box>
      );
    };
    const { container } = renderWithTheme(<ReactVirtualTable />);

    expect(container).toMatchSnapshot();
  });

  // Spanning Tests
  it('should render table with row spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableRow key={tableData[0]?.id} item={tableData[0]}>
                <TableCell gridRowStart={2} gridRowEnd={4}>
                  {tableData[0]?.merchant}
                </TableCell>
                <TableCell>{tableData[0]?.method}</TableCell>
                <TableCell>{tableData[0]?.amount}</TableCell>
              </TableRow>
              <TableRow key={tableData[1]?.id} item={tableData[1]}>
                <TableCell>{tableData[1]?.method}</TableCell>
                <TableCell>{tableData[1]?.amount}</TableCell>
              </TableRow>
              <TableRow key={tableData[2]?.id} item={tableData[2]}>
                <TableCell>{tableData[2]?.merchant}</TableCell>
                <TableCell>{tableData[2]?.method}</TableCell>
                <TableCell>{tableData[2]?.amount}</TableCell>
              </TableRow>
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with header spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell gridColumnStart={1} gridColumnEnd={4}>
                  Transaction Details
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with footer spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell gridColumnStart={1} gridColumnEnd={3}>
                  Total Summary
                </TableFooterCell>
                <TableFooterCell>450</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with column spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableRow item={tableData[0]}>
                <TableCell gridColumnStart={1} gridColumnEnd={4}>
                  Summary Row - Total Items: {tableData.length}
                </TableCell>
              </TableRow>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  // Grouping Tests
  it('should render table with grouping', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: groupedNodes }} isGrouped showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell
                    gridColumnStart={item.treeXLevel === 0 ? 1 : undefined}
                    gridColumnEnd={item.treeXLevel === 0 ? 3 : undefined}
                  >
                    {item.name}
                  </TableCell>
                  {item.treeXLevel !== 0 && <TableCell>{item.amount}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with grouping and selection', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { container, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: groupedNodes }}
        isGrouped
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        showBorderedCells
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell
                    gridColumnStart={item.treeXLevel === 0 ? 2 : undefined}
                    gridColumnEnd={item.treeXLevel === 0 ? 4 : undefined}
                  >
                    {item.name}
                  </TableCell>
                  {item.treeXLevel !== 0 && <TableCell>{item.amount}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const checkboxes = getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(6); // Header + 5 rows (2 parents + 3 children)

    // Click parent checkbox - should select parent + children
    await user.click(checkboxes[1]); // First parent group
    expect(onSelectionChange).toHaveBeenCalledWith({
      selectedIds: ['group1', 'child1-1', 'child1-2'],
      values: expect.any(Array),
    });

    expect(container).toMatchSnapshot();
  });

  // Nesting Tests
  it('should render table with nested expandable content', () => {
    const { container, getByText } = renderWithTheme(
      <Table data={{ nodes: spanningNodes.slice(0, 2) }}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <>
                  <TableRow key={item.id} item={item}>
                    <TableCell>{item.merchant}</TableCell>
                    <TableCell>{item.method}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                  </TableRow>
                  {item.id === '1' && (
                    <TableRow key={`${item.id}-details`} item={item}>
                      <TableCell gridColumnStart={1} gridColumnEnd={4}>
                        <Box padding="spacing.3" backgroundColor="surface.background.gray.subtle">
                          Expanded details for {item.merchant}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    expect(getByText('Expanded details for Flipkart')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  describe('stickyColumns', () => {
    const renderStickyColumnsTable = (
      props: Omit<Partial<TableProps<Item>>, 'children' | 'data'> = {},
    ): HTMLElement => {
      const { container } = renderWithTheme(
        <Table data={{ nodes: nodes.slice(0, 5) }} height="300px" isFooterSticky {...props}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.name}</TableCell>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableFooterRow>
                  {props.selectionType === 'multiple' ? <TableFooterCell>-</TableFooterCell> : null}
                  <TableFooterCell>Total</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>,
      );
      return container;
    };

    // Index of each cell of the row that is pinned. jsdom drops the `left: var(...)` offset, so a
    // pinned cell is told apart by the sticky column z-index it gets along with it.
    const getStickyCellIndexes = (row: Element): number[] =>
      Array.from(row.children)
        .map((cell, index) => ({ index, style: window.getComputedStyle(cell as HTMLElement) }))
        .filter(
          ({ style }) =>
            style.position === 'sticky' && Number(style.zIndex) >= firstColumnStickyZIndex,
        )
        .map(({ index }) => index);

    const getRows = (
      container: HTMLElement,
    ): { header: Element; body: Element; footer: Element } => {
      const rows = container.querySelectorAll('tr');
      return { header: rows[0], body: rows[1], footer: rows[rows.length - 1] };
    };

    // The `left` offset of each pinned cell, read from the CSS variables the table sets
    const getStickyCellOffsets = (container: HTMLElement): string[] => {
      const tableWrapper = container.querySelector<HTMLElement>(
        '[style*="--blade-table-sticky-cell-left-0"]',
      );
      if (!tableWrapper) return [];
      return Array.from(tableWrapper.style)
        .filter((property) => property.startsWith('--blade-table-sticky-cell-left-'))
        .map((property) => tableWrapper.style.getPropertyValue(property));
    };

    // jsdom has no layout, so the table grid is made to report the column widths a browser would
    // resolve
    const mockGridColumnWidths = (gridTemplateColumns: string): jest.SpyInstance => {
      const getComputedStyle = window.getComputedStyle.bind(window);
      return jest.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
        const style = getComputedStyle(element, pseudoElement);
        if (element.getAttribute('role') !== 'table' || element.tagName !== 'TABLE') return style;
        return new Proxy(style, {
          get: (target, property) => {
            if (property === 'display') return 'grid';
            if (property === 'gridTemplateColumns') return gridTemplateColumns;
            const value = Reflect.get(target, property);
            return typeof value === 'function' ? value.bind(target) : value;
          },
        });
      });
    };

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should pin the first N columns in the header, body and footer', async () => {
      mockGridColumnWidths('160px 180px 200px 200px 200px');
      const container = renderStickyColumnsTable({ stickyColumns: 3 });

      // the rows render after the first measurement, so the columns are pinned once measured
      await waitFor(() => {
        const { header, body, footer } = getRows(container);
        [header, body, footer].forEach((row) => {
          expect(getStickyCellIndexes(row)).toEqual([0, 1, 2]);
        });
      });
    });

    it('should pin the checkbox column without counting it towards stickyColumns', async () => {
      mockGridColumnWidths('64px 160px 180px 200px 200px 200px');
      const container = renderStickyColumnsTable({ stickyColumns: 2, selectionType: 'multiple' });

      await waitFor(() => {
        const { header, body, footer } = getRows(container);
        [header, body, footer].forEach((row) => {
          expect(getStickyCellIndexes(row)).toEqual([0, 1, 2]);
        });
      });
    });

    it('should offset each sticky column by the measured widths of the columns before it', async () => {
      mockGridColumnWidths('64px 160px 180px 200px 200px 200px');
      const container = renderStickyColumnsTable({ stickyColumns: 3, selectionType: 'multiple' });

      await waitFor(() => {
        expect(getStickyCellOffsets(container)).toEqual(['0px', '64px', '224px', '404px']);
      });
    });

    it('should pin only the first column until the column widths are measured', () => {
      // without a mocked grid, jsdom never resolves the column widths
      const container = renderStickyColumnsTable({ stickyColumns: 3 });
      expect(getStickyCellIndexes(getRows(container).body)).toEqual([0]);
      expect(getStickyCellOffsets(container)).toEqual(['0px']);

      const multiSelectContainer = renderStickyColumnsTable({
        stickyColumns: 3,
        selectionType: 'multiple',
      });
      expect(getStickyCellIndexes(getRows(multiSelectContainer).body)).toEqual([0, 1]);
      expect(getStickyCellOffsets(multiSelectContainer)).toEqual(['0px', '44px']);
    });

    it('should pin every column when stickyColumns is more than the table has', async () => {
      mockGridColumnWidths('160px 180px 200px 200px 200px');
      const container = renderStickyColumnsTable({ stickyColumns: 8 });

      await waitFor(() => {
        expect(getStickyCellIndexes(getRows(container).body)).toEqual([0, 1, 2, 3, 4]);
      });
    });

    it('should keep the sticky header and footer cells above the sticky body cells', async () => {
      mockGridColumnWidths('160px 180px 200px 200px 200px');
      const container = renderStickyColumnsTable({ stickyColumns: 3 });
      const getZIndex = (row: Element, index: number): number =>
        Number(window.getComputedStyle(row.children[index] as HTMLElement).zIndex);

      await waitFor(() => {
        const { header, body, footer } = getRows(container);
        expect(getStickyCellIndexes(body)).toEqual([0, 1, 2]);
        [0, 1, 2].forEach((index) => {
          expect(getZIndex(header, index)).toBeGreaterThan(getZIndex(body, index));
          expect(getZIndex(footer, index)).toBeGreaterThan(getZIndex(body, index));
        });
      });
    });

    it('should give stickyColumns precedence over isFirstColumnSticky', async () => {
      mockGridColumnWidths('160px 180px 200px 200px 200px');
      const container = renderStickyColumnsTable({ stickyColumns: 2, isFirstColumnSticky: true });
      await waitFor(() => {
        expect(getStickyCellIndexes(getRows(container).body)).toEqual([0, 1]);
      });

      const firstColumnContainer = renderStickyColumnsTable({ isFirstColumnSticky: true });
      expect(getStickyCellIndexes(getRows(firstColumnContainer).body)).toEqual([0]);
    });

    it('should draw the divider and scroll shadow for stickyColumns but not isFirstColumnSticky', () => {
      // the divider and shadow are switched with CSS variables that are only set for stickyColumns,
      // and both stay hidden until the table is scrolled
      const getDividerVariables = (container: HTMLElement): string[] => {
        const tableWrapper = container.querySelector<HTMLElement>(
          '[style*="--blade-table-sticky-cell-left-0"]',
        );
        return [
          tableWrapper?.style.getPropertyValue('--blade-table-sticky-column-shadow') ?? '',
          tableWrapper?.style.getPropertyValue('--blade-table-sticky-column-divider-color') ?? '',
        ];
      };

      expect(getDividerVariables(renderStickyColumnsTable({ stickyColumns: 1 }))).toEqual([
        'none',
        'transparent',
      ]);
      expect(getDividerVariables(renderStickyColumnsTable({ isFirstColumnSticky: true }))).toEqual([
        '',
        '',
      ]);
    });

    it('should not pin any column by default', () => {
      const { body } = getRows(renderStickyColumnsTable());
      expect(getStickyCellIndexes(body)).toEqual([]);
    });

    it('should keep pinning the sticky columns in a row with a cell spanning columns', async () => {
      mockGridColumnWidths('160px 180px 200px 200px 200px');
      const { container } = renderWithTheme(
        <Table data={{ nodes: nodes.slice(0, 2) }} height="300px" stickyColumns={3}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    {index === 0 ? (
                      <TableCell gridColumnStart={1} gridColumnEnd={3}>
                        {tableItem.name}
                      </TableCell>
                    ) : (
                      <>
                        <TableCell>{tableItem.name}</TableCell>
                        <TableCell>{tableItem.paymentId}</TableCell>
                      </>
                    )}
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );

      await waitFor(() => {
        const [, spanningRow, fullRow] = Array.from(container.querySelectorAll('tr'));
        expect(getStickyCellIndexes(fullRow)).toEqual([0, 1, 2]);
        // a cell spanning columns is followed by a hidden placeholder cell for each column it
        // covers, so the row keeps a cell per column: the spanning cell is pinned at the first
        // column's offset and the Method cell at the third column's, the placeholder stays hidden
        expect(spanningRow.children).toHaveLength(5);
        expect(spanningRow.children[1].classList.contains('colspan')).toBe(true);
        expect(getStickyCellIndexes(spanningRow)).toEqual([0, 2]);
      });
    });

    it('should pin the further sticky columns only in rows with a cell for every column', async () => {
      mockGridColumnWidths('160px 180px 200px 200px 200px');
      const { container } = renderWithTheme(
        <Table data={{ nodes: nodes.slice(0, 3) }} height="300px" stickyColumns={3}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    {/* the first cell spans the first two body rows, so the second row has no
                    cell for the first column */}
                    {index === 0 ? (
                      <TableCell gridRowStart={2} gridRowEnd={4}>
                        {tableItem.name}
                      </TableCell>
                    ) : null}
                    {index === 2 ? <TableCell>{tableItem.name}</TableCell> : null}
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );

      await waitFor(() => {
        const [, firstRow, rowBelowSpanningCell, fullRow] = Array.from(
          container.querySelectorAll('tr'),
        );
        expect(getStickyCellIndexes(firstRow)).toEqual([0, 1, 2]);
        expect(getStickyCellIndexes(fullRow)).toEqual([0, 1, 2]);
        // the cells of this row are one column further right than their position in the row, so
        // only the first one stays pinned as before
        expect(getStickyCellIndexes(rowBelowSpanningCell)).toEqual([0]);
      });
    });

    it('should pin every sticky column in rows with and without hover actions', async () => {
      // the hover actions column is the last grid track
      mockGridColumnWidths('160px 180px 200px 200px 200px 0px');
      const { container } = renderWithTheme(
        <Table data={{ nodes: nodes.slice(0, 2) }} height="300px" stickyColumns={3}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow
                    item={tableItem}
                    key={index}
                    hoverActions={index === 0 ? <Box>Action</Box> : undefined}
                  >
                    <TableCell>{tableItem.name}</TableCell>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );

      await waitFor(() => {
        const [, rowWithHoverActions, rowWithoutHoverActions] = Array.from(
          container.querySelectorAll('tr'),
        );
        expect(getStickyCellIndexes(rowWithHoverActions)).toEqual([0, 1, 2]);
        // a row without hover actions is one cell short, but it is told apart from a row below a
        // row-spanning cell by not being marked as having hover actions
        expect(getStickyCellIndexes(rowWithoutHoverActions)).toEqual([0, 1, 2]);
      });
    });

    it('should pin the sticky columns in a multi-select footer without a checkbox cell', async () => {
      mockGridColumnWidths('64px 160px 180px 200px 200px 200px');
      const { container } = renderWithTheme(
        <Table
          data={{ nodes: nodes.slice(0, 2) }}
          height="300px"
          selectionType="multiple"
          stickyColumns={2}
          isFooterSticky
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.name}</TableCell>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableFooterRow>
                  {/* no cell for the checkbox column, so the row is one cell short at the end */}
                  <TableFooterCell>Total</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>,
      );

      await waitFor(() => {
        const rows = Array.from(container.querySelectorAll('tr'));
        const footer = rows[rows.length - 1];
        expect(footer.children).toHaveLength(5);
        expect(getStickyCellIndexes(footer)).toEqual([0, 1, 2]);
      });
    });

    it('should pin only the first column on mobile', async () => {
      jest.spyOn(useIsMobileModule, 'useIsMobile').mockReturnValue(true);
      mockGridColumnWidths('64px 160px 180px 200px 200px 200px');

      const container = renderStickyColumnsTable({ stickyColumns: 3, selectionType: 'multiple' });
      await waitFor(() => {
        expect(getStickyCellOffsets(container)).toEqual(['0px', '64px']);
      });
      expect(getStickyCellIndexes(getRows(container).body)).toEqual([0, 1]);
    });
  });
});
