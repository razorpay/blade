import React from 'react';
import styled from 'styled-components';
import type {
  MetricsCardChartType,
  MetricsCardFooter,
  MetricsCardLegendItem,
  MetricsCardMetric,
  MetricsCardProps,
  MetricsCardReplaceOption,
  MetricsCardTrend,
} from './types';
import { ActionList, ActionListItem, ActionListItemBadge } from '~components/ActionList';
import type { TextColors } from '~components/Typography/BaseText/types';
import type { IconColors } from '~components/Icons';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import {
  ChartArea,
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartLine,
  ChartLineWrapper,
  ChartXAxis,
  ChartYAxis,
} from '~components/Charts';
import { Dropdown, DropdownIconButton, DropdownOverlay } from '~components/Dropdown';
import { Link } from '~components/Link';
import { Heading, Text } from '~components/Typography';
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
} from '~components/Icons';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useBreakpoint } from '~utils/useBreakpoint';
import { useResize } from '~utils/useResize';
import { useControllableState } from '~utils/useControllable';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize, makeSize } from '~utils';

const rootBorderColor = 'surface.border.gray.muted';
const primaryLineColor = 'data.background.categorical.blue.moderate';

const MetricTrigger = styled.div<{ isInteractive: boolean; isSelected: boolean }>((props) => ({
  width: '100%',
  height: '100%',
  padding: `${props.theme.spacing[4]}px`,
  border: `${makeBorderSize(1)} solid ${
    props.isSelected ? props.theme.colors.surface.border.gray.muted : props.theme.colors.transparent
  }`,
  borderRadius: makeBorderSize(props.theme.border.radius.medium),
  background: props.isSelected
    ? props.theme.colors.surface.background.gray.subtle
    : props.theme.colors.transparent,
  cursor: props.isInteractive ? 'pointer' : 'default',
  textAlign: 'left',
  '@media (hover: hover)': props.isInteractive
    ? {
        '&:hover': {
          borderColor: props.theme.colors.surface.border.gray.muted,
          background: props.theme.colors.surface.background.gray.subtle,
        },
      }
    : undefined,
  ...(props.isInteractive ? { '&:focus-visible': getFocusRingStyles({ theme: props.theme }) } : {}),
}));

const LegendSwatch = styled.div<{ color: MetricsCardLegendItem['color'] }>`
  width: ${makeSize(12)};
  height: ${makeSize(12)};
  border-radius: ${({ theme }) => makeBorderSize(theme.border.radius.small)};
  background-color: ${({ color, theme }) => getIn(theme.colors, color)};
`;

const Sparkline = ({
  data,
  color,
  chartType,
}: {
  data?: number[];
  color: string;
  chartType: MetricsCardChartType;
}): React.ReactElement | null => {
  if (!data || data.length < 2) return null;

  const width = 72;
  const height = 24;
  const padding = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${
    points[0].x
  } ${height - padding} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden>
      {chartType === 'area' ? <path d={areaPath} fill={color} opacity="0.12" /> : null}
      <path
        d={linePath}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const getTrendAppearance = (
  trend: MetricsCardTrend | undefined,
): {
  iconColor: IconColors;
  textColor: TextColors;
  Icon: typeof ArrowUpRightIcon;
} => {
  if (trend === 'negative') {
    return {
      iconColor: 'feedback.icon.negative.intense',
      textColor: 'feedback.text.negative.intense',
      Icon: ArrowDownRightIcon,
    };
  }

  if (trend === 'neutral') {
    return {
      iconColor: 'surface.icon.gray.muted',
      textColor: 'surface.text.gray.muted',
      Icon: ArrowUpRightIcon,
    };
  }

  return {
    iconColor: 'feedback.icon.positive.intense',
    textColor: 'feedback.text.positive.intense',
    Icon: ArrowUpRightIcon,
  };
};

const defaultTickFormatter = (value: string): string => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return value;
  if (Math.abs(numberValue) >= 1000) {
    return `${Math.round(numberValue / 1000)}K`;
  }

  return `${numberValue}`;
};

const getSelectedMetric = (
  metrics: MetricsCardMetric[],
  selectedMetricId: string | undefined,
): MetricsCardMetric | undefined => {
  return metrics.find((metric) => metric.id === selectedMetricId) ?? metrics[0];
};

const getMetricAccessibilityLabel = (metric: MetricsCardMetric): string => {
  const safeValue =
    metric.accessibilityValue ??
    (typeof metric.value === 'string' || typeof metric.value === 'number'
      ? `${metric.value}`
      : undefined);

  return [metric.label, safeValue, metric.change?.value].filter(Boolean).join(' ');
};

