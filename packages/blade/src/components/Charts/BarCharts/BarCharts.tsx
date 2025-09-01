import React from 'react';
import type { ComponentProps } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';
import type {
  ChartColorCategories,
  ChartCategoricalEmphasis,
  ChartSequentialEmphasis,
} from '~tokens/theme/theme';

// Color token that allows both categorical and sequential chart colors
export type BladeColorToken =
  | `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`
  | `chart.background.sequential.${Exclude<
      ChartColorCategories,
      'gray'
    >}.${keyof ChartSequentialEmphasis}`;

export interface BarProps
  extends Omit<
    ComponentProps<typeof RechartsBar>,
    'fill' | 'dataKey' | 'name' | 'label' | 'activeBar'
  > {
  dataKey: string;
  name?: string; // default to dataKey
  color?: BladeColorToken;
  stackId?: string;
  activeBar?: React.ReactElement | boolean;
  label?: React.ReactElement | boolean;
}

export type BarChartProps = Omit<ComponentProps<typeof RechartsBarChart>, 'margin'> & {
  // Guard to limit number of series (Bars) - can be adjusted based on design decision
  maxBars?: number;
  children?: React.ReactNode;
};

const DEFAULT_MARGIN = { top: 16, right: 16, bottom: 16, left: 16 };

export type RechartsShapeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

// Default categorical palette order for auto-assignment when color isn't provided
const DEFAULT_CATEGORICAL_COLOR_TOKENS: BladeColorToken[] = [
  'chart.background.categorical.azure.moderate',
  'chart.background.categorical.emerald.moderate',
  'chart.background.categorical.crimson.moderate',
  'chart.background.categorical.cider.moderate',
  'chart.background.categorical.sapphire.moderate',
  'chart.background.categorical.orchid.moderate',
  'chart.background.categorical.magenta.moderate',
  'chart.background.categorical.gray.moderate',
];

// Arbitrary sequential limit per palette (can be tuned later with design)
const MAX_SEQUENTIAL_PER_CATEGORY = 6;
const BAR_CHART_CORNER_RADIUS = 2;
const DISTANCE_BETWEEN_STACKED_BARS = 2;

// Internal: Check and limit sequential usage; fallback to undefined to allow categorical defaulting
function enforceSequentialLimit(token?: BladeColorToken): BladeColorToken | undefined {
  if (!token) return token;
  const match = token.match(/^chart\.background\.sequential\.([^.]+)\./);
  if (!match) return token;

  const category = match[1] as Exclude<ChartColorCategories, 'gray'>;
  // Track sequential counts on a module-level map
  // Note: This resets between renders naturally; it's enforced per render/compose
  (enforceSequentialLimit as { _seq?: Map<string, number> })._seq =
    (enforceSequentialLimit as { _seq?: Map<string, number> })._seq ?? new Map();
  const seqMap: Map<string, number> = (enforceSequentialLimit as { _seq?: Map<string, number> })
    ._seq!;

  const current = (seqMap.get(category) ?? 0) + 1;
  seqMap.set(category, current);

  if (current > MAX_SEQUENTIAL_PER_CATEGORY) {
    // eslint-disable-next-line no-console
    console.error(
      `[BarChart] Exceeded sequential color limit for '${category}'. Falling back to categorical default.`,
    );
    return undefined;
  }

  return token;
}

// Bar component - resolves Blade color tokens to actual colors
export const Bar: React.FC<BarProps> = ({
  color,
  name,
  dataKey,
  activeBar = false,
  label = false,
  ...rest
}) => {
  const { theme } = useTheme();
  const fill = color ? getIn(theme.colors, color) : undefined;

  return (
    <RechartsBar
      {...rest}
      dataKey={dataKey}
      name={name ?? dataKey}
      fill={fill}
      legendType="rect"
      activeBar={activeBar}
      label={label}
      // https://github.com/recharts/recharts/issues/2244#issuecomment-2288572842
      shape={(props: unknown) => {
        const { fill, x, y, width, height } = props as RechartsShapeProps;
        const gap = DISTANCE_BETWEEN_STACKED_BARS;

        return (
          <rect
            fill={fill}
            x={x}
            y={y + gap / 2}
            width={width}
            height={height - gap}
            rx={BAR_CHART_CORNER_RADIUS}
            ry={BAR_CHART_CORNER_RADIUS}
          />
        );
      }}
    />
  );
};

// BarChart wrapper with default margin, auto-color assignment, and max bars guard
export const BarChart: React.FC<BarChartProps> = ({ children, maxBars = 8, ...props }) => {
  const processed = React.useMemo(() => {
    const kids = React.Children.toArray(children);

    // Count <Bar /> children
    const barChildren = kids.filter(
      (child) =>
        React.isValidElement(child) && (child.type as React.ComponentType<BarProps>) === Bar,
    ) as React.ReactElement<BarProps>[];

    if (barChildren.length > maxBars) {
      return {
        error: `Too many bars configured. Maximum allowed is ${maxBars}.`,
        children: null as React.ReactNode,
      };
    }

    // Assign colors and default names
    const coloredKids: React.ReactNode[] = [];
    let autoColorIdx = 0;

    kids.forEach((child) => {
      if (!React.isValidElement(child) || (child.type as React.ComponentType<BarProps>) !== Bar) {
        coloredKids.push(child);
        return;
      }

      const incomingColor = child.props.color as BladeColorToken | undefined;
      const limitedColor = enforceSequentialLimit(incomingColor);
      const resolvedColor =
        limitedColor ??
        DEFAULT_CATEGORICAL_COLOR_TOKENS[autoColorIdx++ % DEFAULT_CATEGORICAL_COLOR_TOKENS.length];

      coloredKids.push(
        React.cloneElement(child as React.ReactElement<BarProps>, {
          color: resolvedColor,
          name: child.props.name ?? child.props.dataKey,
        }),
      );
    });

    return { error: null as string | null, children: coloredKids };
  }, [children, maxBars]);

  const { theme } = useTheme();

  return (
    <BaseBox {...metaAttribute({ name: 'bar-chart' })} width="100%" height="100%">
      <RechartsResponsiveContainer width="100%" height="100%">
        {processed.error ? (
          // Simple centered error message; non-intrusive layout
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              color: '#b91c1c',
              fontFamily: theme.typography.fonts.family.text,
              fontSize: theme.typography.fonts.size[100],
              textAlign: 'center',
              padding: 16,
            }}
          >
            {processed.error}
          </div>
        ) : (
          <RechartsBarChart {...props} margin={DEFAULT_MARGIN} barSize={49} barGap={2}>
            {children}
          </RechartsBarChart>
        )}
      </RechartsResponsiveContainer>
    </BaseBox>
  );
};
