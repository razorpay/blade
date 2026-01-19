/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Streamdown } from 'streamdown';
import dayjs from 'dayjs';
import { formatNumber } from '@razorpay/i18nify-js';
import type { GenUIAction, GenUIBaseComponent, GenUIComponentRegistry } from './types';
import { useGenUIAction } from './GenUIContext';
import { ComponentRenderer } from './GenUISchemaRenderer';
import { Box } from '~components/Box';
import { Text, Heading } from '~components/Typography';
import { Skeleton } from '~components/Skeleton';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardFooter,
  CardFooterLeading,
} from '~components/Card';
import { Badge } from '~components/Badge';
import { Divider } from '~components/Divider';
import {
  ChartBar,
  ChartBarWrapper,
  ChartLine,
  ChartLineWrapper,
  ChartDonut,
  ChartDonutWrapper,
  ChartArea,
  ChartAreaWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '~components/Charts';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '~components/Table';
import { Link } from '~components/Link';
import {
  DotIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  TrashIcon,
  DownloadIcon,
  EyeIcon,
  CopyIcon,
} from '~components/Icons';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '~components/InfoGroup';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Amount } from '~components/Amount';
import { Indicator } from '~components/Indicator';
import { Alert } from '~components/Alert';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

/**
 * Built-in component types supported by GenUI
 */
const ComponentType = {
  TEXT: 'TEXT',
  CHART: 'CHART',
  TABLE: 'TABLE',
  CARD: 'CARD',
  BADGE: 'BADGE',
  SPACER: 'SPACER',
  DIVIDER: 'DIVIDER',
  STACK: 'STACK',
  GRID: 'GRID',
  INFO_GROUP: 'INFO_GROUP',
  BUTTON: 'BUTTON',
  LINK: 'LINK',
  ALERT: 'ALERT',
} as const;

type TextComponent = GenUIBaseComponent & {
  component: typeof ComponentType.TEXT;
  content?: string;
};

type ChartComponent = GenUIBaseComponent & {
  component: typeof ComponentType.CHART;
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

// Table cell component types (using component pattern)
type TableCellText = {
  component: 'TEXT';
  value: string;
  copyable?: boolean;
};

type TableCellAmount = {
  component: 'AMOUNT';
  value: number;
  currency?: string;
};

type TableCellIndicator = {
  component: 'INDICATOR';
  value: string;
  color: 'positive' | 'negative' | 'notice' | 'neutral' | 'primary' | 'information';
};

type TableCellBadge = {
  component: 'BADGE';
  value: string;
  color: 'positive' | 'negative' | 'notice' | 'neutral' | 'primary' | 'information';
};

type TableCellDate = {
  component: 'DATE';
  value: string;
  dateFormat?: string;
};

type TableCellLink = {
  component: 'LINK';
  text: string;
  action?: {
    type: 'CLICK';
    eventName?: 'link_click';
    data?: {
      url?: string;
    };
  };
};

type TableCellType =
  | TableCellText
  | TableCellAmount
  | TableCellIndicator
  | TableCellBadge
  | TableCellDate
  | TableCellLink;

// Table row action schema type
type TableRowActionSchema = {
  type: 'TABLE_ROW_ACTION';
  eventName: string;
};

type TableRowActionButton = {
  type: 'BUTTON';
  text: string;
  action: TableRowActionSchema;
};

type TableRowActionIconButton = {
  type: 'ICON_BUTTON';
  icon: 'check' | 'close' | 'edit' | 'delete' | 'download' | 'view' | 'copy';
  accessibilityLabel: string;
  action: TableRowActionSchema;
};

type TableRowAction = TableRowActionButton | TableRowActionIconButton;

// Event payload dispatched when table row actions are triggered
type TableRowActionEvent = {
  type: 'TABLE_ROW_ACTION';
  eventName: string;
  data: {
    rowIndex: number;
    rowData: TableCellType[];
  };
};

type TableComponent = GenUIBaseComponent & {
  component: typeof ComponentType.TABLE;
  headers?: string[];
  rows?: TableCellType[][];
  rowActions?: TableRowAction[];
};

type BadgeComponent = GenUIBaseComponent & {
  component: typeof ComponentType.BADGE;
  text?: string;
  color?: 'neutral' | 'negative' | 'notice' | 'positive' | 'primary' | 'information';
};

type SpacerComponent = GenUIBaseComponent & {
  component: typeof ComponentType.SPACER;
  size?: 'small' | 'medium' | 'large';
};

type DividerComponent = GenUIBaseComponent & {
  component: typeof ComponentType.DIVIDER;
  orientation?: 'horizontal' | 'vertical';
};

type StackComponent = GenUIBaseComponent & {
  component: typeof ComponentType.STACK;
  direction?: 'vertical' | 'horizontal';
  gap?: 'small' | 'medium' | 'large';
  children?: GenUIComponent[];
};

type GridComponent = GenUIBaseComponent & {
  component: typeof ComponentType.GRID;
  columns?: number;
  gap?: 'small' | 'medium' | 'large';
  children?: GenUIComponent[];
};

type CardComponent = GenUIBaseComponent & {
  component: typeof ComponentType.CARD;
  title?: string;
  description?: string;
  footer?: string | null;
  children?: GenUIComponent[];
};

type InfoGroupComponent = GenUIBaseComponent & {
  component: typeof ComponentType.INFO_GROUP;
  items?: Array<{
    key?: {
      helpText?: string;
      children: string;
    };
    value?: {
      helpText?: string;
      children: string;
    };
  }>;
};

type ButtonComponent = GenUIBaseComponent & {
  component: typeof ComponentType.BUTTON;
  text?: string;
  action?: GenUIAction;
};

type LinkComponent = GenUIBaseComponent & {
  component: typeof ComponentType.LINK;
  text?: string;
  action?: {
    type: 'CLICK';
    eventName?: 'link_click';
    data?: {
      url?: string;
    };
  };
};

type AlertComponent = GenUIBaseComponent & {
  component: typeof ComponentType.ALERT;
  title?: string;
  description?: string;
  color?: 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
  actions?: {
    primary?: {
      text?: string;
      action?: GenUIAction;
    };
    secondary?: {
      text?: string;
      action?: GenUIAction;
    };
  };
};

/**
 * Union type of all built-in UI components
 */
type GenUIBuiltInUIComponent =
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
  | AlertComponent;

/**
 * Generic UI component type - can be extended with custom components
 */
type GenUIComponent = GenUIBuiltInUIComponent | GenUIBaseComponent;

const ComponentErrorFallback = () => {
  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      <Text size="medium" weight="semibold">
        Error rendering component
      </Text>
    </Box>
  );
};

