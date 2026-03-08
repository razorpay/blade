// @ts-nocheck
import { z } from 'zod';

const ClickActionSchema = z
  .object({
    type: z.literal('CLICK'),
    eventName: z.string().describe('Unique event identifier for this action').optional(),
    data: z
      .object({
        message: z
          .string()
          .nonempty()
          .describe('The message to be sent to the LLM when the button is clicked')
          .optional(),
      })
      .describe('The data to be sent to the LLM')
      .optional(),
  })
  .describe(
    'A natural language action to be performed when the button is clicked, this will be executed as a further query to LLM',
  )
  .optional();

const textSchema = z.object({
  component: z.literal('TEXT'),
  content: z.string().describe('Any textual content, can contain markdown'),
});

const chartSchema = z.object({
  component: z.literal('CHART'),
  chartType: z
    .enum(['bar', 'line', 'pie', 'area'])
    .describe('The type of the chart, only valid values are bar, line, pie, and area'),
  variant: z
    .enum(['full', 'tiny'])
    .describe(
      'The variant of the chart, full is the default and tiny is a smaller version of the chart which can be easily used in a card',
    ),
  valueFormatter: z.object({
    type: z
      .enum(['currency', 'percentage', 'number', 'string'])
      .describe('The type of the value formatter, uses Intl.NumberFormat API to format the value'),
    currency: z
      .string()
      .optional()
      .nullable()
      .describe(
        '[Optional unless currency type is selected] The currency to be used for the value formatter, three-letter ISO 4217 currency code (e.g., "USD", "EUR", "JPY")',
      ),
    suffix: z
      .string()
      .optional()
      .nullable()
      .describe(
        'The suffix to be used for the value formatter, eg: "B" for billion, "M" for million, "K" for thousand, and more',
      ),
  }),
  xAxis: z.string().describe('[Required] The key of the data to be used for the x-axis'), // e.g. "quarter"
  data: z
    .array(
      z
        .object({})
        .catchall(z.union([z.number(), z.string()])) // arbitrary keys allowed
        .refine(
          (obj) =>
            Object.keys(obj).length > 0 && // must have at least 1 keys
            Object.values(obj).every((val) => typeof val === 'number' || typeof val === 'string'),
          { message: 'Each data object must contain multiple string/number pairs' },
        ),
    )
    .nonempty()
    .describe(
      'The data to be used for the chart, Data shape: [{"revenue": 100, "quarter": "Q1"}, {"revenue": 200, "quarter": "Q2"}], Where xAxis can be "quarter" or "revenue"',
    ),
});

// Table cell component schemas (reusable component pattern)
const tableCellTextSchema = z.object({
  component: z.literal('TEXT'),
  value: z.string().describe('Plain text content'),
  copyable: z
    .boolean()
    .optional()
    .describe('If true, shows a copy button to copy the value to clipboard'),
});

const tableCellAmountSchema = z.object({
  component: z.literal('AMOUNT'),
  value: z.number().describe('Amount value in the smallest currency unit'),
  currency: z
    .enum(['INR', 'MYR', 'USD'])
    .default('INR')
    .describe('Three-letter ISO 4217 currency code'),
});

const tableCellIndicatorSchema = z.object({
  component: z.literal('INDICATOR'),
  value: z.string().describe('Text to display next to the indicator'),
  color: z
    .enum(['positive', 'negative', 'notice', 'neutral', 'primary', 'information'])
    .describe('Indicator color'),
});

const tableCellBadgeSchema = z.object({
  component: z.literal('BADGE'),
  value: z.string().describe('Badge text to display'),
  color: z
    .enum(['positive', 'negative', 'notice', 'neutral', 'primary', 'information'])
    .describe('Badge color'),
});

const tableCellDateSchema = z.object({
  component: z.literal('DATE'),
  value: z.string().describe('ISO date string or timestamp'),
  dateFormat: z
    .string()
    .describe(
      'Date format pattern using dayjs tokens. Examples: "MM/DD/YY" → 01/15/24, "DD MMM YYYY" → 15 Jan 2024, "YYYY-MM-DD HH:mm" → 2024-01-15 14:30. Default: "DD MMM YYYY, HH:mm"',
    ),
});

