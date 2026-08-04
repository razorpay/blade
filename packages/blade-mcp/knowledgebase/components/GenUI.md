# GenUI

## Description

`GenUI` renders structured AI responses as Blade interfaces on the web. `GenUIProvider`
supplies the built-in and custom component registry, while `GenUISchemaRenderer` turns a
possibly incomplete, streaming component array into text, charts, tables, cards, actions, and
other Blade UI. Consumers can register product-specific renderers and receive structured action
events without coupling the renderer to an AI provider.

## Important Constraints

- GenUI is currently supported on web only. Its React Native exports throw a not-supported error.
- `GenUISchemaRenderer` must be rendered inside `GenUIProvider`.
- Register custom components through the `components` field inside the provider's `config` prop.
- Pass action handling through `config={{ onActionClick }}`; GenUI does not execute actions,
  navigate, or submit follow-up prompts automatically.
- Streaming schemas can contain missing properties, partial strings, and incomplete array items.
  Custom renderers must handle those states without throwing.

## TypeScript Types

These types define the provider registry, custom components, action events, and schema
renderer props.

```typescript
type GenUIBaseComponent = {
  component?: string;
};

type GenUICustomComponent<
  TName extends string,
  TProps extends Record<string, unknown>
> = GenUIBaseComponent & { component: TName } & TProps;

type GenUIAction = {
  type: string;
  eventName?: string;
  data?: Record<string, unknown>;
};

type GenUIComponentRenderer<
  T extends GenUIBaseComponent = GenUIBaseComponent
> = React.ComponentType<T & { index: number }>;

type GenUIComponentDefinition<T extends GenUIBaseComponent = GenUIBaseComponent> = {
  renderer: GenUIComponentRenderer<T>;
  isValidPartial?: (partialName: string) => boolean;
  animation?: {
    name: 'gradient-ring-entry' | (string & Record<never, never>);
  };
};

type GenUIComponentRegistry = Record<string, GenUIComponentDefinition>;

type GenUIConfig = {
  components?: GenUIComponentRegistry;
  onActionClick?: (action: GenUIAction) => void;
};

type GenUIProviderProps = {
  children: React.ReactNode;
  config?: GenUIConfig;
};

type GenUISchemaRendererProps = {
  components?: GenUIComponent[];
  isAnimating?: boolean;
  animateOptions?: {
    duration?: number;
    easing?: string;
    sep?: 'word' | 'char';
  };
};
```

The built-in component schemas accepted by `GenUISchemaRenderer` are:

```typescript
type TextComponent = {
  component: 'TEXT';
  content?: string;
};

type ChartComponent = {
  component: 'CHART';
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  variant?: 'full' | 'tiny';
  title?: string;
  xAxis?: string;
  data?: Array<Record<string, string | number>>;
  unit?: string;
  valueFormatter?: {
    type: 'currency' | 'percentage' | 'number' | 'string';
    currency?: string;
    suffix?: string;
  };
};

type TableCellType =
  | { component: 'TEXT'; value: string; copyable?: boolean }
  | { component: 'AMOUNT'; value: number; currency?: string }
  | {
      component: 'INDICATOR';
      value: string;
      color: 'positive' | 'negative' | 'notice' | 'neutral' | 'primary' | 'information';
    }
  | {
      component: 'BADGE';
      value: string;
      color: 'positive' | 'negative' | 'notice' | 'neutral' | 'primary' | 'information';
    }
  | { component: 'DATE'; value: string; dateFormat?: string }
  | {
      component: 'LINK';
      text: string;
      copyable?: boolean;
      action?: {
        type: 'CLICK';
        eventName?: 'link_click';
        data?: { url?: string };
      };
    };

type TableRowAction =
  | {
      type: 'BUTTON';
      text: string;
      action: { type: 'TABLE_ROW_ACTION'; eventName: string };
    }
  | {
      type: 'ICON_BUTTON';
      icon: 'check' | 'close' | 'edit' | 'delete' | 'download' | 'view' | 'copy';
      accessibilityLabel: string;
      action: { type: 'TABLE_ROW_ACTION'; eventName: string };
    };

type TableComponent = {
  component: 'TABLE';
  headers?: string[];
  rows?: TableCellType[][];
  rowActions?: TableRowAction[];
};

type BadgeComponent = {
  component: 'BADGE';
  text?: string;
  color?: 'neutral' | 'negative' | 'notice' | 'positive' | 'primary' | 'information';
};

type SpacerComponent = {
  component: 'SPACER';
  size?: 'small' | 'medium' | 'large';
};

type DividerComponent = {
  component: 'DIVIDER';
  orientation?: 'horizontal' | 'vertical';
};

type StackComponent = {
  component: 'STACK';
  direction?: 'vertical' | 'horizontal';
  gap?: 'small' | 'medium' | 'large';
  children?: GenUIComponent[];
};

type GridComponent = {
  component: 'GRID';
  columns?: number;
  gap?: 'small' | 'medium' | 'large';
  children?: GenUIComponent[];
};

type CardComponent = {
  component: 'CARD';
  title?: string;
  description?: string;
  footer?: string | null;
  children?: GenUIComponent[];
};

type InfoGroupComponent = {
  component: 'INFO_GROUP';
  items?: Array<{
    key?: { helpText?: string; children: string };
    value?: { helpText?: string; children: string | GenUIComponent };
  }>;
};

type ButtonComponent = {
  component: 'BUTTON';
  text?: string;
  action?: GenUIAction;
};

type LinkComponent = {
  component: 'LINK';
  text?: string;
  action?: {
    type: 'CLICK';
    eventName?: 'link_click';
    data?: { url?: string };
  };
};

type AlertComponent = {
  component: 'ALERT';
  title?: string;
  description?: string;
  color?: 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
  actions?: {
    primary?: { text?: string; action?: GenUIAction };
    secondary?: { text?: string; action?: GenUIAction };
  };
};

type AmountComponent = {
  component: 'AMOUNT';
  value?: number;
  currency?: string;
};

type GenUIComponent =
  | TextComponent
  | ChartComponent
  | TableComponent
  | BadgeComponent
  | SpacerComponent
  | DividerComponent
  | StackComponent
  | GridComponent
  | CardComponent
  | InfoGroupComponent
  | ButtonComponent
  | LinkComponent
  | AlertComponent
  | AmountComponent
  | GenUIBaseComponent;
```

