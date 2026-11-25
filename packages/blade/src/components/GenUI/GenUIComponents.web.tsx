/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import dayjs from 'dayjs';
import { formatNumber } from '@razorpay/i18nify-js';
import ReactMarkdown from 'react-markdown';
import styled, { createGlobalStyle } from 'styled-components';
import type { GenUIAction, GenUIBaseComponent, GenUIComponentRegistry } from './types';
import { useGenUIAction, useGenUIAnimation, useGenUIChartVersion } from './GenUIContext';
import { ComponentRenderer } from './GenUISchemaRenderer';
import { createRehypeAnimate } from './rehypeAnimate';
import { genUISpacingContract, getGenUIComponentTopSpacing } from './GenUISpacing';
import {
  TINY_CHART_HEIGHT,
  formatChartValue,
  formatDateTick,
  formatINRCompact,
  formatShare,
  getBarListRows,
  getChartHeight,
  getDateStep,
  getDonutHeight,
  getDonutRadius,
  getLastLabelOverhang,
  getXLabelStep,
  isDateAxis,
  isWholeNumberChart,
  resolveShowBorder,
  resolveYLabelPlacement,
  shouldShowBarList,
} from './genUIChartUtils';
import type { ChartValueFormatter } from './genUIChartUtils';
import { Box } from '~components/Box';
import type { BoxRefType } from '~components/Box/BaseBox/types';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { Heading, Text } from '~components/Typography';
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
 * Global styles for text streaming animations
 * Applied to [data-animate-word] spans created by rehypeAnimate
 */
const TextAnimationStyles = createGlobalStyle`
  @keyframes animate-fadeIn {
    from {
      opacity: 0;
      color: #48D08C;
      filter: blur(2px);
    }
    to {
      opacity: 1;
      color: inherit;
      filter: blur(0px);
    }
  }

  [data-animate-word] {
    display: inline-block;
    animation: animate-fadeIn
      var(--animate-duration, 400ms)
      var(--animate-easing, ease) both;
  }
`;

const MarkdownUnorderedList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spacing[3] + theme.spacing[1]}px;
  list-style: none;
  margin: 0 0 ${({ theme }) => theme.spacing[2]}px 0;
  padding: 0;
`;

const MarkdownOrderedList = styled.ol`
  display: flex;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spacing[3] + theme.spacing[1]}px;
  counter-reset: markdown-ordered-list;
  list-style: none;
  margin: 0 0 ${({ theme }) => theme.spacing[2]}px 0;
  padding: 0;
`;

const MarkdownHeadingContainer = styled.div<{ $level: 1 | 2 | 3 | 4 | 5 | 6 }>`
  ${({ theme, $level }) => {
    const spacing = {
      1: { marginTop: 0, marginBottom: theme.spacing[4] },
      2: { marginTop: theme.spacing[7], marginBottom: theme.spacing[3] },
      3: { marginTop: theme.spacing[7], marginBottom: theme.spacing[3] },
      4: { marginTop: theme.spacing[7], marginBottom: theme.spacing[2] },
      5: { marginTop: theme.spacing[5], marginBottom: theme.spacing[2] },
      6: { marginTop: theme.spacing[5], marginBottom: theme.spacing[2] },
    }[$level];

    return `
      margin: ${spacing.marginTop}px 0 ${spacing.marginBottom}px;
    `;
  }}

  & + & {
    margin-top: 0;
  }

  ${({ theme, $level }) =>
    $level === 6
      ? `
        > h6 {
          font-family: ${theme.typography.fonts.family.text};
          font-size: ${theme.typography.fonts.size[100]}px;
          line-height: ${theme.typography.lineHeights[300]}px;
          letter-spacing: 0.03em;
        }
      `
      : ''}
`;

const MarkdownListItem = styled.li<{ $ordered: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme, $ordered }) => theme.spacing[$ordered ? 3 : 4]}px;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.surface.text.gray.subtle};
  font-family: ${({ theme }) => theme.typography.fonts.family.text};
  font-size: ${({ theme }) => theme.typography.fonts.size[100]}px;
  line-height: ${({ theme }) => theme.typography.lineHeights[100]}px;
  list-style: none;

  ${({ $ordered }) => ($ordered ? 'counter-increment: markdown-ordered-list;' : '')}

  > ul,
  > ol {
    margin-top: ${({ theme }) => theme.spacing[2]}px;
    margin-bottom: 0;
    row-gap: ${({ theme }) => theme.spacing[2]}px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const MarkdownListMarker = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.surface.text.gray.muted};
  height: ${({ theme }) => theme.typography.lineHeights[100]}px;
`;