const tableCellLinkSchema = z
  .object({
    component: z.literal('LINK'),
    text: z.string().describe('Link text to display'),
    action: z
      .object({
        type: z.literal('CLICK'),
        eventName: z.literal('link_click'),
        data: z
          .object({
            url: z.string().nonempty().describe('The URL to be opened when the link is clicked'),
          })
          .describe('The data to be sent to the LLM')
          .optional(),
      })
      .describe('Action to be performed when the link is clicked')
      .optional(),
  })
  .describe('Link cell - use url for external links and action for internal navigation');

// Union of all cell component types
const tableCellSchema = z.union([
  tableCellTextSchema,
  tableCellAmountSchema,
  tableCellIndicatorSchema,
  tableCellBadgeSchema,
  tableCellDateSchema,
  tableCellLinkSchema,
]);

// Table row action schema - follows same structure as ClickActionSchema
// Note: Row index and row data will be automatically merged into data when the action is triggered
const TableRowActionSchema = z
  .object({
    type: z.literal('TABLE_ROW_ACTION'),
    eventName: z.string().describe('Unique event identifier for this action'),
  })
  .describe(
    'Action for table row interactions. Row context (index, cell data) is automatically included when triggered.',
  );

const tableRowActionButtonSchema = z.object({
  type: z.literal('BUTTON'),
  text: z.string().describe('Button label text'),
  action: TableRowActionSchema,
});

const tableRowActionIconButtonSchema = z.object({
  type: z.literal('ICON_BUTTON'),
  icon: z
    .enum(['check', 'close', 'edit', 'delete', 'download', 'view', 'copy'])
    .describe('Icon to display'),
  accessibilityLabel: z.string().describe('Accessibility label for the icon button'),
  action: TableRowActionSchema,
});

const tableRowActionSchema = z.union([tableRowActionButtonSchema, tableRowActionIconButtonSchema]);

const tableSchema = z.object({
  component: z.literal('TABLE'),
  headers: z.array(z.string()),
  rows: z
    .array(z.array(tableCellSchema))
    .describe(
      'Each row is an array of cells. Each cell must be an object with a component property (TEXT, AMOUNT, INDICATOR, BADGE, DATE) and component-specific properties',
    ),
  rowActions: z
    .array(tableRowActionSchema)
    .optional()
    .describe('Actions that appear on row hover. Can be buttons or icon buttons.'),
});

const alertSchema = z.object({
  component: z.literal('ALERT'),
  title: z.string().describe('The title of the alert'),
  description: z.string().describe('The description of the alert'),
  color: z
    .enum(['information', 'negative', 'neutral', 'notice', 'positive'])
    .default('neutral')
    .describe('The color of the alert, use colors based on intent and context.'),
  actions: z
    .object({
      primary: z
        .object({
          text: z.string(),
          action: ClickActionSchema,
        })
        .optional(),
      secondary: z
        .object({
          text: z.string(),
          action: ClickActionSchema,
        })
        .optional(),
    })
    .optional(),
});

const buttonSchema = z.object({
  component: z.literal('BUTTON'),
  text: z.string(),
  action: ClickActionSchema,
});

const linkSchema = z
  .object({
    component: z.literal('LINK'),
    text: z.string().describe('Link text to display'),
    action: z
      .object({
        type: z.literal('CLICK'),
        eventName: z.literal('link_click'),
        data: z
          .object({
            url: z.string().nonempty().describe('The URL to navigate to when the link is clicked'),
          })
          .optional(),
      })
      .describe('Action to be performed when the link is clicked')
      .optional(),
  })
  .describe('Link component - consumer handles navigation via onActionClick callback');

const badgeSchema = z.object({
  component: z.literal('BADGE'),
  text: z.string(),
  color: z.enum(['neutral', 'negative', 'notice', 'positive', 'primary']),
});

