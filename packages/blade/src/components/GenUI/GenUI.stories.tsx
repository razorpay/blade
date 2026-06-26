import React, { useEffect, useState, useRef } from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { jsonrepair } from 'jsonrepair';
import { GenUIProvider } from './GenUIProvider';
import { GenUISchemaRenderer } from './GenUISchemaRenderer';
import type { GenUIComponent } from './GenUIComponents';
import { Box } from '~components/Box';
import type { BoxProps } from '~components/Box';
import { getBoxArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { ChevronUpDownIcon } from '~components/Icons';
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
          component: 'CARD',
          title: 'Payment Link Created',
          description: 'Your new payment link is ready',
          footer: null,
          children: [
            {
              component: 'STACK',
              direction: 'vertical',
              gap: 'medium',
              children: [
                {
                  component: 'INFO_GROUP',
                  items: [
                    {
                      key: { children: 'Amount' },
                      value: { children: { component: 'AMOUNT', value: 100, currency: 'INR' } },
                    },
                    {
                      key: { children: 'Status' },
                      value: {
                        children: { component: 'BADGE', text: 'Created', color: 'positive' },
                      },
                    },
                    { key: { children: 'Link ID' }, value: { children: 'plink_SP2rJtPRhJ5gZu' } },
                  ],
                },
                {
                  component: 'LINK',
                  text: 'Open Payment Link',
                  action: {
                    type: 'CLICK',
                    eventName: 'link_click',
                    data: { url: 'https://rzp.io/rzp/8nMpkJZ' },
                  },
                },
              ],
            },
          ],
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

type TextStringStoryArgs = {
  content: string;
};

const TextStringTemplate: StoryFn<TextStringStoryArgs> = ({ content }): JSX.Element => {
  return (
    <GenUIProvider>
      <GenUISchemaRenderer
        isAnimating={false}
        components={[
          {
            component: 'TEXT',
            content,
          },
        ]}
      />
    </GenUIProvider>
  );
};

export const TextString = TextStringTemplate.bind({});
TextString.args = {
  content: [
    '# Heading 1',
    '## Heading 2',
    '### Heading 3',
    '#### Heading 4',
    '##### Heading 5',
    '###### Heading 6',
    '',
    'This is a regular paragraph with **bold text**, *italic text*, ***bold and italic***, and `inline code`.',
    '',
    'Here is a [hyperlink](https://razorpay.com) inside a sentence.',
    '',
    '## Unordered List',
    '',
    '- First item',
    '- Second item with **bold**',
    '- Third item with *italic*',
    '  - Nested item A',
    '  - Nested item B',
    '- Fourth item',
    '',
    '## Ordered List',
    '',
    '1. Step one',
    '2. Step two with `code`',
    '3. Step three',
    '   1. Sub-step A',
    '   2. Sub-step B',
    '4. Step four',
    '',
    '## Blockquote',
    '',
    '> This is a blockquote with **bold** and *italic* inside it.',
    '> It can span multiple lines.',
    '',
    '## Code Block',
    '',
    '```js',
    'const greeting = "Hello, Blade!";',
    'console.log(greeting);',
    '```',
    '',
    '## Mixed Emphasis',
    '',
    'You can combine *italic and **bold inside italic*** or **bold with *italic inside bold***.',
    '',
    '---',
    '',
    '*Footer note in italics.*',
  ].join('\n'),
};
TextString.argTypes = {
  content: {
    control: 'text',
  },
};

const merchantDuplicateMarkdownTableScenarios: Array<{
  title: string;
  components: GenUIComponent[];
}> = [
  {
    title: 'Failed Payments',
    components: [
      {
        component: 'TEXT',
        content:
          'You have 4 failed payments in total. Here they are:\n\n' +
          '| # | Payment ID | Amount | Status | Contact | Date |\n' +
          '|---|---|---|---|---|---|\n' +
          '| 1 | pay_SOJ4XrMPRKtO4g | INR 5.00 | Failed | +917636802936 | 07 Mar, 04:12 PM |\n' +
          '| 2 | pay_SMeXeyPnHOZbpE | INR 10.00 | Failed | +918806922557 | 03 Mar, 11:54 AM |\n\n' +
          'All failures occurred in early March 2026.',
      },
      {
        component: 'TABLE',
        headers: ['Payment ID', 'Amount', 'Status', 'Contact', 'Date'],
        rows: [
          [
            { component: 'LINK', text: 'pay_SOJ4XrMPRKtO4g' },
            { component: 'TEXT', value: 'INR 5.00' },
            { component: 'BADGE', value: 'Failed', color: 'negative' },
            { component: 'TEXT', value: '+917636802936' },
            { component: 'TEXT', value: '07 Mar, 04:12 PM' },
          ],
          [
            { component: 'LINK', text: 'pay_SMeXeyPnHOZbpE' },
            { component: 'TEXT', value: 'INR 10.00' },
            { component: 'BADGE', value: 'Failed', color: 'negative' },
            { component: 'TEXT', value: '+918806922557' },
            { component: 'TEXT', value: '03 Mar, 11:54 AM' },
          ],
        ],
      },
    ],
  },
  {
    title: 'Refund Fees',
    components: [
      {
        component: 'TEXT',
        content:
          "Here's the fee breakdown for each of your last 10 refunds:\n\n" +
          '| Refund ID | Payment ID | Refund Amount | Fee | Tax | Total Fee |\n' +
          '|---|---|---|---|---|---|\n' +
          '| rfnd_SpHOaENSuADPyV | pay_SpBSOTesHIlrPt | INR 1599.00 | INR 37.74 | INR 5.76 | INR 43.50 |\n' +
          '| rfnd_So4XV4d9LYZoVB | pay_SnzmL9T5y8xc25 | INR 10.00 | INR 0.12 | INR 0.02 | INR 0.14 |\n\n' +
          'Total fees across all 10 refunds: INR 46.95.',
      },
      {
        component: 'TABLE',
        headers: ['Refund ID', 'Payment ID', 'Refund Amount', 'Fee', 'Tax', 'Total Fee'],
        rows: [
          [
            { component: 'LINK', text: 'rfnd_SpHOaENSuADPyV' },
            { component: 'LINK', text: 'pay_SpBSOTesHIlrPt' },
            { component: 'TEXT', value: 'INR 1599.00' },
            { component: 'TEXT', value: 'INR 37.74' },
            { component: 'TEXT', value: 'INR 5.76' },
            { component: 'TEXT', value: 'INR 43.50' },
          ],
          [
            { component: 'LINK', text: 'rfnd_So4XV4d9LYZoVB' },
            { component: 'LINK', text: 'pay_SnzmL9T5y8xc25' },
            { component: 'TEXT', value: 'INR 10.00' },
            { component: 'TEXT', value: 'INR 0.12' },
            { component: 'TEXT', value: 'INR 0.02' },
            { component: 'TEXT', value: 'INR 0.14' },
          ],
        ],
      },
    ],
  },
  {
    title: 'Settlements by Year',
    components: [
      {
        component: 'TEXT',
        content:
          'Settlements in 2026:\n\n' +
          '| Settlement ID | Amount | Status | Date |\n' +
          '|---|---|---|---|\n' +
          '| setl_2026A1 | INR 12850.00 | Processed | 14 Mar 2026 |\n' +
          '| setl_2026B2 | INR 9640.00 | Processed | 22 Apr 2026 |\n\n' +
          'Settlements in 2025:\n\n' +
          '| Settlement ID | Amount | Status | Date |\n' +
          '|---|---|---|---|\n' +
          '| setl_2025A1 | INR 11220.00 | Processed | 18 Mar 2025 |\n' +
          '| setl_2025B2 | INR 8730.00 | Processed | 28 Apr 2025 |',
      },
      {
        component: 'TABLE',
        headers: ['Settlement ID', 'Amount', 'Status', 'Date'],
        rows: [
          [
            { component: 'LINK', text: 'setl_2026A1' },
            { component: 'TEXT', value: 'INR 12850.00' },
            { component: 'BADGE', value: 'Processed', color: 'positive' },
            { component: 'TEXT', value: '14 Mar 2026' },
          ],
          [
            { component: 'LINK', text: 'setl_2026B2' },
            { component: 'TEXT', value: 'INR 9640.00' },
            { component: 'BADGE', value: 'Processed', color: 'positive' },
            { component: 'TEXT', value: '22 Apr 2026' },
          ],
        ],
      },
      {
        component: 'TABLE',
        headers: ['Settlement ID', 'Amount', 'Status', 'Date'],
        rows: [
          [
            { component: 'LINK', text: 'setl_2025A1' },
            { component: 'TEXT', value: 'INR 11220.00' },
            { component: 'BADGE', value: 'Processed', color: 'positive' },
            { component: 'TEXT', value: '18 Mar 2025' },
          ],
          [
            { component: 'LINK', text: 'setl_2025B2' },
            { component: 'TEXT', value: 'INR 8730.00' },
            { component: 'BADGE', value: 'Processed', color: 'positive' },
            { component: 'TEXT', value: '28 Apr 2025' },
          ],
        ],
      },
    ],
  },
  {
    title: 'Payment Health',
    components: [
      {
        component: 'TEXT',
        content:
          "Here's an analysis of your payment health:\n\n" +
          '| Metric | Value |\n' +
          '|---|---|\n' +
          '| Total Successful Payments | 7 |\n' +
          '| Total Volume Collected | INR 1835.00 |\n' +
          '| Failed Payments | 4 |\n' +
          '| Success Rate | 64% |\n\n' +
          'Moderate concern: success rate is below the usual healthy range.',
      },
      {
        component: 'TABLE',
        headers: ['Metric', 'Value'],
        rows: [
          [
            { component: 'TEXT', value: 'Total Successful Payments' },
            { component: 'TEXT', value: '7' },
          ],
          [
            { component: 'TEXT', value: 'Total Volume Collected' },
            { component: 'TEXT', value: 'INR 1835.00' },
          ],
          [
            { component: 'TEXT', value: 'Failed Payments' },
            { component: 'TEXT', value: '4' },
          ],
          [
            { component: 'TEXT', value: 'Success Rate' },
            { component: 'TEXT', value: '64%' },
          ],
        ],
      },
    ],
  },
  {
    title: 'Standalone Markdown Table Preserved',
    components: [
      {
        component: 'TEXT',
        content:
          'This reference table has no matching GenUI table and should remain visible:\n\n' +
          '| Field | Meaning |\n' +
          '|---|---|\n' +
          '| id | Internal identifier |',
      },
    ],
  },
];

const MerchantDuplicateMarkdownTableComparison = ({
  title,
  components,
}: {
  title: string;
  components: GenUIComponent[];
}): JSX.Element => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isSliding, setIsSliding] = useState(false);
  const [frameWidth, setFrameWidth] = useState<number | undefined>();
  const frameRef = useRef<HTMLDivElement>(null);
  const comparisonTransition =
    'left 140ms cubic-bezier(0.2, 0, 0, 1), width 140ms cubic-bezier(0.2, 0, 0, 1)';

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setFrameWidth(entry.contentRect.width);
    });
    resizeObserver.observe(frame);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Text size="large" weight="semibold">
        {title}
      </Text>
      <div
        ref={frameRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '320px',
          border: '1px solid #D7D9DD',
          borderRadius: '8px',
          backgroundColor: '#F9F9F7',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            zIndex: 3,
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Text size="small" weight="semibold" color="surface.text.gray.subtle">
            Before
          </Text>
        </div>
        <div
          style={{
            position: 'absolute',
            right: '12px',
            bottom: '12px',
            zIndex: 3,
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Text size="small" weight="semibold" color="surface.text.gray.subtle">
            After
          </Text>
        </div>
        <div style={{ padding: '20px', overflow: 'auto' }}>
          <GenUIProvider>
            <GenUISchemaRenderer
              isAnimating={false}
              components={components}
              duplicateMarkdownTableHandling={{ isEnabled: true }}
            />
          </GenUIProvider>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: `${sliderPosition}%`,
            overflow: 'hidden',
            backgroundColor: '#F9F9F7',
            transition: comparisonTransition,
          }}
        >
          <div
            style={{
              width: frameWidth ? `${frameWidth}px` : '100%',
              padding: '20px',
              overflow: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <GenUIProvider>
              <GenUISchemaRenderer isAnimating={false} components={components} />
            </GenUIProvider>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            zIndex: 2,
            width: '2px',
            backgroundColor: '#0B72E7',
            transform: 'translateX(-50%)',
            transition: comparisonTransition,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${sliderPosition}%`,
            zIndex: 3,
            display: 'flex',
            width: '40px',
            height: '40px',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #D7D9DD',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            boxShadow: isSliding
              ? '0 8px 20px rgba(15, 23, 42, 0.18)'
              : '0 2px 8px rgba(15, 23, 42, 0.14)',
            transform: `translate(-50%, -50%) scale(${isSliding ? 1.06 : 1})`,
            transition: `${comparisonTransition}, box-shadow 140ms cubic-bezier(0.2, 0, 0, 1), transform 140ms cubic-bezier(0.2, 0, 0, 1)`,
          }}
        >
          <div style={{ display: 'flex', transform: 'rotate(90deg)' }}>
            <ChevronUpDownIcon size="large" color="surface.icon.gray.subtle" />
          </div>
        </div>
        <input
          aria-label={`${title} comparison slider`}
          min="0"
          max="100"
          type="range"
          value={sliderPosition}
          onChange={(event) => setSliderPosition(Number(event.target.value))}
          onPointerDown={() => setIsSliding(true)}
          onPointerUp={() => setIsSliding(false)}
          onPointerCancel={() => setIsSliding(false)}
          onBlur={() => setIsSliding(false)}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            zIndex: 4,
            width: '100%',
            height: '100%',
            cursor: 'ew-resize',
          }}
        />
      </div>
    </Box>
  );
};

const MerchantDuplicateMarkdownTableTemplate: StoryFn<typeof GenUISchemaRenderer> = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.9"
      maxWidth="1200px"
      padding="spacing.5"
    >
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Text size="xlarge" weight="semibold">
          Duplicate Markdown Table Regression
        </Text>
        <Text size="medium" color="surface.text.gray.subtle">
          Use this story to compare today&apos;s raw pipe-table leak with the opt-in renderer safety
          net.
        </Text>
        <Text size="medium" color="surface.text.gray.subtle">
          Drag each slider to reveal before and after.
        </Text>
      </Box>
      {merchantDuplicateMarkdownTableScenarios.map((scenario) => (
        <MerchantDuplicateMarkdownTableComparison
          key={scenario.title}
          title={scenario.title}
          components={scenario.components}
        />
      ))}
    </Box>
  );
};

export const MerchantDuplicateMarkdownTableRegression = MerchantDuplicateMarkdownTableTemplate.bind(
  {},
);

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
