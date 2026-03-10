import React, { useState, useRef } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { jsonrepair } from 'jsonrepair';
import { GenUIProvider } from './GenUIProvider';
import { GenUISchemaRenderer } from './GenUISchemaRenderer';
import { Box } from '~components/Box';
import type { BoxProps } from '~components/Box';
import { getBoxArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';

export default {
  title: 'Patterns/GenUI',
  component: GenUISchemaRenderer,
  args: {},
  tags: ['autodocs'],
  argTypes: getBoxArgTypes(),
} as Meta<BoxProps>;

const schema = {
  components: [
    {
      component: 'TEXT',
      content: '# Example of All UI Components',
    },
    {
      component: 'TEXT',
      content:
        'This template demonstrates various UI components including charts, tables, alerts, and cards. Each component is tailored to specific data types and user intents.',
    },
    {
      component: 'TEXT',
      content:
        '### Features\n\n- **Bold text** and *italic text* support\n- `Inline code` and code blocks\n- [Links](https://razorpay.com) to external resources\n- Ordered and unordered lists',
    },
    {
      component: 'TEXT',
      content:
        '### Numbered List\n\n1. First item\n2. Second item\n3. Third item with **bold** and *italic*\n4. Fourth item with `code`',
    },
    {
      component: 'TEXT',
      content: '### Amount Component\n',
    },
    { component: 'AMOUNT', value: 10000, currency: 'INR' },
    {
      component: 'STACK',
      direction: 'vertical',
      gap: 'medium',
      children: [
        {
          component: 'STACK',
          direction: 'horizontal',
          gap: 'medium',
          children: [
            {
              component: 'CARD',
              title: 'Line Chart Example',
              description: 'Visualizing trends over time.',
              children: [
                {
                  component: 'CHART',
                  chartType: 'line',
                  variant: 'full',
                  valueFormatter: {
                    type: 'number',
                  },
                  xAxis: 'month',
                  data: [
                    {
                      month: 'January',
                      value: 100,
                    },
                    {
                      month: 'February',
                      value: 150,
                    },
                    {
                      month: 'March',
                      value: 200,
                    },
                  ],
                },
              ],
            },
            {
              component: 'CARD',
              title: 'Bar Chart Example',
              description: 'Comparing categories.',
              children: [
                {
                  component: 'CHART',
                  chartType: 'bar',
                  variant: 'full',
                  valueFormatter: {
                    type: 'number',
                  },
                  xAxis: 'category',
                  data: [
                    {
                      category: 'A',
                      value: 300,
                    },
                    {
                      category: 'B',
                      value: 450,
                    },
                    {
                      category: 'C',
                      value: 120,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          component: 'CARD',
          title: 'Pie Chart Example',
          description: 'Part-to-whole relationships.',
          children: [
            {
              component: 'CHART',
              chartType: 'pie',
              variant: 'full',
              valueFormatter: {
                type: 'percentage',
              },
              xAxis: 'segment',
              data: [
                {
                  segment: 'Segment 1',
                  value: 40,
                },
                {
                  segment: 'Segment 2',
                  value: 35,
                },
                {
                  segment: 'Segment 3',
                  value: 25,
                },
              ],
            },
          ],
        },
        {
          component: 'CARD',
          children: [
            {
              component: 'TEXT',
              content:
                'This card demonstrates optional title/subtitle. It only contains body content without a CardHeader.',
            },
            {
              component: 'BADGE',
              text: 'No Header',
              color: 'notice',
            },
          ],
        },
        {
          component: 'TABLE',
          headers: ['Transaction ID', 'Customer', 'Status', 'Amount', 'Date', 'Details'],
          rowActions: [
            {
              type: 'ICON_BUTTON',
              icon: 'view',
              accessibilityLabel: 'View transaction',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'view_transaction',
              },
            },
            {
              type: 'ICON_BUTTON',
              icon: 'edit',
              accessibilityLabel: 'Edit transaction',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'edit_transaction',
              },
            },
            {
              type: 'ICON_BUTTON',
              icon: 'delete',
              accessibilityLabel: 'Delete transaction',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'delete_transaction',
              },
            },
          ],
          rows: [
            [
              {
                component: 'TEXT',
                value: 'pay_NxGT5fK8mZ2abc',
                copyable: true,
              },
              {
                component: 'TEXT',
                value: 'Alice Johnson',
              },
              {
                component: 'BADGE',
                value: 'Captured',
                color: 'positive',
              },
              {
                component: 'AMOUNT',
                value: 500000,
                currency: 'INR',
              },
              {
                component: 'DATE',
                value: '2024-01-15T14:30:00Z',
                dateFormat: 'DD MMM YYYY, HH:mm',
              },
              {
                component: 'LINK',
                text: 'View Details',
                action: {
                  type: 'CLICK',
                  eventName: 'link_click',
                  data: {
                    url: 'https://dashboard.razorpay.com/payments/pay_NxGT5fK8mZ2abc',
                  },
                },
              },
            ],
            [
              {
                component: 'TEXT',
                value: 'pay_MwFS4eJ7lY1xyz',
                copyable: true,
              },
              {
                component: 'TEXT',
                value: 'Bob Smith',
              },
              {
                component: 'INDICATOR',
                value: 'Processing',
                color: 'notice',
              },
              {
                component: 'AMOUNT',
                value: 7500,
                currency: 'USD',
              },
              {
                component: 'DATE',
                value: '2024-01-14T09:15:00Z',
                dateFormat: 'DD MMM YYYY, HH:mm',
              },
              {
                component: 'LINK',
                text: 'View Details',
                action: {
                  type: 'CLICK',
                  eventName: 'link_click',
                  data: {
                    url: 'https://dashboard.razorpay.com/payments/pay_MwFS4eJ7lY1xyz',
                  },
                },
              },
            ],
            [
              {
                component: 'TEXT',
                value: 'pay_LvER3dI6kX0def',
                copyable: true,
              },
              {
                component: 'TEXT',
                value: 'Charlie Brown',
              },
              {
                component: 'BADGE',
                value: 'Failed',
                color: 'negative',
              },
              {
                component: 'AMOUNT',
                value: 25000,
                currency: 'MYR',
              },
              {
                component: 'DATE',
                value: '2024-01-13T16:45:00Z',
                dateFormat: 'DD MMM YYYY, HH:mm',
              },
              {
                component: 'LINK',
                text: 'View Details',
                action: {
                  type: 'CLICK',
                  eventName: 'link_click',
                  data: {
                    url: 'https://dashboard.razorpay.com/payments/pay_LvER3dI6kX0def',
                  },
                },
              },
            ],
            [
              {
                component: 'TEXT',
                value: 'pay_KuDQ2cH5jW9ghi',
                copyable: true,
              },
              {
                component: 'TEXT',
                value: 'Diana Ross',
              },
              {
                component: 'INDICATOR',
                value: 'Refunded',
                color: 'information',
              },
              {
                component: 'AMOUNT',
                value: 150000,
                currency: 'INR',
              },
              {
                component: 'DATE',
                value: '2024-01-12T11:20:00Z',
                dateFormat: 'DD MMM YYYY, HH:mm',
              },
              {
                component: 'LINK',
                text: 'View Details',
                action: {
                  type: 'CLICK',
                  eventName: 'link_click',
                  data: {
                    url: 'https://dashboard.razorpay.com/payments/pay_KuDQ2cH5jW9ghi',
                  },
                },
              },
            ],
          ],
        },
        {
          component: 'ALERT',
          title: 'Important Notice',
          description: 'Ensure all data is reviewed before submission.',
          color: 'notice',
          actions: {
            primary: {
              text: 'Review Data',
              action: {
                type: 'CLICK',
                eventName: 'review_data',
                data: {
                  message: 'Review the data',
                },
              },
            },
            secondary: {
              text: 'Dismiss',
              action: {
                type: 'CLICK',
                eventName: 'dismiss_alert',
                data: {
                  message: 'Dismiss the alert',
                },
              },
            },
          },
        },
        {
          component: 'STACK',
          direction: 'horizontal',
          gap: 'medium',
          children: [
            {
              component: 'CARD',
              title: 'Summary Card 1',
              children: [
                {
                  component: 'TEXT',
                  content: 'Key metric: 75%',
                },
              ],
            },
            {
              component: 'CARD',
              title: 'Summary Card 2',
              children: [
                {
                  component: 'TEXT',
                  content: 'Revenue: $50,000',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const SimpleGenUITemplate: StoryFn<typeof GenUISchemaRenderer> = (): JSX.Element => {
  const fullJSONString = JSON.stringify(schema, null, 2);
  const totalJSONLength = fullJSONString.length;
  const [jsonPosition, setJsonPosition] = useState(7200);
  const lastValidComponentsRef = useRef(schema.components);

  // Try to parse the partial JSON and update last valid components if successful
  const partialJSONString = fullJSONString.slice(0, jsonPosition);
  let componentsToRender = lastValidComponentsRef.current;

  try {
    // Try to repair and parse the incomplete JSON using jsonrepair
    const repairedJSON = jsonrepair(partialJSONString);
    const partialSchema = JSON.parse(repairedJSON);
    // If parsing succeeds and we have components, update the ref and use them
    if (partialSchema.components && Array.isArray(partialSchema.components)) {
      lastValidComponentsRef.current = partialSchema.components;
      componentsToRender = partialSchema.components;
    }
  } catch {
    // If parsing fails, use the last valid components from ref
  }

  return (
    <Box>
      <GenUIProvider>
        {componentsToRender && componentsToRender.length > 0 ? (
          <GenUISchemaRenderer
            isAnimating={false}
            animateOptions={{ duration: 300, sep: 'word' }}
            components={componentsToRender}
          />
        ) : (
          <Box padding="spacing.5">
            <Text color="surface.text.gray.muted">
              Move the slider to start rendering components from the JSON schema...
            </Text>
          </Box>
        )}
      </GenUIProvider>
      <Box
        position="fixed"
        bottom="spacing.5"
        left="spacing.0"
        right="spacing.0"
        display="flex"
        justifyContent="center"
        zIndex={1000}
      >
        <Box
          width="400px"
          padding="spacing.5"
          backgroundColor="surface.background.gray.intense"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          borderRadius="medium"
          elevation="highRaised"
        >
          <Text size="medium" weight="semibold" marginBottom="spacing.2">
            JSON Progress: {jsonPosition.toLocaleString()} / {totalJSONLength.toLocaleString()}{' '}
            characters ({Math.round((jsonPosition / totalJSONLength) * 100)}%)
          </Text>
          <input
            type="range"
            min={0}
            max={totalJSONLength}
            value={jsonPosition}
            onChange={(e) => setJsonPosition(Number(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const SimpleGenUI = SimpleGenUITemplate.bind({});

const defaultTableRowActions = [
  {
    type: 'ICON_BUTTON',
    icon: 'view',
    accessibilityLabel: 'View details',
    action: {
      type: 'TABLE_ROW_ACTION',
      eventName: 'view_row',
    },
  },
  {
    type: 'ICON_BUTTON',
    icon: 'edit',
    accessibilityLabel: 'Edit row',
    action: {
      type: 'TABLE_ROW_ACTION',
      eventName: 'edit_row',
    },
  },
  {
    type: 'ICON_BUTTON',
    icon: 'delete',
    accessibilityLabel: 'Delete row',
    action: {
      type: 'TABLE_ROW_ACTION',
      eventName: 'delete_row',
    },
  },
];

const wideTableSchema = {
  components: [
    {
      component: 'TEXT',
      content: '# Wide Table Example',
    },
    {
      component: 'TEXT',
      content:
        'This example demonstrates a table with many columns. The table is horizontally scrollable when it overflows.',
    },
    {
      component: 'TABLE',
      headers: [
        'Transaction ID',
        'Customer Name',
        'Email',
        'Phone',
        'Status',
        'Amount',
        'Currency',
        'Payment Method',
        'Date',
        'Region',
        'Notes',
      ],
      rowActions: defaultTableRowActions,
      rows: [
        [
          { component: 'TEXT', value: 'pay_NxGT5fK8mZ2abc', copyable: true },
          { component: 'TEXT', value: 'Alice Johnson' },
          { component: 'TEXT', value: 'alice.johnson@example.com', copyable: true },
          { component: 'TEXT', value: '+91 98765 43210' },
          { component: 'BADGE', value: 'Captured', color: 'positive' },
          { component: 'AMOUNT', value: 500000, currency: 'INR' },
          { component: 'TEXT', value: 'INR' },
          { component: 'TEXT', value: 'Credit Card' },
          { component: 'DATE', value: '2024-01-15T14:30:00Z', dateFormat: 'DD MMM YYYY, HH:mm' },
          { component: 'TEXT', value: 'Asia Pacific' },
          { component: 'TEXT', value: 'Premium customer' },
        ],
        [
          { component: 'TEXT', value: 'pay_MwFS4eJ7lY1xyz', copyable: true },
          { component: 'TEXT', value: 'Bob Smith' },
          { component: 'TEXT', value: 'bob.smith@company.org', copyable: true },
          { component: 'TEXT', value: '+1 555 123 4567' },
          { component: 'BADGE', value: 'Processing', color: 'notice' },
          { component: 'AMOUNT', value: 7500, currency: 'USD' },
          { component: 'TEXT', value: 'USD' },
          { component: 'TEXT', value: 'Debit Card' },
          { component: 'DATE', value: '2024-01-14T09:15:00Z', dateFormat: 'DD MMM YYYY, HH:mm' },
          { component: 'TEXT', value: 'North America' },
          { component: 'TEXT', value: 'First-time buyer' },
        ],
        [
          { component: 'TEXT', value: 'pay_LvER3dI6kX0def', copyable: true },
          { component: 'TEXT', value: 'Charlie Brown' },
          { component: 'TEXT', value: 'charlie.b@email.net', copyable: true },
          { component: 'TEXT', value: '+60 12 345 6789' },
          { component: 'BADGE', value: 'Failed', color: 'negative' },
          { component: 'AMOUNT', value: 25000, currency: 'MYR' },
          { component: 'TEXT', value: 'MYR' },
          { component: 'TEXT', value: 'Bank Transfer' },
          { component: 'DATE', value: '2024-01-13T16:45:00Z', dateFormat: 'DD MMM YYYY, HH:mm' },
          { component: 'TEXT', value: 'Southeast Asia' },
          { component: 'TEXT', value: 'Insufficient funds' },
        ],
        [
          { component: 'TEXT', value: 'pay_KuDQ2cH5jW9ghi', copyable: true },
          { component: 'TEXT', value: 'Diana Ross' },
          { component: 'TEXT', value: 'diana.ross@music.com', copyable: true },
          { component: 'TEXT', value: '+44 20 7946 0958' },
          { component: 'BADGE', value: 'Refunded', color: 'information' },
          { component: 'AMOUNT', value: 150000, currency: 'INR' },
          { component: 'TEXT', value: 'INR' },
          { component: 'TEXT', value: 'UPI' },
          { component: 'DATE', value: '2024-01-12T11:20:00Z', dateFormat: 'DD MMM YYYY, HH:mm' },
          { component: 'TEXT', value: 'Europe' },
          { component: 'TEXT', value: 'Customer requested refund' },
        ],
      ],
    },
  ],
};

const simpleTableSchema = {
  components: [
    {
      component: 'TEXT',
      content: '## Simple Table',
    },
    {
      component: 'TEXT',
      content: 'A basic table with minimal columns that fits within the viewport.',
    },
    {
      component: 'TABLE',
      headers: ['Name', 'Role', 'Status'],
      rowActions: defaultTableRowActions,
      rows: [
        [
          { component: 'TEXT', value: 'John Doe' },
          { component: 'TEXT', value: 'Engineer' },
          { component: 'BADGE', value: 'Active', color: 'positive' },
        ],
        [
          { component: 'TEXT', value: 'Jane Smith' },
          { component: 'TEXT', value: 'Designer' },
          { component: 'BADGE', value: 'Active', color: 'positive' },
        ],
        [
          { component: 'TEXT', value: 'Bob Wilson' },
          { component: 'TEXT', value: 'Manager' },
          { component: 'BADGE', value: 'Away', color: 'notice' },
        ],
      ],
    },
  ],
};

const invoiceTableSchema = {
  components: [
    {
      component: 'TEXT',
      content: '## Invoice Items Table',
    },
    {
      component: 'TEXT',
      content: 'A table showing invoice line items with amounts and quantities.',
    },
    {
      component: 'TABLE',
      headers: ['Item', 'Description', 'Qty', 'Unit Price', 'Total'],
      rowActions: defaultTableRowActions,
      rows: [
        [
          { component: 'TEXT', value: 'SKU-001' },
          { component: 'TEXT', value: 'Premium Widget Pro' },
          { component: 'TEXT', value: '5' },
          { component: 'AMOUNT', value: 2500, currency: 'INR' },
          { component: 'AMOUNT', value: 12500, currency: 'INR' },
        ],
        [
          { component: 'TEXT', value: 'SKU-002' },
          { component: 'TEXT', value: 'Standard Gadget' },
          { component: 'TEXT', value: '10' },
          { component: 'AMOUNT', value: 1000, currency: 'INR' },
          { component: 'AMOUNT', value: 10000, currency: 'INR' },
        ],
        [
          { component: 'TEXT', value: 'SKU-003' },
          { component: 'TEXT', value: 'Service Fee' },
          { component: 'TEXT', value: '1' },
          { component: 'AMOUNT', value: 500, currency: 'INR' },
          { component: 'AMOUNT', value: 500, currency: 'INR' },
        ],
      ],
    },
  ],
};

const settlementTableSchema = {
  components: [
    {
      component: 'TEXT',
      content: '## Settlement Report',
    },
    {
      component: 'TEXT',
      content: 'Settlement details with UTR numbers and bank information.',
    },
    {
      component: 'TABLE',
      headers: [
        'Settlement ID',
        'UTR',
        'Bank Account',
        'Amount',
        'Fee',
        'Net Amount',
        'Date',
        'Status',
      ],
      rowActions: defaultTableRowActions,
      rows: [
        [
          { component: 'TEXT', value: 'setl_ABC123XYZ', copyable: true },
          { component: 'TEXT', value: 'UTIB0002345678901234', copyable: true },
          { component: 'TEXT', value: 'HDFC ****4521' },
          { component: 'AMOUNT', value: 100000, currency: 'INR' },
          { component: 'AMOUNT', value: 236, currency: 'INR' },
          { component: 'AMOUNT', value: 99764, currency: 'INR' },
          { component: 'DATE', value: '2024-01-15T10:00:00Z', dateFormat: 'DD MMM YYYY' },
          { component: 'BADGE', value: 'Processed', color: 'positive' },
        ],
        [
          { component: 'TEXT', value: 'setl_DEF456UVW', copyable: true },
          { component: 'TEXT', value: 'UTIB0009876543210987', copyable: true },
          { component: 'TEXT', value: 'HDFC ****4521' },
          { component: 'AMOUNT', value: 250000, currency: 'INR' },
          { component: 'AMOUNT', value: 590, currency: 'INR' },
          { component: 'AMOUNT', value: 249410, currency: 'INR' },
          { component: 'DATE', value: '2024-01-14T10:00:00Z', dateFormat: 'DD MMM YYYY' },
          { component: 'BADGE', value: 'Processed', color: 'positive' },
        ],
        [
          { component: 'TEXT', value: 'setl_GHI789RST', copyable: true },
          { component: 'TEXT', value: 'UTIB0001122334455667', copyable: true },
          { component: 'TEXT', value: 'ICICI ****8832' },
          { component: 'AMOUNT', value: 75000, currency: 'INR' },
          { component: 'AMOUNT', value: 177, currency: 'INR' },
          { component: 'AMOUNT', value: 74823, currency: 'INR' },
          { component: 'DATE', value: '2024-01-13T10:00:00Z', dateFormat: 'DD MMM YYYY' },
          { component: 'BADGE', value: 'Pending', color: 'notice' },
        ],
      ],
    },
  ],
};

const tableExamplesSchema = {
  components: [
    {
      component: 'TEXT',
      content: '# Table Examples',
    },
    {
      component: 'TEXT',
      content:
        'This page showcases various table configurations - from simple tables that fit within the viewport to wide tables that require horizontal scrolling.',
    },
    ...simpleTableSchema.components,
    { component: 'SPACER', size: 'large' },
    ...invoiceTableSchema.components,
    { component: 'SPACER', size: 'large' },
    ...settlementTableSchema.components,
    { component: 'SPACER', size: 'large' },
    ...wideTableSchema.components,
  ],
};

const TableExamplesTemplate: StoryFn<typeof GenUISchemaRenderer> = (): JSX.Element => {
  const fullJSONString = JSON.stringify(tableExamplesSchema, null, 2);
  const totalJSONLength = fullJSONString.length;
  const [jsonPosition, setJsonPosition] = useState(totalJSONLength);
  const lastValidComponentsRef = useRef(tableExamplesSchema.components);

  const partialJSONString = fullJSONString.slice(0, jsonPosition);
  let componentsToRender = lastValidComponentsRef.current;

  try {
    const repairedJSON = jsonrepair(partialJSONString);
    const partialSchema = JSON.parse(repairedJSON);
    if (partialSchema.components && Array.isArray(partialSchema.components)) {
      lastValidComponentsRef.current = partialSchema.components;
      componentsToRender = partialSchema.components;
    }
  } catch {
    // If parsing fails, use the last valid components from ref
  }

  return (
    <Box>
      <Box maxWidth="900px">
        <GenUIProvider>
          {componentsToRender && componentsToRender.length > 0 ? (
            <GenUISchemaRenderer
              isAnimating={false}
              animateOptions={{ duration: 300, sep: 'word' }}
              components={componentsToRender}
            />
          ) : (
            <Box padding="spacing.5">
              <Text color="surface.text.gray.muted">
                Move the slider to start rendering components from the JSON schema...
              </Text>
            </Box>
          )}
        </GenUIProvider>
      </Box>
      <Box
        position="fixed"
        bottom="spacing.5"
        left="spacing.0"
        right="spacing.0"
        display="flex"
        justifyContent="center"
        zIndex={1000}
      >
        <Box
          width="400px"
          padding="spacing.5"
          backgroundColor="surface.background.gray.intense"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          borderRadius="medium"
          elevation="highRaised"
        >
          <Text size="medium" weight="semibold" marginBottom="spacing.2">
            JSON Progress: {jsonPosition.toLocaleString()} / {totalJSONLength.toLocaleString()}{' '}
            characters ({Math.round((jsonPosition / totalJSONLength) * 100)}%)
          </Text>
          <input
            type="range"
            min={0}
            max={totalJSONLength}
            value={jsonPosition}
            onChange={(e) => setJsonPosition(Number(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const TableExamples = TableExamplesTemplate.bind({});
