import { Table } from '../Table';
import type { TableProps } from '../Table';
import { TableBody, TableCell, TableRow } from '../TableBody';
import { TableFooter, TableFooterCell, TableFooterRow } from '../TableFooter';
import { TableHeader, TableHeaderCell, TableHeaderRow } from '../TableHeader';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

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
    status: 'success',
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
    status: 'success',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '5',
    paymentId: 'rzp05',
    amount: 200,
    status: 'success',
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
    status: 'success',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '9',
    paymentId: 'rzp09',
    amount: 200,
    status: 'success',
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
    status: 'success',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '13',
    paymentId: 'rzp13',
    amount: 200,
    status: 'success',
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
    status: 'success',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '17',
    paymentId: 'rzp17',
    amount: 200,
    status: 'success',
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
    status: 'success',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
];

const data: TableProps<Item>['data'] = {
  nodes,
};

describe('<Table />', () => {
  it('should render table', () => {
    const { container } = renderWithTheme(
      <Table data={data}>
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
});
