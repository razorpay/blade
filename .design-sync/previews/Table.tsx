import React from 'react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  Badge,
  Code,
} from '@razorpay/blade/components';

const transactionData = {
  nodes: [
    {
      id: '1',
      paymentId: 'rzp_1234567890',
      amount: 2500.0,
      status: 'Completed',
      date: '2024-01-15',
      method: 'Credit Card',
    },
    {
      id: '2',
      paymentId: 'rzp_9876543210',
      amount: 1500.5,
      status: 'Pending',
      date: '2024-01-16',
      method: 'Bank Transfer',
    },
    {
      id: '3',
      paymentId: 'rzp_5555555555',
      amount: 3200.75,
      status: 'Failed',
      date: '2024-01-17',
      method: 'PayPal',
    },
  ],
};

export const Basic = () => (
  <Table data={transactionData}>
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Payment ID</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item) => (
            <TableRow key={item.id} item={item}>
              <TableCell>
                <Code size="medium">{item.paymentId}</Code>
              </TableCell>
              <TableCell>₹{item.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  color={
                    item.status === 'Completed'
                      ? 'positive'
                      : item.status === 'Pending'
                      ? 'notice'
                      : 'negative'
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

export const WithFooter = () => (
  <Table data={transactionData}>
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
          {tableData.map((item) => (
            <TableRow key={item.id} item={item}>
              <TableCell>
                <Code size="medium">{item.paymentId}</Code>
              </TableCell>
              <TableCell>₹{item.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  color={
                    item.status === 'Completed'
                      ? 'positive'
                      : item.status === 'Pending'
                      ? 'notice'
                      : 'negative'
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableFooterRow>
            <TableFooterCell>Total</TableFooterCell>
            <TableFooterCell>₹7,201.25</TableFooterCell>
            <TableFooterCell>-</TableFooterCell>
          </TableFooterRow>
        </TableFooter>
      </>
    )}
  </Table>
);

export const Sortable = () => (
  <Table
    data={transactionData}
    sortFunctions={{
      PAYMENT_ID: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
      AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
      DATE: (array) => array.sort((a, b) => a.date.localeCompare(b.date)),
    }}
  >
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
            <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
            <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
            <TableHeaderCell>Method</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item) => (
            <TableRow key={item.id} item={item}>
              <TableCell>
                <Code size="medium">{item.paymentId}</Code>
              </TableCell>
              <TableCell>₹{item.amount.toFixed(2)}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.method}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

export const Selectable = () => (
  <Table data={transactionData} selectionType="multiple">
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
          {tableData.map((item) => (
            <TableRow key={item.id} item={item}>
              <TableCell>
                <Code size="medium">{item.paymentId}</Code>
              </TableCell>
              <TableCell>₹{item.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  color={
                    item.status === 'Completed'
                      ? 'positive'
                      : item.status === 'Pending'
                      ? 'notice'
                      : 'negative'
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

export const CompactDensity = () => (
  <Table data={transactionData} rowDensity="compact">
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Payment ID</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Method</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item) => (
            <TableRow key={item.id} item={item}>
              <TableCell>
                <Code size="medium">{item.paymentId}</Code>
              </TableCell>
              <TableCell>₹{item.amount.toFixed(2)}</TableCell>
              <TableCell>{item.method}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);
