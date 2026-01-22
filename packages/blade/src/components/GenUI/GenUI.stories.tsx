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
        '## Features\n\n- **Bold text** and *italic text* support\n- `Inline code` and code blocks\n- [Links](https://razorpay.com) to external resources\n- Ordered and unordered lists',
    },
    {
      component: 'TEXT',
      content:
        '### Code Example\n\n```javascript\nconst example = () => {\n  return "Hello, World!";\n};\n```',
    },
    {
      component: 'TEXT',
      content:
        '#### Numbered List\n\n1. First item\n2. Second item\n3. Third item with **bold** and *italic*\n4. Fourth item with `code`',
    },
    {
      component: 'STACK',
      direction: 'vertical',
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
          headers: ['Name', 'Status', 'Amount', 'Date'],
          rows: [
            [
              {
                component: 'TEXT',
                value: 'Alice',
              },
              {
                component: 'BADGE',
                value: 'Active',
                color: 'positive',
              },
              {
                component: 'AMOUNT',
                value: 5000,
                currency: 'USD',
              },
              {
                component: 'DATE',
                value: '2023-10-01',
                dateFormat: 'DD MMM YYYY',
              },
            ],
            [
              {
                component: 'TEXT',
                value: 'Bob',
              },
              {
                component: 'BADGE',
                value: 'Inactive',
                color: 'negative',
              },
              {
                component: 'AMOUNT',
                value: 3000,
                currency: 'USD',
              },
              {
                component: 'DATE',
                value: '2023-09-15',
                dateFormat: 'DD MMM YYYY',
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
  const [jsonPosition, setJsonPosition] = useState(totalJSONLength);
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
    // Fallback: try to parse just the components array if possible
    try {
      const componentsMatch = partialJSONString.match(/"components"\s*:\s*\[([\s\S]*)/);
      if (componentsMatch) {
        const componentsStr = componentsMatch[1];
        const repairedComponents = jsonrepair(`[${componentsStr}]`);
        const parsedComponents = JSON.parse(repairedComponents);
        if (Array.isArray(parsedComponents)) {
          lastValidComponentsRef.current = parsedComponents;
          componentsToRender = parsedComponents;
        }
      }
    } catch {
      // If all parsing fails, use the last valid components from ref
    }
  }

  return (
    <Box>
      <GenUIProvider>
        <Box padding="spacing.5" backgroundColor="surface.background.gray.subtle">
          <Box marginBottom="spacing.3">
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
    </Box>
  );
};

export const SimpleGenUI = SimpleGenUITemplate.bind({});