const MarkdownUnorderedListMarker = styled(MarkdownListMarker)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: ${({ theme }) => theme.spacing[4]}px;
  min-width: ${({ theme }) => theme.spacing[4]}px;

  &::before {
    content: '';
    width: ${({ theme }) => theme.spacing[2]}px;
    height: ${({ theme }) => theme.spacing[2]}px;
    border-radius: ${({ theme }) => theme.border.radius.max}px;
    background: ${({ theme }) => theme.colors.surface.text.gray.subtle};
  }
`;

const MarkdownOrderedListMarker = styled(MarkdownListMarker)`
  display: inline-block;
  min-width: ${({ theme }) => theme.spacing[5]}px;
  text-align: right;

  &::before {
    content: counter(markdown-ordered-list) '.';
  }
`;

const MarkdownListItemBody = styled.span`
  flex: 1;
  min-width: 0;

  > ul,
  > ol {
    margin-top: ${({ theme }) => theme.spacing[2]}px;
    margin-bottom: 0;
    row-gap: ${({ theme }) => theme.spacing[2]}px;
  }
`;

const MarkdownListContext = React.createContext({ ordered: false });

const MarkdownInlineCode = styled.code`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  vertical-align: 1.5px;
  color: ${({ theme }) => theme.colors.interactive.text.information.normal};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[50]}px;
  font-style: normal;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights[50]}px;
  letter-spacing: 0;
  background: ${({ theme }) => theme.colors.surface.background.gray.intense};
  border-radius: ${({ theme }) => theme.border.radius.xsmall}px;
  box-shadow: inset 0 0 0 ${({ theme }) => theme.border.width.thin}px
    ${({ theme }) => theme.colors.surface.border.gray.subtle};
  margin: 0 ${({ theme }) => theme.spacing[1]}px;
  padding: ${({ theme }) => theme.spacing[1]}px ${({ theme }) => theme.spacing[2]}px;
`;

const MarkdownItalic = styled.span`
  color: ${({ theme }) => theme.colors.surface.text.gray.subtle};
  font-family: ${({ theme }) => theme.typography.fonts.family.text};
  font-size: ${({ theme }) => theme.typography.fonts.size[100]}px;
  font-style: italic;
  font-weight: inherit;
  line-height: ${({ theme }) => theme.typography.lineHeights[100]}px;
`;

const MarkdownBlockquote = styled.blockquote`
  border-left: ${({ theme }) => theme.border.width.thicker}px solid
    ${({ theme }) => theme.colors.surface.border.gray.normal};
  margin: 0 0 ${({ theme }) => theme.spacing[5]}px 0;
  padding: 0 0 0 ${({ theme }) => theme.spacing[5]}px;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.surface.text.gray.muted};
    font-style: italic;
  }
`;

const MarkdownCodeBlock = styled.pre`
  display: inline-block;
  max-width: 660px;
  width: fit-content;
  margin: ${({ theme }) => theme.spacing[1]}px 0 ${({ theme }) => theme.spacing[0]}px;
  overflow: hidden;
  padding: 0;
  background: ${({ theme }) => theme.colors.interactive.background.gray.faded};
  border: ${({ theme }) => theme.border.width.thin}px solid
    ${({ theme }) => theme.colors.feedback.border.neutral.subtle};
  border-radius: ${({ theme }) => theme.border.radius.medium}px;
`;

const MarkdownCodeBlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
  padding: ${({ theme }) => theme.spacing[3]}px ${({ theme }) => theme.spacing[4]}px;
  border-bottom: ${({ theme }) => theme.border.width.thin}px solid
    ${({ theme }) => theme.colors.surface.border.gray.muted};
`;

const MarkdownCodeBlockActions = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: auto;
`;

const MarkdownCodeBlockCopyAnimation = styled.span<{ $copied: boolean }>`
  display: inline-flex;
  align-items: center;
  animation: ${({ $copied }) =>
      $copied ? 'markdown-code-copy-success' : 'markdown-code-copy-reset'}
    180ms cubic-bezier(0.2, 0.8, 0.2, 1);

  @keyframes markdown-code-copy-success {
    0% {
      opacity: 0;
      transform: scale(0.72) rotate(-12deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes markdown-code-copy-reset {
    0% {
      opacity: 0;
      transform: scale(0.88);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const MarkdownCodeBlockLanguage = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.surface.text.gray.muted};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[50]}px;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacings[100]}px;
  line-height: ${({ theme }) => theme.typography.lineHeights[50]}px;
`;

const MarkdownCodeBlockCode = styled.code`
  display: block;
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing[4]}px;
  color: ${({ theme }) => theme.colors.surface.text.gray.normal};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[75]}px;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights[100]}px;
  white-space: pre;
  background: none;
  border: none;