const dividerSchema = z.object({
  component: z.literal('DIVIDER'),
  orientation: z
    .enum(['horizontal', 'vertical'])
    .describe('Divider orientation (defaults to horizontal)'),
  thickness: z.number().describe('Divider thickness in pixels'),
});

const infoGroupSchema = z.object({
  component: z
    .literal('INFO_GROUP')
    .describe(
      'InfoGroup is a structured component for displaying key-value pairs in a consistent, organized format.',
    ),
  items: z.array(
    z.object({
      key: z.object({
        helpText: z.string().optional().describe('Help text of the info item'),
        children: z.string().describe('Children of the info item'),
      }),
      value: z.object({
        helpText: z.string().optional().describe('Help text of the info item value'),
        children: z.string().describe('Children of the info item value'),
      }),
    }),
  ),
});

// Declare componentSchema first to allow forward references
const componentSchema = z.lazy(() =>
  z.union([
    textSchema,
    chartSchema,
    tableSchema,
    alertSchema,
    badgeSchema,
    dividerSchema,
    infoGroupSchema,
    buttonSchema,
    linkSchema,
    // Accordion with nested children support
    z.object({
      component: z.literal('ACCORDION'),
      items: z
        .array(
          z.object({
            title: z.string().describe('Title of the accordion item'),
            description: z.string().optional().describe('Optional description below the title'),
            children: z
              .array(componentSchema)
              .describe('Array of GenUI components to render when expanded'),
          }),
        )
        .describe('Array of accordion items'),
      defaultExpandedIndex: z
        .number()
        .optional()
        .describe('Index of the item to expand by default (0-based)'),
      variant: z
        .enum(['filled', 'transparent'])
        .default('transparent')
        .describe('Visual variant of the accordion'),
      showNumberPrefix: z
        .boolean()
        .optional()
        .describe('If true, shows numeric prefix before each item'),
    }),
    // Tabs with nested children support
    z.object({
      component: z.literal('TABS'),
      items: z
        .array(
          z.object({
            value: z.string().describe('Unique identifier for this tab'),
            label: z.string().describe('Label text shown in the tab'),
            children: z
              .array(componentSchema)
              .describe('Array of GenUI components to render in this tab panel'),
            isDisabled: z.boolean().optional().describe('If true, the tab will be disabled'),
          }),
        )
        .describe('Array of tab items'),
      defaultValue: z.string().optional().describe('Value of the tab to select by default'),
      variant: z
        .enum(['bordered', 'borderless', 'filled'])
        .default('bordered')
        .describe('Visual variant of the tabs'),
      size: z.enum(['small', 'medium', 'large']).default('medium').describe('Size of the tabs'),
      isFullWidthTabItem: z
        .boolean()
        .optional()
        .describe('If true, tabs will fill available width'),
    }),
    // Layout primitives with children
    z.object({
      component: z.literal('STACK'),
      direction: z
        .enum(['vertical', 'horizontal'])
        .default('vertical')
        .describe('Stack direction: vertical (column) or horizontal (row)'),
      gap: z.enum(['small', 'medium', 'large']).optional().describe('Spacing between children'),
      children: z.array(componentSchema).optional(),
    }),
    z.object({
      component: z.literal('GRID'),
      columns: z.number().optional().describe('Number of columns in the grid'),
      gap: z.enum(['small', 'medium', 'large']).optional().describe('Spacing between children'),
      children: z.array(componentSchema).optional(),
    }),
    z.object({
      component: z.literal('CARD'),
      title: z.string(),
      description: z.string(),
      footer: z.string().nullable().optional(),
      children: z.array(componentSchema).optional(),
    }),
  ]),
);

/**
 * @type {any}
 */
const GenUISpecSchema = z.array(componentSchema);

