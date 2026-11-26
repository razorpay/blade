import type { GenUIComponent } from '../GenUIComponents';

/**
 * Card shapes for card layout tests and stories. All values are made up.
 * The shapes follow the cards an LLM sends most often: a record, a summary with metric tiles,
 * sections split by dividers, a stacked settlement, a details list, and a card with a table.
 */

const tile = (value: string, label: string): GenUIComponent =>
  ({
    component: 'STACK',
    direction: 'vertical',
    gap: 'small',
    children: [
      { component: 'TEXT', content: `**${value}**` },
      { component: 'TEXT', content: label },
    ],
  } as GenUIComponent);

const record = {
  component: 'CARD',
  title: 'Payment pay_Rk3vXXXXXXZp2Lw',
  description: 'Captured on 12 Nov 2026, 14:05',
  children: [
    {
      component: 'INFO_GROUP',
      items: [
        {
          key: { children: 'Amount' },
          value: { children: { component: 'AMOUNT', value: 2499, currency: 'INR' } },
        },
        {
          key: { children: 'Status' },
          value: { children: { component: 'BADGE', text: 'Captured', color: 'positive' } },
        },
        { key: { children: 'Method' }, value: { children: 'UPI' } },
        { key: { children: 'VPA' }, value: { children: 'customer.name.longhandle@okexamplebank' } },
        { key: { children: 'Order ID' }, value: { children: 'order_Rk3vXXXXXXAbC12' } },
      ],
    },
  ],
} as GenUIComponent;

const summary = {
  component: 'CARD',
  title: 'Collections this week',
  description: '6 Nov to 12 Nov 2026',
  children: [
    {
      component: 'GRID',
      columns: 3,
      gap: 'small',
      children: [
        tile('₹12,34,56,789.00', 'Collected'),
        tile('₹4,51,920.50', 'Refunded'),
        tile('₹12,30,04,868.50', 'After refunds'),
      ],
    },
    { component: 'DIVIDER' },
    {
      component: 'INFO_GROUP',
      items: [
        { key: { children: 'Payments' }, value: { children: '1,204' } },
        { key: { children: 'Success rate' }, value: { children: '96.4%' } },
      ],
    },
  ],
} as GenUIComponent;

const sections = {
  component: 'CARD',
  title: 'Refund rfnd_Rk3vXXXXXXQw9Ty',
  children: [
    {
      component: 'INFO_GROUP',
      items: [
        {
          key: { children: 'Amount' },
          value: { children: { component: 'AMOUNT', value: 500, currency: 'INR' } },
        },
        {
          key: { children: 'Status' },
          value: { children: { component: 'BADGE', text: 'Processed', color: 'positive' } },
        },
      ],
    },
    { component: 'DIVIDER' },
    {
      component: 'INFO_GROUP',
      items: [
        { key: { children: 'Payment ID' }, value: { children: 'pay_Rk3vXXXXXXZp2Lw' } },
        { key: { children: 'Speed' }, value: { children: 'Normal' } },
      ],
    },
    { component: 'DIVIDER' },
    {
      component: 'INFO_GROUP',
      items: [{ key: { children: 'Created on' }, value: { children: '12 Nov 2026, 14:20' } }],
    },
  ],
} as GenUIComponent;

const stackedSettlement = {
  component: 'CARD',
  title: 'Settlement setl_Rk3vXXXXXXLm4Np',
  description: 'Settled to your bank account',
  children: [
    {
      component: 'STACK',
      direction: 'vertical',
      gap: 'small',
      children: [
        { component: 'TEXT', content: '**₹8,42,310.00**' },
        {
          component: 'INFO_GROUP',
          items: [
            { key: { children: 'UTR' }, value: { children: 'UTIBR72026111200481516' } },
            { key: { children: 'Fees' }, value: { children: '₹1,240.00' } },
          ],
        },
      ],
    },
  ],
} as GenUIComponent;

const detailsList = {
  component: 'CARD',
  title: 'Customer details',
  children: [
    {
      component: 'INFO_GROUP',
      items: [
        { key: { children: 'Customer ID' }, value: { children: 'cust_Rk3vXXXXXXHj7Ka' } },
        {
          key: { children: 'Email' },
          value: { children: 'customer.name.longhandle@examplecompany.co.in' },
        },
        {
          key: { children: 'Website' },
          value: { children: 'https://www.example.com/store/checkout/thank-you' },
        },
        { key: { children: 'Phone' }, value: { children: '+91 90000 00000' } },
      ],
    },
  ],
} as GenUIComponent;

const cardWithTable = {
  component: 'CARD',
  title: 'Recent payments',
  description: 'Last 3 payments',
  children: [
    {
      component: 'TABLE',
      headers: ['Payment ID', 'Email', 'Status', 'Amount'],
      rows: [
        [
          { component: 'TEXT', value: 'pay_Rk3vXXXXXXZp2Lw' },
          { component: 'TEXT', value: 'customer.name.longhandle@examplecompany.co.in' },
          { component: 'BADGE', value: 'Captured', color: 'positive' },
          { component: 'AMOUNT', value: 2499, currency: 'INR' },
        ],
        [
          { component: 'TEXT', value: 'pay_Rk3vXXXXXXAb12C' },
          { component: 'TEXT', value: 'another.customer@example.com' },
          { component: 'BADGE', value: 'Refunded', color: 'information' },
          { component: 'AMOUNT', value: 850, currency: 'INR' },
        ],
        [
          { component: 'TEXT', value: 'pay_Rk3vXXXXXXCd34E' },
          { component: 'TEXT', value: 'third@example.com' },
          { component: 'BADGE', value: 'Failed', color: 'negative' },
          { component: 'AMOUNT', value: 120, currency: 'INR' },
        ],
      ],
    },
  ],
} as GenUIComponent;

const cardLayoutSamples: Record<string, GenUIComponent> = {
  record,
  summary,
  sections,
  stackedSettlement,
  detailsList,
  cardWithTable,
};

export { cardLayoutSamples, tile };