`;

const MarkdownCodeBlockCopyButton = ({ code }: { code: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(String(code ?? ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MarkdownCodeBlockActions>
      <Tooltip content={copied ? 'Copied!' : 'Copy'} placement="top">
        <TooltipInteractiveWrapper>
          <MarkdownCodeBlockCopyAnimation key={copied ? 'copied' : 'copy'} $copied={copied}>
            <IconButton
              icon={copied ? CheckIcon : CopyIcon}
              size="small"
              emphasis="intense"
              accessibilityLabel="Copy code block"
              onClick={handleCopy}
            />
          </MarkdownCodeBlockCopyAnimation>
        </TooltipInteractiveWrapper>
      </Tooltip>
    </MarkdownCodeBlockActions>
  );
};

const getMarkdownCodeBlockDetails = (
  children?: React.ReactNode,
): { code: React.ReactNode; language?: string } => {
  const child = React.Children.toArray(children)[0];

  if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(child)) {
    const language = child.props.className?.replace(/^language-/, '');
    return { code: child.props.children, language };
  }

  return { code: children };
};

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
  AMOUNT: 'AMOUNT',
} as const;

/**
 * Valid feedback colors used across GenUI components (Badge, Indicator, Alert)
 * Used to validate streaming JSON where color values might be partial/incomplete
 */
const FeedbackColors = [
  'information',
  'negative',
  'neutral',
  'notice',
  'positive',
  'primary',
] as const;
type FeedbackColor = typeof FeedbackColors[number];

const getValidFeedbackColor = (
  color: string | undefined,
  fallback: FeedbackColor = 'neutral',
): FeedbackColor => {
  if (!color) return fallback;
  if (FeedbackColors.includes(color as FeedbackColor)) {
    return color as FeedbackColor;
  }
  return fallback;
};

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
  /**
   * Shows a border around the plot of a bar, line or area chart: a line on the left, the right
   * and the bottom. With a border, the Y labels sit in a column left of the plot.
   *
   * When it is not set: no border in a box of 640px or less, a border above.
   */
  showBorder?: boolean;
  /**
   * Where the Y labels sit with no border. `overlap`: inside the plot, just below each gridline.
   * `outside`: in a column right of the plot, centred on each gridline.
   *
   * When it is not set: `overlap`.
   */
  yLabelPlacement?: 'overlap' | 'outside';
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
  copyable?: boolean;
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

type InfoGroupItemValue = {
  helpText?: string;
  children: string | GenUIComponent;
};

type InfoGroupComponent = GenUIBaseComponent & {
  component: typeof ComponentType.INFO_GROUP;
  items?: Array<{
    key?: {
      helpText?: string;
      children: string;
    };
    value?: InfoGroupItemValue;
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

type AmountComponent = GenUIBaseComponent & {
  component: typeof ComponentType.AMOUNT;
  value?: number;
  currency?: string;
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
  | AlertComponent
  | AmountComponent;

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
      <Text size="medium" weight="regular">
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

const MarkdownListItemRenderer = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  const { ordered } = React.useContext(MarkdownListContext);
  return (
    <MarkdownListItem $ordered={ordered}>
      {ordered ? <MarkdownOrderedListMarker /> : <MarkdownUnorderedListMarker />}
      <MarkdownListItemBody>{children}</MarkdownListItemBody>
    </MarkdownListItem>
  );
};

const markdownHeadingStyles = {
  h1: { level: 1, size: 'large', color: 'surface.text.gray.normal', as: 'h1' },
  h2: { level: 2, size: 'medium', color: 'surface.text.gray.normal', as: 'h2' },
  h3: { level: 3, size: 'medium', color: 'surface.text.gray.subtle', as: 'h3' },
  h4: { level: 4, size: 'small', color: 'surface.text.gray.subtle', as: 'h4' },
  h5: { level: 5, size: 'small', color: 'surface.text.gray.muted', as: 'h5' },
  h6: { level: 6, size: 'small', color: 'surface.text.gray.muted', as: 'h6' },
} as const;

type MarkdownHeadingTag = keyof typeof markdownHeadingStyles;

const MarkdownHeadingRenderer = ({
  tag,
  children,
}: {
  tag: MarkdownHeadingTag;
  children?: React.ReactNode;
}): JSX.Element => {
  const { level, size, color, as } = markdownHeadingStyles[tag];

  return (
    <MarkdownHeadingContainer $level={level}>
      <Heading
        as={as}
        size={size}
        weight="medium"
        color={color}
        textTransform={level === 6 ? 'uppercase' : undefined}
      >
        {children}
      </Heading>
    </MarkdownHeadingContainer>
  );
};

/**
 * Stable components object for ReactMarkdown to prevent re-renders during streaming.
 * Defined outside the component to maintain referential equality.
 */
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h1">{children}</MarkdownHeadingRenderer>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h2">{children}</MarkdownHeadingRenderer>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h3">{children}</MarkdownHeadingRenderer>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h4">{children}</MarkdownHeadingRenderer>
  ),
  h5: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h5">{children}</MarkdownHeadingRenderer>
  ),
  h6: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h6">{children}</MarkdownHeadingRenderer>
  ),
  b: ({ children }: { children?: React.ReactNode }) => (
    <Text as="span" size="medium" weight="semibold" color="surface.text.gray.subtle">
      {children}
    </Text>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <Text as="span" size="medium" weight="semibold" color="surface.text.gray.subtle">
      {children}
    </Text>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <Link
      href={href}
      size="medium"
      variant="anchor"
      color="primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      {(children as unknown) as string}
    </Link>
  ),
  li: MarkdownListItemRenderer,
  ol: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownListContext.Provider value={{ ordered: true }}>
      <MarkdownOrderedList>{children}</MarkdownOrderedList>
    </MarkdownListContext.Provider>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownListContext.Provider value={{ ordered: false }}>
      <MarkdownUnorderedList>{children}</MarkdownUnorderedList>
    </MarkdownListContext.Provider>
  ),
  hr: () => <Divider marginY="spacing.7" />,
  code: ({
    inline,
    className,
    children,
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) =>
    inline || !className ? (
      <MarkdownInlineCode>{children}</MarkdownInlineCode>
    ) : (
      <code className={className}>{children}</code>
    ),
  pre: ({ children }: { children?: React.ReactNode }) => {
    const { code, language } = getMarkdownCodeBlockDetails(children);

    return (
      <MarkdownCodeBlock>
        <MarkdownCodeBlockHeader>
          {language ? <MarkdownCodeBlockLanguage>{language}</MarkdownCodeBlockLanguage> : null}
          <MarkdownCodeBlockCopyButton code={code} />
        </MarkdownCodeBlockHeader>
        <MarkdownCodeBlockCode>{code}</MarkdownCodeBlockCode>
      </MarkdownCodeBlock>
    );
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownBlockquote>{children}</MarkdownBlockquote>
  ),
  em: ({ children }: { children?: React.ReactNode }) => <MarkdownItalic>{children}</MarkdownItalic>,
  i: ({ children }: { children?: React.ReactNode }) => <MarkdownItalic>{children}</MarkdownItalic>,
  p: ({ children }: { children?: React.ReactNode }) => (
    <Text
      marginBottom={genUISpacingContract.textParagraphGap}
      size="medium"
      color="surface.text.gray.subtle"
    >
      {children}
    </Text>
  ),
};

const RenderTextComponent = memo(({ content }: TextComponent) => {
  const { isAnimating, animateOptions } = useGenUIAnimation();

  const rehypePlugins = useMemo(() => {
    if (!isAnimating) return [];
    return [createRehypeAnimate(animateOptions)];
  }, [isAnimating, animateOptions]);

  if (!content) return null;

  return (
    <>
      {isAnimating ? <TextAnimationStyles /> : null}
      <ReactMarkdown skipHtml rehypePlugins={rehypePlugins} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </>
  );
});

/**
 * The width of a chart's own box, from a ResizeObserver. 0 until measured (and in a test DOM
 * without layout), which keeps the chart at its size before this hook: 350px, every label.
 */
const useChartBoxWidth = (): [React.RefObject<BoxRefType>, number] => {
  const ref = useRef<BoxRefType>(null);
  const [width, setWidth] = useState(0);
  useIsomorphicLayoutEffect(() => {
    const element = (ref.current as unknown) as HTMLElement | null;
    if (!element) return undefined;
    const initial = element.getBoundingClientRect().width;
    if (initial > 0) setWidth(initial);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      if (next > 0) setWidth(Math.round(next));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
};

/** One muted line in place of the plot, for a finished CHART with no rows to draw. */
const GENUI_CHART_EMPTY_TEXT = 'No data to show';
/** The label of the first row of the bar list. */
const GENUI_CHART_TOTAL_LABEL = 'Total';

/**
 * The bar of a bar list row, in Blade's first chart colour, categorical blue: the Total bar
 * strong, each row bar subtle. Box takes no data colour, so this is a styled div.
 */
const ChartBarListFill = styled.div<{ $share: number; $isTotal: boolean }>(
  ({ theme, $share, $isTotal }) => ({
    width: `${$share}%`,
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: $isTotal
      ? theme.colors.data.background.categorical.blue.strong
      : theme.colors.data.background.categorical.blue.subtle,
  }),
);

const ChartBarListRow = ({
  label,
  value,
  share,
  isTotal = false,
}: {
  label: string;
  value: string;
  share: number;
  isTotal?: boolean;
}) => (
  <Box display="flex" flexDirection="column" gap="spacing.2">
    <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.5">
      <Text
        size="small"
        weight={isTotal ? 'semibold' : 'regular'}
        color={isTotal ? 'surface.text.gray.normal' : 'surface.text.gray.subtle'}
      >
        {label}
      </Text>
      <Text size="small" weight={isTotal ? 'semibold' : 'medium'} color="surface.text.gray.normal">
        {value}
      </Text>
    </Box>
    <Box
      width="100%"
      height="6px"
      borderRadius="max"
      overflow="hidden"
      backgroundColor="surface.background.gray.moderate"
    >
      <ChartBarListFill $share={share} $isTotal={isTotal} data-genui-bar-share={share} />
    </Box>
  </Box>
);

/**
 * A pie as a list of bars: a Total row on top at 100%, then one row a slice, in order. Each bar
 * is the slice's share of the total. Each row shows the full value and the share, as
 * "₹5,20,000.00 · 57.5%". A `percentage` chart shows the value only, as it is a share already.
 */
const ChartBarList = ({
  rows,
  nameKey,
  valueKey,
  valueFormatter,
}: {
  rows: Array<Record<string, string | number>>;
  nameKey: string;
  valueKey: string;
  valueFormatter: ChartValueFormatter;
}) => {
  const list = getBarListRows(rows, nameKey, valueKey);
  const showShare = valueFormatter.type !== 'percentage';
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4" testID="genui-chart-bar-list">
      <ChartBarListRow
        label={GENUI_CHART_TOTAL_LABEL}
        value={formatChartValue(list.total, valueFormatter)}
        share={100}
        isTotal
      />
      {list.rows.map((row, index) => (
        <ChartBarListRow
          // Rows keep the order of the data and never move.
          key={index}
          label={row.label}
          value={
            showShare
              ? `${formatChartValue(row.value, valueFormatter)} · ${formatShare(row.share)}`
              : formatChartValue(row.value, valueFormatter)
          }
          share={row.share}
        />
      ))}
    </Box>
  );
};

/**
 * The GenUI CHART with `chartVersion: 'v2'`, the default: it fits the box it renders in, with the
 * `v2` Blade charts.
 */
const RenderResponsiveChart = memo(
  ({
    chartType,
    title,
    xAxis,
    data,
    unit = '',
    variant = 'full',
    valueFormatter,
    showBorder: showBorderProp,
    yLabelPlacement: yLabelPlacementProp,
  }: ChartComponent) => {
    const { isAnimating } = useGenUIAnimation();
    const [boxRef, boxWidth] = useChartBoxWidth();
    const isTiny = variant === 'tiny';
    // A tiny chart has no grid and no axes, so no border.
    const showBorder = isTiny ? false : resolveShowBorder(showBorderProp, boxWidth);
    // With a border, the Y labels sit in a left column, as before.
    const yLabelPlacement = showBorder ? undefined : resolveYLabelPlacement(yLabelPlacementProp);
    const heightPx = isTiny ? TINY_CHART_HEIGHT : getChartHeight(boxWidth);
    const chartHeight = `${heightPx}px` as '350px';
    const minHeight = chartHeight;

    // Rows to plot: the x value is set, and at least one other key is a number.
    const validData = (Array.isArray(data) ? data : []).filter((item) => {
      if (!item || Object.keys(item).length === 0) return false;
      if (!xAxis || !item[xAxis] || item[xAxis] === '') return false;
      return Object.keys(item).some(
        (key) => key !== xAxis && typeof item[key] === 'number' && !isNaN(Number(item[key])),
      );
    });
    // Auto-detect all numeric keys except xAxis for plotting
    const firstItem = validData[0];
    const keysToPlot = firstItem
      ? Object.keys(firstItem).filter((key) => key !== xAxis && typeof firstItem[key] === 'number')
      : [];
    const hasPlot = validData.length > 0 && keysToPlot.length > 0;

    // The stream is over and the node is whole, but it has nothing to draw: say so once. While
    // the answer streams, the same node shows the skeleton, as before.
    const isEmpty = !isAnimating && Boolean(chartType && xAxis && Array.isArray(data)) && !hasPlot;
    const isLoading = !isEmpty && (!chartType || !xAxis || !valueFormatter?.type || !hasPlot);

    let content: React.ReactNode = null;
    if (isEmpty) {
      content = (
        <Box width="100%" display="flex" flexDirection="column" gap="spacing.3" marginY="spacing.3">
          {title && !isTiny ? (
            <Text size="large" weight="regular" color="surface.text.gray.subtle">
              {title}
            </Text>
          ) : null}
          <Text size="small" color="surface.text.gray.muted" testID="genui-chart-empty">
            {GENUI_CHART_EMPTY_TEXT}
          </Text>
        </Box>
      );
    } else if (isLoading) {
      content = <ChartSkeletonLoader title={title} isTiny={isTiny} chartHeight={chartHeight} />;
    }
    if (content || !xAxis || !chartType || !valueFormatter) {
      // A box of its own, so the width is measured before the chart draws.
      return (
        <Box ref={boxRef} width="100%">
          {content}
        </Box>
      );
    }

    // A pie with more than 4 slices, or in a box under 300px, is a list of bars.
    if (chartType === 'pie' && !isTiny && shouldShowBarList(validData.length, boxWidth)) {
      return (
        <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
          <Box
            ref={boxRef}
            width="100%"
            display="flex"
            flexDirection="column"
            gap="spacing.3"
            marginY="spacing.3"
          >
            {title ? (
              <Text
                size="large"
                weight="regular"
                color="surface.text.gray.subtle"
                marginBottom="spacing.3"
              >
                {title}
              </Text>
            ) : null}
            <ChartBarList
              rows={validData}
              nameKey={xAxis}
              valueKey={keysToPlot[0]}
              valueFormatter={valueFormatter}
            />
          </Box>
        </ErrorBoundary>
      );
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
              const currency = formatterCurrency || 'INR';
              // INR in lakh and crore (₹1.5L, not ₹150K), with at most 1 decimal and no ".0".
              const formatted =
                currency === 'INR'
                  ? formatINRCompact(numValue)
                  : formatNumber(numValue, {
                      currency: currency as 'INR',
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
          console.error('[GenUI Chart]: Error formatting value:', error);
          return numValue.toString();
        }
      }

      // Fallback to legacy unit formatting
      return `${numValue.toString()}${unit}`;
    };

    // X labels: a date axis is labelled on a calendar step that fits the width, as "1 Oct", and
    // thinned once. A category axis gets no interval: the v2 ChartXAxis shows the labels that fit,
    // on one line each.
    const xValues = validData.map((row) => String(row[xAxis]));
    const isDate = isDateAxis(xValues);
    const dateStep = getDateStep(xValues);
    const labelStep = isDate ? getXLabelStep(validData.length, boxWidth, dateStep) : 1;
    const lastLabelIndex = Math.floor((validData.length - 1) / labelStep) * labelStep;
    const xOverhang =
      isDate && chartType !== 'pie'
        ? getLastLabelOverhang({
            count: validData.length,
            labelStep,
            lastLabel: formatDateTick(xValues[lastLabelIndex], dateStep),
            width: boxWidth,
            chartType,
            // `overlap` gives the Y axis no width, so the plot is as wide as the box.
            yAxisWidth: yLabelPlacement === 'overlap' ? 0 : undefined,
          })
        : 0;
    const xAxisNode = !isTiny ? (
      <ChartXAxis
        dataKey={xAxis}
        interval={isDate ? labelStep - 1 : undefined}
        tickFormatter={isDate ? (value: string) => formatDateTick(value, dateStep) : undefined}
        padding={xOverhang > 0 ? { left: 0, right: xOverhang } : undefined}
      />
    ) : null;
    // Y ticks: whole numbers for counts. The v2 chart sets the width of the axis: a column as
    // wide as its ticks, or no width for `overlap` ticks inside the plot.
    const yAxisNode = !isTiny ? (
      <ChartYAxis
        allowDecimals={!isWholeNumberChart(validData, keysToPlot, valueFormatter.type)}
        tickFormatter={tickFormatter}
      />
    ) : null;
    // One series needs no legend: the title names it.
    const legendNode = !isTiny && keysToPlot.length > 1 ? <ChartLegend /> : null;
    // Tooltips show the full value, ₹1,23,450.00. The ticks stay compact, ₹1.2L. A date heading
    // reads as the X labels do, "4 Oct", not "2026-10-04".
    const tooltipNode = !isTiny ? (
      <ChartTooltip
        formatter={(value: unknown) => formatChartValue(value as number | string, valueFormatter)}
        labelFormatter={
          isDate ? (label: unknown) => formatDateTick(String(label), dateStep) : undefined
        }
      />
    ) : null;
    const plotHeight =
      chartType === 'pie' && !isTiny ? `${getDonutHeight(boxWidth)}px` : chartHeight;

    // TODO: Refactor into smaller components
    return (
      <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
        <Box
          ref={boxRef}
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
              weight="regular"
              color="surface.text.gray.subtle"
              marginBottom="spacing.3"
            >
              {title}
            </Text>
          ) : null}
          <Box width="100%" height={plotHeight as '350px'} minHeight={plotHeight as '350px'}>
            {chartType === 'bar' ? (
              <ChartBarWrapper
                version="v2"
                width="100%"
                height={chartHeight}
                showBorder={showBorder}
                yLabelPlacement={yLabelPlacement}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {xAxisNode}
                {yAxisNode}
                {keysToPlot.map((key) => (
                  <ChartBar key={key} dataKey={key} name={key} />
                ))}
                {legendNode}
                {tooltipNode}
              </ChartBarWrapper>
            ) : chartType === 'line' ? (
              <ChartLineWrapper
                version="v2"
                width="100%"
                height={chartHeight}
                showBorder={showBorder}
                yLabelPlacement={yLabelPlacement}
                minHeight={minHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {xAxisNode}
                {yAxisNode}
                {keysToPlot.map((key) => (
                  <ChartLine key={key} dataKey={key} name={key} />
                ))}
                {legendNode}
                {tooltipNode}
              </ChartLineWrapper>
            ) : chartType === 'area' ? (
              <ChartAreaWrapper
                version="v2"
                width="100%"
                height={chartHeight}
                showBorder={showBorder}
                yLabelPlacement={yLabelPlacement}
                minHeight={minHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {xAxisNode}
                {yAxisNode}
                {keysToPlot.map((key) => (
                  <ChartArea key={key} dataKey={key} name={key} type="monotone" />
                ))}
                {legendNode}
                {tooltipNode}
              </ChartAreaWrapper>
            ) : chartType === 'pie' ? (
              <ChartDonutWrapper
                version="v2"
                width="100%"
                height={plotHeight as '350px'}
                minHeight={plotHeight as '350px'}
              >
                <ChartDonut
                  dataKey={keysToPlot[0]}
                  nameKey={xAxis}
                  data={validData}
                  radius={getDonutRadius(boxWidth)}
                  type="circle"
                />
                {!isTiny ? <ChartLegend /> : null}
                {tooltipNode}
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
      prevProps.showBorder === nextProps.showBorder &&
      prevProps.yLabelPlacement === nextProps.yLabelPlacement &&
      prevProps.data?.length === nextProps.data?.length &&
      JSON.stringify(prevProps.data?.[prevProps.data.length - 1]) ===
        JSON.stringify(nextProps.data?.[nextProps.data.length - 1]) &&
      JSON.stringify(prevProps.valueFormatter) === JSON.stringify(nextProps.valueFormatter)
    );
  },
);

/**
 * The GenUI CHART with `chartVersion: 'v1'`: as released before chart versions, with the `v1`
 * Blade charts. Kept as it is for hosts that opt out of `v2`. Do not edit: changes go in
 * `RenderResponsiveChart`.
 */
const RenderFixedChart = memo(
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
          console.error('[GenUI Chart]: Error formatting value:', error);
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
              weight="regular"
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
                  data={validData}
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

/**
 * The GenUI CHART. `chartVersion` on the GenUIProvider config picks the renderer. Default `v2`:
 * the chart fits its box (RenderResponsiveChart). `v1`: the chart as released before.
 */
const RenderChartComponent = (props: ChartComponent) => {
  const { chartVersion } = useGenUIChartVersion();
  return chartVersion === 'v2' ? (
    <RenderResponsiveChart {...props} />
  ) : (
    <RenderFixedChart {...props} />
  );
};

// Primitive copy button — just the icon + tooltip, no text label.
// Compose this inside any cell that needs copy behaviour.
const Copyable = ({ value }: { value?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(value ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
  );
};

// Text + copy icon
const CopyableText = ({ value }: { value?: string }) => (
  <Box display="flex" alignItems="center" gap="spacing.2">
    <Text size="medium">{value ?? '-'}</Text>
    <Copyable value={value} />
  </Box>
);

// Table cell link renderer - fires action for consumer to handle
const TableCellLinkRenderer = ({ cell }: { cell?: Partial<TableCellLink> }) => {
  const onActionClick = useGenUIAction();

  const linkNode = cell?.action ? (
    <Link
      variant="button"
      onClick={() => {
        if (onActionClick && cell.action) {
          onActionClick(cell.action);
        }
      }}
    >
      {cell.text ?? ''}
    </Link>
  ) : (
    <Text size="medium">{cell?.text}</Text>
  );

  if (cell?.copyable && cell?.text) {
    return (
      <Box display="flex" alignItems="center" gap="spacing.2">
        {linkNode}
        <Copyable value={cell.text} />
      </Box>
    );
  }

  return linkNode;
};

// Helper to render a single table cell based on its component type
const RenderTableCellContent = ({ cell }: { cell?: Partial<TableCellType> }) => {
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
      const indicatorColor = getValidFeedbackColor(cell.color, 'neutral');
      return (
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Indicator accessibilityLabel={cell.value} color={indicatorColor} />
          <Text size="medium">{cell.value}</Text>
        </Box>
      );
    }

    case 'BADGE': {
      const badgeColor = getValidFeedbackColor(cell.color, 'neutral');
      return (
        <Badge color={badgeColor} emphasis="subtle">
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

// Produces column widths using minmax(max-content, 1fr) so columns:
// 1. Never shrink below their content width (no text wrapping)
// 2. Expand proportionally to fill available width when space permits
const calculateColumnWidths = (headers: string[], _rows: Partial<TableCellType>[][]): string[] => {
  return headers.map(() => 'minmax(max-content, 1fr)');
};

const RenderTableComponent = memo(({ headers, rows, rowActions }: TableComponent) => {
  const columnWidths = useMemo(
    () => (headers && rows ? calculateColumnWidths(headers, rows) : []),
    [headers, rows],
  );

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
    <Box display="flex" flexDirection="column" gap={genUISpacingContract.compactCardRowGap}>
      <Table
        data={tableData}
        backgroundColor="transparent"
        rowDensity="compact"
        gridTemplateColumns={columnWidths.join(' ')}
      >
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
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onHover={rowActions && rowActions.length > 0 ? () => {} : undefined}
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
  const hasHeader = title || description;

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      gap={genUISpacingContract.compactCardRowGap}
    >
      <Card width="100%" height="100%" padding={genUISpacingContract.compactCardPadding}>
        {hasHeader ? (
          <CardHeader>
            <CardHeaderLeading title={title || ''} subtitle={description || ''} />
          </CardHeader>
        ) : null}

        {children && children.length > 0 ? (
          <CardBody height="100%">
            <Box display="flex" flexDirection="column" gap={genUISpacingContract.compactCardRowGap}>
              {children.map((child, index) => {
                return <GenUIComponentRenderer key={index} component={child} index={index} />;
              })}
            </Box>
          </CardBody>
        ) : null}

        {footer ? (
          <CardFooter
            showDivider={true}
            marginTop={genUISpacingContract.cardTableToFooterAction}
            paddingTop={genUISpacingContract.cardTableToFooterAction}
          >
            <CardFooterLeading subtitle={footer} />
          </CardFooter>
        ) : null}
      </Card>
    </Box>
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
    <Box display="flex" paddingY="spacing.7">
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
  // Filters out: null, undefined, and empty string children
  const validItems = items.filter((item) => {
    const children = item.value?.children;
    if (!item.key?.children || children == null) return false;
    return typeof children !== 'string' || children !== '';
  });

  if (validItems.length === 0) {
    return null;
  }

  return (
    <InfoGroup marginY="spacing.3" itemOrientation="horizontal" size="medium" valueAlign="left">
      {validItems.map((item, index) => {
        const value = item.value!;
        const isString = typeof value.children === 'string';

        if (isString) {
          return (
            <InfoItem key={index}>
              <InfoItemKey helpText={item?.key?.helpText}>{item?.key?.children}</InfoItemKey>
              <InfoItemValue helpText={value.helpText}>{value.children as string}</InfoItemValue>
            </InfoItem>
          );
        }

        return (
          <InfoItem key={index}>
            <InfoItemKey helpText={item?.key?.helpText}>{item?.key?.children}</InfoItemKey>
            <InfoItemValue helpText={value.helpText}>
              <GenUIComponentRenderer component={value.children as GenUIComponent} index={index} />
            </InfoItemValue>
          </InfoItem>
        );
      })}
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
    if (!title && !description) return null;

    // Validate color during streaming - show placeholder for invalid colors
    const validColor = getValidFeedbackColor(color);
    if (validColor !== color) {
      return <Box marginY="spacing.3" width="100%" />;
    }

    const iconMap = {
      information: InfoIcon,
      negative: AlertTriangleIcon,
      neutral: InfoIcon,
      notice: InfoIcon,
      positive: CheckCircleIcon,
    } as const;

    const Icon = iconMap[validColor];

    return (
      <Alert
        emphasis="subtle"
        title={title}
        icon={Icon}
        description={description!}
        color={validColor}
        isDismissible={false}
        marginY="spacing.4"
        actions={{
          primary: actions?.primary?.text
            ? {
                text: actions.primary.text,
                onClick: () => {
                  if (actions.primary?.action && onActionClick) {
                    onActionClick(actions.primary.action);
                  }
                },
              }
            : undefined,
          secondary: actions?.secondary?.text
            ? {
                text: actions.secondary.text,
                onClick: () => {
                  if (actions.secondary?.action && onActionClick) {
                    onActionClick(actions.secondary.action);
                  }
                },
              }
            : undefined,
        }}
      />
    );
  },
);

const RenderAmountComponent = memo(({ value, currency }: AmountComponent) => {
  const resolvedCurrency = currency || 'INR';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    return <Text size="medium">-</Text>;
  }
  return <Amount value={numValue} currency={resolvedCurrency as 'INR' | 'MYR'} />;
});

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
  [ComponentType.AMOUNT]: {
    renderer: RenderAmountComponent as GenUIComponentRenderer,
  },
});

export {
  // Built-in registry creator (used by GenUIProvider)
  createBuiltInRegistry,
  // Markdown renderer overrides
  markdownComponents,
  // Spacing contract
  genUISpacingContract,
  getGenUIComponentTopSpacing,
  // Constants
  ComponentType,
};

export type { GenUIComponent, TableComponent };