const getLegendItems = ({
  selectedMetric,
  footer,
}: {
  selectedMetric: MetricsCardMetric;
  footer?: MetricsCardFooter;
}): MetricsCardLegendItem[] => {
  if (footer?.legends?.length) {
    return footer.legends;
  }

  return selectedMetric.chartSeries
    .filter((series) => series.showInLegend !== false)
    .map((series) => ({
      label: series.label,
      color: series.color,
    }));
};

const ReplaceMetricMenu = ({
  currentMetric,
  replaceableMetrics,
  visibleMetricIds,
  onReplaceMetric,
}: {
  currentMetric: MetricsCardMetric;
  replaceableMetrics: MetricsCardReplaceOption[];
  visibleMetricIds: Set<string>;
  onReplaceMetric: NonNullable<MetricsCardProps['onReplaceMetric']>;
}): React.ReactElement => {
  const orderedReplaceableMetrics = [...replaceableMetrics].sort((optionA, optionB) => {
    const getRank = (option: MetricsCardReplaceOption): number => {
      if (option.id === currentMetric.id) return 1;
      if (visibleMetricIds.has(option.id)) return 2;
      return 0;
    };

    return getRank(optionA) - getRank(optionB);
  });

  return (
    <Dropdown>
      <DropdownIconButton
        icon={EditIcon}
        size="small"
        emphasis="intense"
        accessibilityLabel={currentMetric.editLabel ?? `Replace ${currentMetric.label}`}
      />
      <DropdownOverlay>
        <ActionList>
          {orderedReplaceableMetrics.map((option) => {
            const isCurrentMetric = option.id === currentMetric.id;
            const isInUse = visibleMetricIds.has(option.id) && !isCurrentMetric;

            return (
              <ActionListItem
                key={option.id}
                title={option.label}
                value={option.id}
                isSelected={isCurrentMetric}
                isDisabled={isCurrentMetric || isInUse}
                titleSuffix={
                  isInUse ? (
                    <ActionListItemBadge color="information">In use</ActionListItemBadge>
                  ) : undefined
                }
                onClick={({ name }) => {
                  onReplaceMetric({ currentMetricId: currentMetric.id, nextMetricId: name });
                }}
              />
            );
          })}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

const ExpandedChart = ({
  chartData,
  xAxisDataKey,
  yAxisTickFormatter,
  selectedMetric,
  expandedChartType,
  xAxisInterval,
}: {
  chartData: MetricsCardProps['chartData'];
  xAxisDataKey: MetricsCardProps['xAxisDataKey'];
  yAxisTickFormatter: NonNullable<MetricsCardProps['yAxisTickFormatter']>;
  selectedMetric: MetricsCardMetric;
  expandedChartType: MetricsCardChartType;
  xAxisInterval: number;
}): React.ReactElement => {
  if (expandedChartType === 'area') {
    return (
      <ChartAreaWrapper data={chartData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey={xAxisDataKey} interval={xAxisInterval} />
        <ChartYAxis tickFormatter={yAxisTickFormatter} width={40} />
        {selectedMetric.chartSeries.map((series) => (
          <ChartArea
            key={series.dataKey}
            dataKey={series.dataKey}
            name={series.label}
            color={series.color as never}
            dot={false}
            activeDot={false}
          />
        ))}
      </ChartAreaWrapper>
    );
  }

  return (
    <ChartLineWrapper data={chartData}>
      <ChartCartesianGrid />
      <ChartXAxis dataKey={xAxisDataKey} interval={xAxisInterval} />
      <ChartYAxis tickFormatter={yAxisTickFormatter} width={40} />
      {selectedMetric.chartSeries.map((series) => (
        <ChartLine
          key={series.dataKey}
          dataKey={series.dataKey}
          name={series.label}
          color={series.color}
          strokeStyle={series.strokeStyle}
          dot={false}
          activeDot={false}
        />
      ))}
    </ChartLineWrapper>
  );
};

const _MetricsCard = ({
  metrics,
  chartData,
  xAxisDataKey,
  selectedMetricId,
  defaultSelectedMetricId,
  onSelectedMetricChange,
  isExpandable = true,
  isExpanded,
  defaultIsExpanded = true,
  onExpandedChange,
  replaceableMetrics,
  onReplaceMetric,
  footer,
  expandedChartType = 'line',
  collapsedChartType = 'line',
  yAxisTickFormatter = defaultTickFormatter,
  width = '100%',
  minWidth,
  maxWidth,
  testID,
  ...rest
}: MetricsCardProps): React.ReactElement | null => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobileLayout = matchedDeviceType === 'mobile';
  const metricsGridRef = React.useRef<HTMLDivElement>(null);
  const [, setMetricsGridWidth] = React.useState(0);
  const [currentMetricId, setCurrentMetricId] = useControllableState({
    value: selectedMetricId,
    defaultValue: defaultSelectedMetricId ?? metrics[0]?.id,
    onChange: (nextMetricId) => onSelectedMetricChange?.(nextMetricId),
  });
  const [expandedState, setExpanded] = useControllableState({
    value: isExpanded,
    defaultValue: defaultIsExpanded,
    onChange: (nextExpanded) => onExpandedChange?.(nextExpanded),
  });
  const expanded = isExpandable ? expandedState : false;

  const metricsGridResizeCallback = React.useCallback((entry: ResizeObserverEntry): void => {
    const width = entry.contentRect.width;

    setMetricsGridWidth((prevWidth) => (prevWidth !== width ? width : prevWidth));
  }, []);

  useResize(metricsGridRef, metricsGridResizeCallback);

  const selectedMetric = getSelectedMetric(metrics, currentMetricId);

  if (!metrics.length || !selectedMetric) {
    return null;
  }

  const primaryLineStroke = getIn(theme.colors, primaryLineColor);
  const legendItems = getLegendItems({ selectedMetric, footer });
  const visibleMetricIds = new Set(metrics.map((metric) => metric.id));
  const hasFooterAction = Boolean(footer?.action);
  const shouldRenderFooter =
    footer?.isVisible !== false && (legendItems.length > 0 || hasFooterAction);

  return (
    <BaseBox
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
      borderWidth="thin"
      borderStyle="solid"
      borderColor={rootBorderColor}
      overflow="hidden"
      {...metaAttribute({ name: MetaConstants.MetricsCard, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        display="flex"
        alignItems={{ base: 'stretch', xl: 'center' }}
        gap="spacing.4"
        width="100%"
        flex="1"
        padding="spacing.4"
      >
        <BaseBox
          ref={metricsGridRef}
          flex="1"
          display="flex"
          overflowX={{ base: 'scroll', xl: 'hidden' }}
          gap="spacing.4"
          width="100%"
        >
          {metrics.map((metric) => {
            const trendAppearance = getTrendAppearance(metric.change?.trend);
            const isSelected = expanded && metric.id === selectedMetric.id;
            const canExpandOnActivate = isExpandable && !expanded;
            const canSelectMetric = metrics.length > 1 && (!expanded || !isSelected);
            const isInteractive = canExpandOnActivate || canSelectMetric;

            const handleMetricActivation = (): void => {
              if (!isInteractive) return;

              if (canSelectMetric) {
                setCurrentMetricId(() => metric.id);
              }

              if (canExpandOnActivate) {
                setExpanded(() => true);
              }
            };

            return (
              <BaseBox
                key={metric.id}
                minWidth={{ base: 'auto', xl: '0px' }}
                height="100%"
                flex="1"
              >
                <MetricTrigger
                  isInteractive={isInteractive}
                  isSelected={isSelected}
                  onClick={handleMetricActivation}
                  onKeyDown={(event) => {
                    if (!isInteractive) return;

                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleMetricActivation();
                    }
                  }}
                  role={isInteractive ? 'button' : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  aria-pressed={isInteractive ? isSelected : undefined}
                  aria-label={isInteractive ? getMetricAccessibilityLabel(metric) : undefined}
                >
                  <BaseBox
                    display="flex"
                    flexDirection="column"
                    gap="spacing.4"
                    justifyContent={{ base: 'space-between', xl: 'flex-start' }}
                    height="100%"
                  >
                    <BaseBox
                      width="100%"
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      gap="spacing.5"
                    >
                      <BaseBox flex="1" minWidth="0px">
                        <Text
                          size="small"
                          weight="medium"
                          color="surface.text.gray.subtle"
                          textDecorationLine="dotted"
                          truncateAfterLines={2}
                        >
                          {metric.label}
                        </Text>
                      </BaseBox>
                      {isSelected && replaceableMetrics?.length && onReplaceMetric ? (
                        <ReplaceMetricMenu
                          currentMetric={metric}
                          replaceableMetrics={replaceableMetrics}
                          visibleMetricIds={visibleMetricIds}
                          onReplaceMetric={onReplaceMetric}
                        />
                      ) : isSelected && metric.onEditClick ? (
                        <IconButton
                          icon={EditIcon}
                          size="small"
                          emphasis="intense"
                          accessibilityLabel={metric.editLabel ?? `Edit ${metric.label}`}
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            metric.onEditClick?.();
                          }}
                        />
                      ) : null}
                    </BaseBox>
                    <BaseBox
                      width="100%"
                      display="flex"
                      flexDirection="row"
                      alignItems={{ base: 'flex-start', xl: 'flex-end' }}
                      justifyContent="space-between"
                      gap="spacing.8"
                    >
                      <BaseBox
                        display="flex"
                        alignItems="center"
                        gap="spacing.2"
                        flexWrap="wrap"
                        flex="1"
                        minWidth="max-content"
                      >
                        <Heading size="large">{metric.value}</Heading>
                        {metric.change ? (
                          <BaseBox display="flex" alignItems="center" gap="spacing.1">
                            <trendAppearance.Icon size="small" color={trendAppearance.iconColor} />
                            <Text size="small" weight="medium" color={trendAppearance.textColor}>
                              {metric.change.value}
                            </Text>
                          </BaseBox>
                        ) : null}
                      </BaseBox>
                      {!expanded ? (
                        <BaseBox display={{ base: 'none', xl: 'block' }}>
                          <Sparkline
                            data={metric.sparklineData}
                            color={primaryLineStroke}
                            chartType={collapsedChartType}
                          />
                        </BaseBox>
                      ) : null}
                    </BaseBox>
                  </BaseBox>
                </MetricTrigger>
              </BaseBox>
            );
          })}
        </BaseBox>

        {isExpandable ? (
          <BaseBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            alignSelf={{ base: 'stretch', xl: 'auto' }}
            // width={{ base: '100%', xl: 'auto' }}
          >
            <IconButton
              icon={expanded ? ChevronUpIcon : ChevronDownIcon}
              emphasis="intense"
              accessibilityLabel={expanded ? 'Collapse metrics card' : 'Expand metrics card'}
              onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
            />
          </BaseBox>
        ) : null}
      </BaseBox>

      {expanded ? (
        <BaseBox padding="spacing.4" marginTop="spacing.7">
          <BaseBox height={makeSize(244)} width="100%">
            <ExpandedChart
              chartData={chartData}
              xAxisDataKey={xAxisDataKey}
              yAxisTickFormatter={yAxisTickFormatter}
              selectedMetric={selectedMetric}
              expandedChartType={expandedChartType}
              xAxisInterval={isMobileLayout ? 1 : 0}
            />
          </BaseBox>

          {shouldRenderFooter ? (
            <BaseBox
              display="flex"
              alignItems={{ base: hasFooterAction ? 'flex-start' : 'center', m: 'center' }}
              justifyContent={hasFooterAction ? 'space-between' : 'center'}
              gap="spacing.4"
              flexDirection={{ base: 'column', m: 'row' }}
              marginTop="spacing.7"
              paddingX="spacing.6"
              paddingBottom="spacing.4"
            >
              <BaseBox
                display="flex"
                alignItems="center"
                justifyContent={hasFooterAction ? 'flex-start' : 'center'}
                gap="spacing.5"
                flexWrap="wrap"
                width={hasFooterAction ? 'auto' : '100%'}
              >
                {legendItems.map((legendItem) => (
                  <BaseBox
                    key={legendItem.label}
                    display="flex"
                    alignItems="center"
                    gap="spacing.2"
                  >
                    <LegendSwatch color={legendItem.color} />
                    <Text size="medium" color="surface.text.gray.muted">
                      {legendItem.label}
                    </Text>
                  </BaseBox>
                ))}
              </BaseBox>

              {footer?.action ? (
                footer.action.href ? (
                  <Link
                    variant="anchor"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                    href={footer.action.href}
                    target={footer.action.target}
                    onClick={footer.action.onClick}
                  >
                    {footer.action.text}
                  </Link>
                ) : (
                  <Link
                    variant="button"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                    onClick={footer.action.onClick}
                  >
                    {footer.action.text}
                  </Link>
                )
              ) : null}
            </BaseBox>
          ) : null}
        </BaseBox>
      ) : null}
    </BaseBox>
  );
};

const MetricsCard = assignWithoutSideEffects(_MetricsCard, {
  componentId: 'MetricsCard',
  displayName: 'MetricsCard',
});

export { MetricsCard };