const ChartSkeletonLoader = ({
  title,
  isTiny,
  chartHeight = '350px',
}: {
  title?: string;
  isTiny?: boolean;
  chartHeight?: string;
}) => {
  return (
    <Box width="100%" display="flex" flexDirection="column" gap="spacing.3" marginY="spacing.3">
      {title && !isTiny ? (
        <Skeleton width="200px" height="24px" borderRadius="medium" marginBottom="spacing.3" />
      ) : null}
      <Box
        width="100%"
        height={chartHeight as '100px' | '350px'}
        display="flex"
        flexDirection="column"
        gap="spacing.3"
      >
        <Box display="flex" flexDirection="row" gap="spacing.3" height="100%">
          <Skeleton width="40px" height="100%" borderRadius="medium" />
          <Skeleton width="100%" height="100%" borderRadius="medium" />
        </Box>
        <Skeleton width="100%" height="40px" borderRadius="medium" />
      </Box>
    </Box>
  );
};

const RenderTextComponent = memo(({ content }: TextComponent) => {
  if (!content) return null;
  return (
    <Streamdown
      controls={{ table: false, code: false, mermaid: false }}
      rehypePlugins={[]}
      components={{
        h1: ({ children }) => (
          <Heading marginBottom="spacing.4" size="large">
            {children}
          </Heading>
        ),
        h2: ({ children }) => (
          <Heading marginBottom="spacing.3" size="medium">
            {children}
          </Heading>
        ),
        h3: ({ children }) => (
          <Heading marginBottom="spacing.3" size="small">
            {children}
          </Heading>
        ),
        b: ({ children }) => (
          <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
            {children}
          </Text>
        ),
        a: ({ href, children }) => (
          <Link
            href={href}
            size="medium"
            variant="anchor"
            color="primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children?.toString() ?? ''}
          </Link>
        ),
        li: ({ children }) => (
          <Text marginY="spacing.3" size="medium">
            <DotIcon marginBottom="1px" size="xsmall" /> {children}
          </Text>
        ),
        ol: ({ children }) => (
          <Box display="flex" flexDirection="column" marginLeft="spacing.4">
            {children}
          </Box>
        ),
        ul: ({ children }) => (
          <Box display="flex" flexDirection="column" marginLeft="spacing.4">
            {children}
          </Box>
        ),
        hr: () => <Divider marginY="spacing.4" />,
        i: ({ children }) => (
          <Text size="medium" variant="caption" color="surface.text.gray.subtle">
            {children}
          </Text>
        ),
        p: ({ children }) => (
          <Text marginY="spacing.2" size="medium" color="surface.text.gray.subtle">
            {children}
          </Text>
        ),
      }}
    >
      {content}
    </Streamdown>
  );
});

