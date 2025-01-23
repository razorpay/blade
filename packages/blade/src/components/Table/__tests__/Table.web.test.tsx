import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { Table } from '../Table';
import { TableBody, TableCell, TableRow } from '../TableBody';
import { TableFooter, TableFooterCell, TableFooterRow } from '../TableFooter';
import { TableHeader, TableHeaderCell, TableHeaderRow } from '../TableHeader';
import { TableToolbar } from '../TableToolbar';
import { TablePagination } from '../TablePagination';
import { TableEditableCell } from '../TableEditableCell';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Amount } from '~components/Amount';

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
    const { getByText } = renderWithTheme(
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
    const secondSelectableRow = getByText('rzp02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [nodes[1]], selectedIds: ['2'] });
  });

  it('should render table with multi select', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText, getAllByRole, getByRole } = renderWithTheme(
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
    const secondSelectableRow = getByText('rzp02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({
      values: [nodes[0], nodes[1]],
      selectedIds: ['1', '2'],
    });
    expect(getByText('2 Items Selected')).toBeInTheDocument();
    const deselectButton = getByText('Deselect');
    await user.click(deselectButton);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [], selectedIds: [] });
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
    const selectInput = getByRole('combobox', { name: 'Select pages per row' });
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
});
