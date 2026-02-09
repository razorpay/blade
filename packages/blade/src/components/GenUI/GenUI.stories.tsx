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
          component: 'TABLE',
          headers: ['Transaction ID', 'Customer', 'Status', 'Amount', 'Date', 'Details'],
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
          rowActions: [
            {
              type: 'ICON_BUTTON',
              icon: 'view',
              accessibilityLabel: 'View transaction details',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'view_transaction',
              },
            },
            {
              type: 'ICON_BUTTON',
              icon: 'copy',
              accessibilityLabel: 'Copy transaction ID',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'copy_transaction_id',
              },
            },
            {
              type: 'ICON_BUTTON',
              icon: 'download',
              accessibilityLabel: 'Download receipt',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'download_receipt',
              },
            },
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
              description: 'Key metric: 75%',
              footer: 'Last updated: Today',
              children: [],
            },
            {
              component: 'CARD',
              title: 'Summary Card 2',
              description: 'Revenue: $50,000',
              footer: 'Last updated',
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
          <GenUISchemaRenderer components={componentsToRender} />
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
