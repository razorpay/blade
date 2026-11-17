import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  YAxis as RechartsYAxis,
  Rectangle as RechartsRectangle,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import {
  ChartTooltip,
  ChartYAxis,
  CommonChartComponentsContext,
  DEFAULT_COLOR,
} from '../CommonChartComponents';
import type { ChartTooltipProps, ChartYAxisProps } from '../CommonChartComponents';
import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import { formatCount, formatPercent, getFunnelSteps } from './getFunnelSteps';
import type { FunnelStep } from './getFunnelSteps';
import {
  componentIds,
  BAR_CATEGORY_GAP,
  DEFAULT_DROPPED_NAME,
  DEFAULT_NAME,
  DROPPED_KEY,
  HATCH_SIZE,
  HATCH_STRIPE_WIDTH,
  MAX_COLUMN_WIDTH,
  MIN_COLUMN_HEIGHT,
  PERCENT_TICKS,
  REACHED_KEY,
  STEP_KEY,
} from './tokens';
import type { ChartFunnelProps, ChartFunnelWrapperProps } from './types';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import type { DataColorCategories } from '~tokens/theme/theme';
import getIn from '~utils/lodashButBetter/get';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';

type FunnelRow = Record<string, unknown> & {
  [REACHED_KEY]: number;
  [DROPPED_KEY]: number;
  [STEP_KEY]: FunnelStep;
};

type ColumnPartProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: FunnelRow;
  isActive: boolean;
};

type FunnelColors = {
  solid: string;
  activeSolid: string;
  stripe: string;
  activeStripe: string;
  gap: string;
};

const getFunnelColors = (theme: Theme, color: ChartsCategoricalColorToken): FunnelColors => {
  const palette =
    theme.colors.data.background.categorical[color.split('.')[3] as DataColorCategories];
  return {
    solid: getIn(theme.colors, color),
    activeSolid: palette.intense,
    stripe: palette.subtle,
    activeStripe: palette.moderate,
    gap: palette.faint,
  };
};

const hatchBackground = (stripe: string, gap: string): string =>
  `repeating-linear-gradient(45deg, ${stripe} 0 ${HATCH_STRIPE_WIDTH}px, ${gap} ${HATCH_STRIPE_WIDTH}px ${HATCH_SIZE}px)`;

const Hatch = ({ id, stripe, gap }: { id: string; stripe: string; gap: string }): JSX.Element => (
  <pattern
    id={id}
    width={HATCH_SIZE}
    height={HATCH_SIZE}
    patternUnits="userSpaceOnUse"
    patternTransform="rotate(-45)"
  >
    <rect width={HATCH_SIZE} height={HATCH_SIZE} fill={gap} />
    <rect width={HATCH_STRIPE_WIDTH} height={HATCH_SIZE} fill={stripe} />
  </pattern>
);

const _ChartFunnel = ({
  color = DEFAULT_COLOR,
  name = DEFAULT_NAME,
  droppedName = DEFAULT_DROPPED_NAME,
}: ChartFunnelProps): JSX.Element => {
  const { theme } = useTheme();
  const hatchId = `blade-funnel-hatch-${React.useId().replace(/[^\w-]/g, '')}`;
  const colors = getFunnelColors(theme, color);
  const radius = theme.border.radius.small;

  const activeHatchId = `${hatchId}-active`;

  const renderPart = (isDropped: boolean) => (props: unknown) => {
    const { x, y, width, height, payload, isActive } = props as ColumnPartProps;
    const isTop = isDropped || payload[DROPPED_KEY] === 0;
    const solid = isActive ? colors.activeSolid : colors.solid;
    return (
      <RechartsRectangle
        x={x}
        y={y}
        width={width}
        height={height}
        radius={isTop ? [radius, radius, 0, 0] : 0}
        fill={isDropped ? `url(#${isActive ? activeHatchId : hatchId})` : solid}
      />
    );
  };

  const reached = renderPart(false);
  const dropped = renderPart(true);

  return (
    <>
      <defs>
        <Hatch id={hatchId} stripe={colors.stripe} gap={colors.gap} />
        <Hatch id={activeHatchId} stripe={colors.activeStripe} gap={colors.gap} />
      </defs>
      <RechartsBar
        dataKey={REACHED_KEY}
        name={name}
        stackId="funnel"
        minPointSize={(value) => ((value ?? 0) > 0 ? MIN_COLUMN_HEIGHT : 0)}
        isAnimationActive={false}
        shape={reached}
        activeBar={reached}
      />
      <RechartsBar
        dataKey={DROPPED_KEY}
        name={droppedName}
        stackId="funnel"
        isAnimationActive={false}
        shape={dropped}
        activeBar={dropped}
      />
    </>
  );
};

/**
 * ChartFunnel draws the columns of a `ChartFunnelWrapper`: who reached each step, solid, and who
 * dropped since the previous step, hatched.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <ChartFunnelWrapper data={[{ step: 'Visited', count: 1200 }, { step: 'Paid', count: 300 }]}>
 *   <ChartXAxis dataKey="step" />
 *   <ChartYAxis />
 *   <ChartTooltip />
 *   <ChartFunnel dataKey="count" />
 * </ChartFunnelWrapper>
 * ```
 *
 * ----
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-charts-funnelchart FunnelChart Documentation}
 */
const ChartFunnel = assignWithoutSideEffects(_ChartFunnel, {
  componentId: componentIds.chartFunnel,
});