const RenderChartComponent = memo(
  ({
    chartType,
    title,
    xAxis,
    data,
    unit = '',
    variant = 'full',
    valueFormatter,
  }: ChartComponent) => {
    const isTiny = variant === 'tiny';
    const chartHeight = isTiny ? '100px' : '350px';
    const minHeight = isTiny ? '100px' : '350px';
    const isLoading =
      !chartType || !xAxis || !data || data.length === 0 || !valueFormatter || !valueFormatter.type;

    // Handle incomplete data during streaming
    if (isLoading) {
      return <ChartSkeletonLoader title={title} isTiny={isTiny} chartHeight={chartHeight} />;
    }

    // Filter out empty objects and incomplete data from streaming
    const validData = data.filter((item) => {
      if (!item || Object.keys(item).length === 0) return false;

      // Check if xAxis key exists and has a valid value
      if (!item[xAxis] || item[xAxis] === '') return false;

      // Check if at least one numeric value exists
      const hasNumericValue = Object.keys(item).some(
        (key) => key !== xAxis && typeof item[key] === 'number' && !isNaN(Number(item[key])),
      );

      return hasNumericValue;
    });

    if (validData.length === 0) {
      return <ChartSkeletonLoader title={title} isTiny={isTiny} chartHeight={chartHeight} />;
    }

    // Auto-detect all numeric keys except xAxis for plotting
    const firstItem = validData[0];
    const keysToPlot = Object.keys(firstItem).filter(
      (key) => key !== xAxis && typeof firstItem[key] === 'number',
    );

    if (keysToPlot.length === 0) {
      return <ChartSkeletonLoader title={title} isTiny={isTiny} chartHeight={chartHeight} />;
    }

    const tickFormatter = (value: number | string) => {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      if (isNaN(numValue)) {
        return value.toString();
      }

      // Use valueFormatter if provided, otherwise fall back to unit
      if (valueFormatter) {
        const { type, currency: formatterCurrency, suffix: formatterSuffix } = valueFormatter;

        const buildPrefixSuffixString = (v: string) => {
          return `${v}${formatterSuffix ?? ''}`;
        };

        try {
          switch (type) {
            case 'currency': {
              const formatted = formatNumber(numValue, {
                currency: (formatterCurrency || 'INR') as 'INR',
                intlOptions: {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                },
              });
              return buildPrefixSuffixString(formatted);
            }

            case 'percentage': {
              const formatted = formatNumber(numValue / 100, {
                intlOptions: {
                  style: 'percent',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                },
              });
              if (formatterSuffix === '%') {
                return formatted;
              } else {
                return buildPrefixSuffixString(formatted);
              }
            }

            case 'number': {
              const numberFormatted = formatNumber(numValue, {
                intlOptions: {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                },
              });
              return buildPrefixSuffixString(numberFormatted);
            }

            case 'string': {
              return buildPrefixSuffixString(numValue.toString());
            }

            default:
              return numValue.toString();
          }
        } catch (error) {
          console.error('Error formatting value:', error);
          return numValue.toString();
        }
      }

      // Fallback to legacy unit formatting
      return `${numValue.toString()}${unit}`;
    };

    // TODO: Refactor into smaller components
    return (
      <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          gap="spacing.3"
          marginY="spacing.3"
          minHeight={chartHeight}
        >
          {title && !isTiny ? (
            <Text
              size="large"
              weight="semibold"
              color="surface.text.gray.subtle"
              marginBottom="spacing.3"
            >
              {title}
            </Text>
          ) : null}
          <Box width="100%" height={chartHeight} minHeight={minHeight}>
            {chartType === 'bar' ? (
              <ChartBarWrapper
                width="100%"
                height={chartHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {!isTiny ? <ChartXAxis dataKey={xAxis} /> : null}
                {!isTiny ? <ChartYAxis tickFormatter={tickFormatter} /> : null}
                {keysToPlot.map((key) => (
                  <ChartBar key={key} dataKey={key} name={key} />
                ))}
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartBarWrapper>
            ) : chartType === 'line' ? (
              <ChartLineWrapper
                width="100%"
                height={chartHeight}
                minHeight={minHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {!isTiny ? <ChartXAxis dataKey={xAxis} /> : null}
                {!isTiny ? <ChartYAxis tickFormatter={tickFormatter} /> : null}
                {keysToPlot.map((key) => (
                  <ChartLine key={key} dataKey={key} name={key} />
                ))}
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartLineWrapper>
            ) : chartType === 'area' ? (
              <ChartAreaWrapper
                width="100%"
                height={chartHeight}
                minHeight={minHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {!isTiny ? <ChartXAxis dataKey={xAxis} /> : null}
                {!isTiny ? <ChartYAxis tickFormatter={tickFormatter} /> : null}
                {keysToPlot.map((key) => (
                  <ChartArea key={key} dataKey={key} name={key} type="monotone" />
                ))}
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartAreaWrapper>
            ) : chartType === 'pie' ? (
              <ChartDonutWrapper width="100%" height={chartHeight} minHeight={minHeight}>
                <ChartDonut
                  dataKey={keysToPlot[0]}
                  nameKey={xAxis}
                  data={validData.map((d) => {
                    return {
                      name: d[xAxis],
                      value: d[keysToPlot[0]],
                    };
                  })}
                  radius="medium"
                  type="circle"
                />
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartDonutWrapper>
            ) : null}
          </Box>
        </Box>
      </ErrorBoundary>
    );
  },
  // Custom comparison - only re-render if data length or key fields change
  (prevProps, nextProps) => {
    return (
      prevProps.chartType === nextProps.chartType &&
      prevProps.title === nextProps.title &&
      prevProps.xAxis === nextProps.xAxis &&
      prevProps.variant === nextProps.variant &&
      prevProps.data?.length === nextProps.data?.length &&
      JSON.stringify(prevProps.data?.[prevProps.data.length - 1]) ===
        JSON.stringify(nextProps.data?.[nextProps.data.length - 1]) &&
      JSON.stringify(prevProps.valueFormatter) === JSON.stringify(nextProps.valueFormatter)
    );
  },
);

// Table cell link renderer - fires action for consumer to handle
const TableCellLinkRenderer = ({ cell }: { cell: TableCellLink }) => {
  const onActionClick = useGenUIAction();

  if (!cell.action) {
    return <Text size="medium">{cell.text}</Text>;
  }

  return (
    <Link
      variant="button"
      onClick={() => {
        if (onActionClick && cell.action) {
          onActionClick(cell.action);
        }
      }}
    >
      {cell.text}
    </Link>
  );
};

// Copyable text component with tooltip feedback
const CopyableText = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      void navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap="spacing.2">
      <Text size="medium">{value ?? '-'}</Text>
      <Tooltip content={copied ? 'Copied!' : 'Copy'} placement="top">
        <TooltipInteractiveWrapper>
          <IconButton
            icon={CopyIcon}
            size="medium"
            emphasis="intense"
            accessibilityLabel={`Copy ${value}`}
            onClick={handleCopy}
          />
        </TooltipInteractiveWrapper>
      </Tooltip>
    </Box>
  );
};

// Helper to render a single table cell based on its component type
const RenderTableCellContent = ({ cell }: { cell: TableCellType }) => {
  if (!cell) {
    return <Text size="medium">-</Text>;
  }

  // Handle incomplete cell object during streaming
  if (!cell.component) {
    return <Text size="medium">-</Text>;
  }

  // Handle component-based cell types
  switch (cell.component) {
    case 'TEXT': {
      if (cell.copyable && cell.value) {
        return <CopyableText value={cell.value} />;
      }
      return <Text size="medium">{cell.value ?? '-'}</Text>;
    }

    case 'AMOUNT': {
      const currency = cell.currency || 'INR';
      // Ensure value is a valid number (handle streaming where value might be string/undefined)
      const numValue = typeof cell.value === 'string' ? parseFloat(cell.value) : cell.value;
      if (typeof numValue !== 'number' || isNaN(numValue)) {
        return <Text size="medium">-</Text>;
      }
      return <Amount value={numValue} currency={currency as 'INR' | 'MYR'} size="medium" />;
    }

    case 'INDICATOR': {
      // Handle streaming where value might be incomplete
      if (!cell.value) {
        return <Text size="medium">-</Text>;
      }
      return (
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Indicator accessibilityLabel={cell.value} color={cell.color || 'neutral'} />
          <Text size="medium">{cell.value}</Text>
        </Box>
      );
    }

    case 'BADGE': {
      return (
        <Badge color={cell.color || 'neutral'} emphasis="subtle">
          {cell.value || '-'}
        </Badge>
      );
    }

    case 'DATE': {
      // Handle streaming where value might be incomplete
      if (!cell.value) {
        return <Text size="medium">-</Text>;
      }

      // Parse the date value using dayjs
      const dateValue = dayjs(cell.value);

      // Check if date is valid
      if (!dateValue.isValid()) {
        return <Text size="medium">{cell.value}</Text>;
      }

      // Use custom dateFormat if provided, otherwise use default
      // Format tokens: https://day.js.org/docs/en/display/format
      const defaultFormat = 'DD MMM YYYY, HH:mm';
      const formatted = dateValue.format(cell.dateFormat || defaultFormat);

      return <Text size="medium">{formatted}</Text>;
    }

    case 'LINK': {
      // Handle streaming where text might be incomplete
      if (!cell.text) {
        return <Text size="medium">-</Text>;
      }

      return <TableCellLinkRenderer cell={cell} />;
    }

    default:
      // Handle unknown component types during streaming
      return <Text size="medium">{String((cell as { value?: string }).value || '-')}</Text>;
  }
};

// Icon mapping for row actions
const rowActionIconMap = {
  check: CheckIcon,
  close: CloseIcon,
  edit: EditIcon,
  delete: TrashIcon,
  download: DownloadIcon,
  view: EyeIcon,
  copy: CopyIcon,
} as const;

// Separate component for table row hover actions to avoid render issues
const TableRowHoverActions = ({
  rowActions,
  rowIndex,
  rowData,
}: {
  rowActions: TableRowAction[];
  rowIndex: number;
  rowData: TableCellType[];
}) => {
  const onActionClick = useGenUIAction();

  const createActionEvent = (eventName: string): TableRowActionEvent => ({
    type: 'TABLE_ROW_ACTION',
    eventName,
    data: {
      rowIndex,
      rowData,
    },
  });

  return (
    <>
      {rowActions.map((rowAction, index) => {
        // Guard: Skip incomplete button actions during streaming
        if (rowAction.type === 'BUTTON') {
          if (!rowAction.text) return null;
          return (
            <Button
              key={index}
              variant="tertiary"
              size="xsmall"
              onClick={() => {
                if (rowAction.action?.eventName && onActionClick) {
                  onActionClick(createActionEvent(rowAction.action.eventName));
                }
              }}
            >
              {rowAction.text}
            </Button>
          );
        }

        // Guard: Skip incomplete icon button actions during streaming
        if (rowAction.type === 'ICON_BUTTON') {
          const IconComponent = rowAction.icon ? rowActionIconMap[rowAction.icon] : null;
          if (!IconComponent || !rowAction.accessibilityLabel) return null;
          return (
            <IconButton
              key={index}
              icon={IconComponent}
              size="medium"
              emphasis="intense"
              accessibilityLabel={rowAction.accessibilityLabel}
              onClick={() => {
                if (rowAction.action?.eventName && onActionClick) {
                  onActionClick(createActionEvent(rowAction.action.eventName));
                }
              }}
            />
          );
        }

        return null;
      })}
    </>
  );
};

const RenderTableComponent = memo(({ headers, rows, rowActions }: TableComponent) => {
  if (!headers || !rows || headers.length === 0 || rows.length === 0) {
    return null;
  }

  // Transform rows into table data format with id
  const tableData = {
    nodes: rows.map((row, index) => ({
      id: `row-${index}`,
      cells: row,
    })),
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.3"
      marginY="spacing.4"
      borderRadius="medium"
    >
      <Table data={tableData} backgroundColor="transparent" rowDensity="normal">
        {(data) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {headers.map((header, index) => (
                  <TableHeaderCell key={index}>{header}</TableHeaderCell>
                ))}
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  item={item}
                  hoverActions={
                    rowActions && rowActions.length > 0 ? (
                      <TableRowHoverActions
                        rowActions={rowActions}
                        rowIndex={rowIndex}
                        rowData={item.cells}
                      />
                    ) : undefined
                  }
                >
                  {item.cells.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <RenderTableCellContent cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
});

const RenderCardComponent = memo(({ title, description, footer, children }: CardComponent) => {
  if (!title && !description) {
    return null;
  }

  return (
    <Card
      width="100%"
      height="100%"
      marginY="spacing.4"
      elevation="none"
      padding="spacing.7"
      borderRadius="large"
    >
      <CardHeader showDivider={false}>
        <CardHeaderLeading title={title || ''} subtitle={description || ''} />
      </CardHeader>

      {children && children.length > 0 ? (
        <CardBody height="100%">
          <Box display="flex" flexDirection="column" gap="spacing.5">
            {children.map((child, index) => {
              return <GenUIComponentRenderer key={index} component={child} index={index} />;
            })}
          </Box>
        </CardBody>
      ) : null}

      {footer ? (
        <CardFooter showDivider={true}>
          <CardFooterLeading subtitle={footer} />
        </CardFooter>
      ) : null}
    </Card>
  );
});

const RenderBadgeComponent = memo(({ text, color }: BadgeComponent) => {
  if (!text) return null;

  return (
    <Badge color={color || 'neutral'} emphasis="subtle">
      {text}
    </Badge>
  );
});

const RenderSpacerComponent = memo(({ size }: SpacerComponent) => {
  if (!size) return null;

  const sizeMap = {
    small: 'spacing.2',
    medium: 'spacing.4',
    large: 'spacing.5',
  } as const;

  return <Box height={sizeMap[size]} width={sizeMap[size]} />;
});

const RenderDividerComponent = memo(({ orientation = 'horizontal' }: DividerComponent) => {
  return (
    <Box display="flex" paddingY="spacing.4">
      <Divider
        orientation={orientation}
        {...(orientation === 'vertical' ? { height: '24px' } : {})}
      />
    </Box>
  );
});

const RenderStackComponent = memo(({ direction = 'vertical', gap, children }: StackComponent) => {
  if (!children || children.length === 0) {
    return null;
  }

  const sizeMap = {
    small: 'spacing.2',
    medium: 'spacing.4',
    large: 'spacing.5',
  } as const;

  return (
    <Box
      display="flex"
      width="100%"
      paddingY="spacing.3"
      flexDirection={direction === 'vertical' ? 'column' : 'row'}
      gap={sizeMap[gap ?? 'small']}
    >
      {children.map((child, index) => (
        <GenUIComponentRenderer key={index} component={child} index={index} />
      ))}
    </Box>
  );
});

const RenderGridComponent = memo(({ columns, gap, children }: GridComponent) => {
  if (!columns || !children || children.length === 0) {
    return null;
  }

  const sizeMap = {
    small: 'spacing.2',
    medium: 'spacing.4',
    large: 'spacing.5',
  } as const;

  return (
    <Box
      display="grid"
      width="100%"
      marginY="spacing.3"
      gridTemplateColumns={`repeat(${columns}, 1fr)`}
      gap={sizeMap[gap ?? 'small']}
    >
      {children.map((child, index) => (
        <GenUIComponentRenderer key={index} component={child} index={index} />
      ))}
    </Box>
  );
});

const RenderInfoGroupComponent = memo(({ items }: InfoGroupComponent) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Filter out invalid items during streaming
  const validItems = items.filter((item) => item.key?.children && item.value?.children);

  if (validItems.length === 0) {
    return null;
  }

  return (
    <InfoGroup marginY="spacing.3" itemOrientation="horizontal" size="medium" valueAlign="left">
      {validItems.map((item, index) => (
        <InfoItem key={index}>
          <InfoItemKey helpText={item?.key?.helpText}>{item?.key?.children}</InfoItemKey>
          <InfoItemValue helpText={item?.value?.helpText}>{item?.value?.children}</InfoItemValue>
        </InfoItem>
      ))}
    </InfoGroup>
  );
});

const RenderButtonComponent = memo(({ text, action }: ButtonComponent) => {
  const onActionClick = useGenUIAction();

  if (!text) return null;

  const handleClick = () => {
    if (action && onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <Button marginTop="spacing.2" variant="tertiary" onClick={handleClick}>
      {text}
    </Button>
  );
});

const RenderLinkComponent = memo(({ text, action }: LinkComponent) => {
  const onActionClick = useGenUIAction();

  if (!text) return null;

  if (!action) {
    return (
      <Box marginBottom="spacing.2">
        <Text size="medium">{text}</Text>
      </Box>
    );
  }

  return (
    <Box marginBottom="spacing.2">
      <Link
        variant="button"
        onClick={() => {
          if (onActionClick) {
            onActionClick(action);
          }
        }}
      >
        {text}
      </Link>
    </Box>
  );
});

const RenderAlertComponent = memo(
  ({ title, description, color = 'neutral', actions }: AlertComponent) => {
    const onActionClick = useGenUIAction();
    const validColors = ['information', 'negative', 'neutral', 'notice', 'positive'];
    if (!title && !description) return null;
    if (!validColors.includes(color)) {
      return <Box marginY="spacing.3" width="100%" />;
    }

    const iconMap = {
      information: InfoIcon,
      negative: AlertTriangleIcon,
      neutral: InfoIcon,
      notice: InfoIcon,
      positive: CheckCircleIcon,
    } as const;

    const Icon = iconMap[color];

    return (
      <Box marginY="spacing.3" width="100%">
        <Alert
          emphasis="subtle"
          title={title}
          icon={Icon}
          description={description!}
          color={color}
          isDismissible={false}
          isFullWidth
          actions={{
            primary: actions?.primary?.text
              ? {
                  text: actions?.primary?.text,
                  onClick: () => {
                    if (actions?.primary?.action && onActionClick) {
                      onActionClick(actions.primary.action);
                    }
                  },
                }
              : undefined,
            secondary: actions?.secondary?.text
              ? {
                  text: actions?.secondary?.text,
                  onClick: () => {
                    if (actions?.secondary?.action && onActionClick) {
                      onActionClick(actions.secondary.action);
                    }
                  },
                }
              : undefined,
          }}
        />
      </Box>
    );
  },
);

// Alias for internal use in built-in renderers
const GenUIComponentRenderer = ComponentRenderer;
type GenUIComponentRenderer = React.ComponentType<GenUIBaseComponent & { index: number }>;

/**
 * Default registry of built-in components
 */
const createBuiltInRegistry = (): GenUIComponentRegistry => ({
  [ComponentType.TEXT]: {
    renderer: RenderTextComponent as GenUIComponentRenderer,
  },
  [ComponentType.CHART]: {
    renderer: RenderChartComponent as GenUIComponentRenderer,
  },
  [ComponentType.TABLE]: {
    renderer: RenderTableComponent as GenUIComponentRenderer,
  },
  [ComponentType.CARD]: {
    renderer: RenderCardComponent as GenUIComponentRenderer,
  },
  [ComponentType.BADGE]: {
    renderer: RenderBadgeComponent as GenUIComponentRenderer,
  },
  [ComponentType.SPACER]: {
    renderer: RenderSpacerComponent as GenUIComponentRenderer,
  },
  [ComponentType.DIVIDER]: {
    renderer: RenderDividerComponent as GenUIComponentRenderer,
  },
  [ComponentType.STACK]: {
    renderer: RenderStackComponent as GenUIComponentRenderer,
  },
  [ComponentType.GRID]: {
    renderer: RenderGridComponent as GenUIComponentRenderer,
  },
  [ComponentType.INFO_GROUP]: {
    renderer: RenderInfoGroupComponent as GenUIComponentRenderer,
  },
  [ComponentType.BUTTON]: {
    renderer: RenderButtonComponent as GenUIComponentRenderer,
  },
  [ComponentType.LINK]: {
    renderer: RenderLinkComponent as GenUIComponentRenderer,
  },
  [ComponentType.ALERT]: {
    renderer: RenderAlertComponent as GenUIComponentRenderer,
  },
});

export {
  // Built-in registry creator (used by GenUIProvider)
  createBuiltInRegistry,
  // Constants
  ComponentType,
};

export type { GenUIComponent };
