import React from 'react';
import {
  FunnelChart as RechartsFunnelChart,
  Funnel as RechartsFunnel,
  LabelList as RechartsLabelList,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { CommonChartComponentsContext, DEFAULT_COLOR } from '../CommonChartComponents';
import { getHighestColorInRange } from '../utils';
import { getFunnelRows } from './getFunnelRows';
import { componentIds, FUNNEL_WIDTH, LABEL_KEY, NAME_KEY, VALUE_KEY } from './tokens';
import type { ChartFunnelProps, ChartFunnelWrapperProps } from './types';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';

const _ChartFunnel = ({ color = DEFAULT_COLOR }: ChartFunnelProps): JSX.Element => {
  const { theme } = useTheme();
  const fill = getIn(theme.colors, color);
  const activeFill = getIn(theme.colors, getHighestColorInRange({ colorToken: color }));

  return (
    <RechartsFunnel
      dataKey={VALUE_KEY}
      nameKey={NAME_KEY}
      width={FUNNEL_WIDTH}
      lastShapeType="rectangle"
      isAnimationActive={false}
      fill={fill}
      stroke={theme.colors.surface.background.gray.intense}
      strokeWidth={theme.border.width.thicker}
      activeShape={{ fill: activeFill }}
    >
      <RechartsLabelList
        dataKey={LABEL_KEY}
        position="right"
        fill={theme.colors.surface.text.gray.muted}
        stroke="none"
        fontSize={theme.typography.fonts.size[75]}
        fontFamily={theme.typography.fonts.family.text}
      />
    </RechartsFunnel>
  );
};

/**
 * ChartFunnel draws the steps of a `ChartFunnelWrapper` with Recharts' `Funnel`.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <ChartFunnelWrapper data={[{ step: 'Visited', count: 1200 }, { step: 'Paid', count: 300 }]}>
 *   <ChartTooltip />
 *   <ChartFunnel dataKey="count" nameKey="step" />
 * </ChartFunnelWrapper>
 * ```
 *
 * ----
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-charts-funnelchart FunnelChart Documentation}
 */
const ChartFunnel = assignWithoutSideEffects(_ChartFunnel, {
  componentId: componentIds.chartFunnel,
});

/**
 * ChartFunnelWrapper shows how many reach each step of a sequence, as a Recharts `FunnelChart`.
 * Compose it with one `ChartFunnel` and an optional `ChartTooltip`.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <Box height="300px">
 *   <ChartFunnelWrapper data={steps}>
 *     <ChartTooltip />
 *     <ChartFunnel dataKey="count" nameKey="step" />
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
  const funnel = React.Children.toArray(children).find(
    (child): child is React.ReactElement<ChartFunnelProps> =>
      React.isValidElement(child) && getComponentId(child) === componentIds.chartFunnel,
  );
  const dataKey = funnel?.props.dataKey ?? '';
  const nameKey = funnel?.props.nameKey ?? 'name';
  const color = funnel?.props.color ?? DEFAULT_COLOR;
  const rows = React.useMemo(() => getFunnelRows(data, dataKey, nameKey), [data, dataKey, nameKey]);

  return (
    <CommonChartComponentsContext.Provider
      value={{
        chartName: 'funnel',
        dataLength: rows.length,
        dataColorMapping: { [VALUE_KEY]: { colorToken: color, isCustomColor: true } },
      }}
    >
      <BaseBox
        {...metaAttribute({ name: 'funnel-chart', testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        {...restProps}
      >
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsFunnelChart data={rows}>{children}</RechartsFunnelChart>
        </RechartsResponsiveContainer>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export { ChartFunnelWrapper, ChartFunnel };