const TooltipRow = ({
  label,
  count,
  percent,
  swatch,
}: {
  label: string;
  count: string;
  percent: number | null;
  swatch: string;
}): JSX.Element => {
  const { theme } = useTheme();
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" gap="spacing.4">
      <Box display="flex" alignItems="center" gap="spacing.3">
        <div
          style={{
            width: theme.spacing[4],
            height: theme.spacing[4],
            background: swatch,
            borderRadius: theme.border.radius.small,
          }}
        />
        <Text size="small" color="surface.text.staticWhite.normal">
          {label}
        </Text>
      </Box>
      <Text size="small" color="surface.text.staticWhite.normal">
        {count}
        {percent === null ? null : (
          <Text as="span" size="small" color="surface.text.staticWhite.muted">
            {` (${formatPercent(percent)})`}
          </Text>
        )}
      </Text>
    </Box>
  );
};

type FunnelTooltipProps = {
  active?: boolean;
  label?: React.ReactNode;
  payload?: { payload: FunnelRow }[];
} & Pick<ChartFunnelProps, 'name' | 'droppedName' | 'color' | 'formatValue'>;

const FunnelTooltip = ({
  active,
  label,
  payload,
  name = DEFAULT_NAME,
  droppedName = DEFAULT_DROPPED_NAME,
  color = DEFAULT_COLOR,
  formatValue = formatCount,
}: FunnelTooltipProps): JSX.Element | null => {
  const { theme } = useTheme();
  const step = payload?.[0]?.payload[STEP_KEY];
  if (!active || !step) return null;
  const colors = getFunnelColors(theme, color);

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.icon.staticBlack.normal,
        borderRadius: theme.border.radius.large,
        border: `1px solid ${theme.colors.surface.border.gray.muted}`,
        padding: theme.spacing[4],
        minWidth: 200,
      }}
    >
      <Heading size="small" weight="semibold" color="surface.text.staticWhite.normal">
        {label}
      </Heading>
      <Box paddingTop="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
        <TooltipRow
          label={name}
          count={formatValue(step.count)}
          percent={step.reachedPercentOfPrevious}
          swatch={colors.activeSolid}
        />
        {step.dropped ? (
          <TooltipRow
            label={droppedName}
            count={formatValue(step.dropped)}
            percent={step.droppedPercentOfPrevious}
            swatch={hatchBackground(colors.activeStripe, colors.gap)}
          />
        ) : null}
      </Box>
    </div>
  );
};

const percentTick = (value: number): string => `${value}%`;

/**
 * ChartFunnelWrapper shows how many reach each step of a sequence and how many drop off between
 * steps. Compose it with one `ChartFunnel` and any of `ChartXAxis`, `ChartYAxis`,
 * `ChartCartesianGrid` and `ChartTooltip`.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <Box height="300px">
 *   <ChartFunnelWrapper data={steps}>
 *     <ChartCartesianGrid />
 *     <ChartXAxis dataKey="step" />
 *     <ChartYAxis />
 *     <ChartTooltip />
 *     <ChartFunnel dataKey="count" />
 *   </ChartFunnelWrapper>
 * </Box>
 * ```
 *
 * ----
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-charts-funnelchart FunnelChart Documentation}
 */
const ChartFunnelWrapper = ({
  data,
  children,
  testID,
  ...restProps
}: ChartFunnelWrapperProps): JSX.Element => {
  const childArray = React.Children.toArray(children);
  const funnel = childArray.find(
    (child): child is React.ReactElement<ChartFunnelProps> =>
      React.isValidElement(child) && getComponentId(child) === componentIds.chartFunnel,
  );
  const funnelProps = funnel?.props;
  const dataKey = funnelProps?.dataKey ?? '';
  const { rows, top } = React.useMemo(() => {
    const steps = getFunnelSteps(data, dataKey);
    return {
      rows: data.map(
        (row, index): FunnelRow => ({
          ...row,
          [REACHED_KEY]: steps[index].reachedPercentOfFirst,
          [DROPPED_KEY]: steps[index].droppedPercentOfFirst,
          [STEP_KEY]: steps[index],
        }),
      ),
      top: Math.max(
        100,
        ...steps.map((step) => step.reachedPercentOfFirst + step.droppedPercentOfFirst),
      ),
    };
  }, [data, dataKey]);
  const yAxis: Partial<ChartYAxisProps> = {
    domain: [0, top],
    ticks: top === 100 ? PERCENT_TICKS : undefined,
    tickFormatter: percentTick,
  };
  const hasYAxis = childArray.some(
    (child) => React.isValidElement(child) && child.type === ChartYAxis,
  );

  const chartChildren = childArray.map((child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === ChartYAxis) {
      return React.cloneElement(child, { ...yAxis, ...(child.props as ChartYAxisProps) });
    }
    if (child.type === ChartTooltip) {
      return React.cloneElement(child, {
        content: <FunnelTooltip {...funnelProps} />,
        ...(child.props as ChartTooltipProps),
      });
    }
    return child;
  });

  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'funnel', dataLength: data.length }}>
      <BaseBox
        {...metaAttribute({ name: 'funnel-chart', testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        {...restProps}
      >
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={rows}
            maxBarSize={MAX_COLUMN_WIDTH}
            barCategoryGap={BAR_CATEGORY_GAP}
          >
            {hasYAxis ? null : <RechartsYAxis hide domain={yAxis.domain} />}
            {chartChildren}
          </RechartsBarChart>
        </RechartsResponsiveContainer>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export { ChartFunnelWrapper, ChartFunnel };