## Usage Guidelines

**Do**

- Keep the AI response schema restricted to the smallest set of components needed for the task.
- Set `isAnimating` while streamed markdown is arriving to animate new `TEXT` content.
- Use `onActionClick` as the single boundary between rendered UI and application behavior.
- Make required custom-component properties optional when they arrive incrementally.
- Validate partial enums and filter incomplete collections before passing values to Blade components.

**Don't**

- Don't render `GenUISchemaRenderer` without `GenUIProvider`.
- Don't execute navigation or sensitive mutations directly from model-provided action data; validate
  actions in the application handler first.
- Don't assume each schema update is complete; render a skeleton or nothing until required data exists.
- Don't use custom HTML styling to recreate a built-in schema component; use the built-in renderer.
- Don't use GenUI on React Native until native support is implemented.

## Examples

### Streaming response with an action

This example renders markdown, a status badge, and a follow-up action. The application validates
the action before sending another prompt.

```tsx
import {
  GenUIProvider,
  GenUISchemaRenderer,
  type GenUIAction,
  type GenUIComponent,
} from '@razorpay/blade/components';

const responseComponents: GenUIComponent[] = [
  {
    component: 'TEXT',
    content: '## Settlement status\n\nYour latest settlement completed successfully.',
  },
  { component: 'BADGE', text: 'Settled', color: 'positive' },
  {
    component: 'BUTTON',
    text: 'Show settlement details',
    action: {
      type: 'CLICK',
      eventName: 'show_settlement_details',
      data: { message: 'Show the details for my latest settlement' },
    },
  },
];

const SettlementResponse = ({
  isStreaming,
  onFollowUp,
}: {
  isStreaming: boolean;
  onFollowUp: (message: string) => void;
}) => {
  const handleAction = (action: GenUIAction): void => {
    const message = action.type === 'CLICK' ? action.data?.message : undefined;
    if (typeof message === 'string') {
      onFollowUp(message);
    }
  };

  return (
    <GenUIProvider config={{ onActionClick: handleAction }}>
      <GenUISchemaRenderer
        components={responseComponents}
        isAnimating={isStreaming}
        animateOptions={{ duration: 300, sep: 'word' }}
      />
    </GenUIProvider>
  );
};
```

### Streaming-safe custom component

Register a product-specific component when the built-in schemas cannot express the required UI.
The renderer shows a skeleton until its minimum data is available.

```tsx
import {
  Amount,
  Card,
  CardBody,
  Skeleton,
  Text,
  GenUIProvider,
  GenUISchemaRenderer,
  type GenUIComponentRenderer,
  type GenUICustomComponent,
} from '@razorpay/blade/components';

type RevenueWidgetSchema = GenUICustomComponent<
  'REVENUE_WIDGET',
  {
    title?: string;
    value?: number;
  }
>;

const RevenueWidget = ({ title, value }: RevenueWidgetSchema) => {
  if (!title || value === undefined) {
    return <Skeleton width="100%" height="96px" />;
  }

  return (
    <Card width="100%">
      <CardBody>
        <Text size="small" color="surface.text.gray.muted">
          {title}
        </Text>
        <Amount value={value} currency="INR" />
      </CardBody>
    </Card>
  );
};

const revenueComponent: RevenueWidgetSchema = {
  component: 'REVENUE_WIDGET',
  title: 'Revenue this month',
  value: 125000,
};

const RevenueResponse = () => (
  <GenUIProvider
    config={{
      components: {
        REVENUE_WIDGET: { renderer: RevenueWidget as GenUIComponentRenderer },
      },
    }}
  >
    <GenUISchemaRenderer components={[revenueComponent]} />
  </GenUIProvider>
);
```
