import type { TableData } from '../types';
import type { BadgeProps } from '~components/Badge';

type TableExampleItem = {
  id: string;
  paymentId: string;
  amount: number;
  date: Date;
  status: string;
  type: string;
  method: string;
  account: string;
  name: string;
};

const statuses = ['Completed', 'Pending', 'Failed'];
const types = ['Payout', 'Refund'];
const methods = ['Bank Transfer', 'Credit Card', 'PayPal'];
const names = [
  'John Doe',
  'Jane Doe',
  'Bob Smith',
  'Alice Smith',
  'John Smith',
  'Jane Smith',
  'Bob Doe',
  'Alice Doe',
];

const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const createTableNodes = (count: number): TableExampleItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: (index + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    date: new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    status: pickRandom(statuses),
    type: pickRandom(types),
    method: pickRandom(methods),
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: pickRandom(names),
  }));

const createTableData = (count: number): TableData<TableExampleItem> => ({
  nodes: createTableNodes(count),
});

const getStatusColor = (status: string): BadgeProps['color'] => {
  if (status === 'Completed') return 'positive';
  if (status === 'Pending') return 'notice';
  if (status === 'Failed') return 'negative';
  return 'primary';
};

const formatDate = (date: Date | undefined): string | undefined =>
  date?.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export { createTableNodes, createTableData, getStatusColor, formatDate };
export type { TableExampleItem };