const genUISchemaPrompt = `
## Blade GenUI Schema

Render rich, interactive UI using the Blade Design System components. The spec must be a JSON object with a "components" array.

### Available Components

**Layout Components:**
- STACK: Vertical or horizontal stack layout with children
- GRID: Grid layout with columns (1-6)
- CARD: Card container with title, description, footer, and children
- SPACER: Empty space (small, medium, large)
- DIVIDER: Horizontal or vertical divider

**Content Components:**
- TEXT: Markdown text (supports headings, bold, italic, links, lists, code)
- AMOUNT: Currency amount display (value in smallest unit, e.g., paise)
- BADGE: Status badge with color (positive, negative, notice, neutral, primary, information)
- ALERT: Alert message with title, description, color, and actions

**Data Components:**
- CHART: Charts (bar, line, pie, area) with data array and xAxis key
- TABLE: Data table with headers, rows of typed cells, and row actions
- INFO_GROUP: Key-value pairs display

**Interactive Components:**
- BUTTON: Clickable button with action
- LINK: Clickable link with action
- ACCORDION: Collapsible sections with title, description, and nested GenUI components
- TABS: Tabbed interface with nested GenUI components in each panel (supports any component as children)

### Table Cell Types
- TEXT: Plain text, optionally copyable
- AMOUNT: Currency amount
- INDICATOR: Status indicator with color
- BADGE: Status badge with color
- DATE: Formatted date (ISO 8601 string with optional dateFormat)
- LINK: Clickable link

### Accordion Example
\`\`\`json
{
  "component": "ACCORDION",
  "variant": "filled",
  "defaultExpandedIndex": 0,
  "items": [
    {
      "title": "Getting Started",
      "description": "Learn the basics",
      "children": [
        { "component": "TEXT", "content": "## Welcome\\n\\nThis is the content of the first accordion item." },
        { "component": "TEXT", "content": "- Step 1: Install\\n- Step 2: Configure\\n- Step 3: Deploy" }
      ]
    },
    {
      "title": "Advanced Usage",
      "children": [
        { "component": "TEXT", "content": "More advanced features and configurations." },
        { "component": "BUTTON", "children": "Learn More", "variant": "secondary" }
      ]
    }
  ]
}
\`\`\`

### Tabs Example
\`\`\`json
{
  "component": "TABS",
  "variant": "bordered",
  "defaultValue": "overview",
  "items": [
    {
      "value": "overview",
      "label": "Overview",
      "children": [
        { "component": "TEXT", "content": "## Overview\\n\\nThis is the overview tab content." },
        { "component": "BADGE", "value": "Active", "color": "positive" }
      ]
    },
    {
      "value": "details",
      "label": "Details",
      "children": [
        { "component": "TEXT", "content": "Detailed information goes here." },
        {
          "component": "INFO_GROUP",
          "items": [
            { "label": { "children": "Status" }, "value": { "children": "Completed" } },
            { "label": { "children": "Updated" }, "value": { "children": "Today" } }
          ]
        }
      ]
    },
    {
      "value": "settings",
      "label": "Settings",
      "children": [{ "component": "TEXT", "content": "Settings and configuration options." }],
      "isDisabled": true
    }
  ]
}
\`\`\`

### Example Spec

\`\`\`json
{
  "components": [
    { "component": "TEXT", "content": "# Dashboard\\n\\nWelcome to your analytics dashboard." },
    {
      "component": "STACK",
      "direction": "horizontal",
      "gap": "medium",
      "children": [
        {
          "component": "CARD",
          "title": "Revenue",
          "description": "Monthly revenue trend",
          "children": [
            {
              "component": "CHART",
              "chartType": "line",
              "xAxis": "month",
              "data": [
                { "month": "Jan", "revenue": 10000 },
                { "month": "Feb", "revenue": 15000 }
              ],
              "valueFormatter": { "type": "currency", "currency": "INR" }
            }
          ]
        }
      ]
    },
    {
      "component": "TABLE",
      "headers": ["ID", "Customer", "Status", "Amount"],
      "rows": [
        [
          { "component": "TEXT", "value": "TXN001", "copyable": true },
          { "component": "TEXT", "value": "John Doe" },
          { "component": "BADGE", "value": "Success", "color": "positive" },
          { "component": "AMOUNT", "value": 50000, "currency": "INR" }
        ]
      ]
    }
  ]
}
\`\`\`
`;

export {
  genUISchemaPrompt,
  GenUISpecSchema,
};
