import React from 'react';
import type { ComponentProps } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
  Sector,
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

export interface DonutChartProps extends Omit<ComponentProps<typeof RechartsPieChart>, 'margin'> {
  data: { [key: string]: string | number }[];
  dataKey: string;
  nameKey: string;
  cx?: string | number;
  cy?: string | number;
  radius?: 'small' | 'medium' | 'large' | 'extraLarge' | 'none';
  activeShape?: React.ReactElement | ((props: any) => React.ReactElement);
  centerText?: string;
  type?: 'donut' | 'pie';
  children?: React.ReactNode;
}

export interface CellProps {
  color?: BladeColorToken;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

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

// Radius mapping for different sizes
const RADIUS_MAPPING = {
  small: { outerRadius: 60, innerRadius: 40 },
  medium: { outerRadius: 80, innerRadius: 50 },
  large: { outerRadius: 100, innerRadius: 60 },
  extraLarge: { outerRadius: 120, innerRadius: 70 },
  none: { outerRadius: 80, innerRadius: 0 },
};

// Cell component - resolves Blade color tokens to actual colors
export const Cell: React.FC<CellProps> = ({ color, fill, stroke, strokeWidth, ...rest }) => {
  const { theme } = useTheme();
  const resolvedFill = color ? getIn(theme.colors, color) : fill;

  return <RechartsCell {...rest} fill={resolvedFill} stroke={stroke} strokeWidth={strokeWidth} />;
};

const tempColors = [
  'chart.background.sequential.azure.600',
  'chart.background.sequential.azure.500',
  'chart.background.sequential.azure.400',
  'chart.background.sequential.azure.300',
  'chart.background.sequential.azure.200',
];

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const DonutChart: React.FC<DonutChartProps> = ({
  children,
  data,
  dataKey,
  nameKey,
  cx = '50%',
  cy = '50%',
  radius = 'medium',
  activeShape,
  centerText,
  type = 'donut',
  ...props
}) => {
  const { theme } = useTheme();

  // const processed = React.useMemo(() => {
  //   const kids = React.Children.toArray(children);

  //   // Assign colors if not provided
  //   const coloredKids: React.ReactNode[] = [];
  //   let autoColorIdx = 0;

  //   kids.forEach((child) => {
  //     if (!React.isValidElement(child) || (child.type as React.ComponentType<CellProps>) !== Cell) {
  //       coloredKids.push(child);
  //       return;
  //     }

  //     const incomingColor = child.props.color as BladeColorToken | undefined;
  //     const resolvedColor =
  //       incomingColor ??
  //       DEFAULT_CATEGORICAL_COLOR_TOKENS[autoColorIdx++ % DEFAULT_CATEGORICAL_COLOR_TOKENS.length];

  //     coloredKids.push(
  //       React.cloneElement(child as React.ReactElement<CellProps>, {
  //         color: resolvedColor,
  //       }),
  //     );
  //   });

  //   return { children: coloredKids };
  // }, [children]);

  const radiusConfig = RADIUS_MAPPING[radius];
  const isDonut = type === 'donut';

  return (
    <BaseBox {...metaAttribute({ name: 'donut-chart' })} width="100%" height="100%">
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsPieChart {...props}>
          <RechartsPie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx={cx}
            cy={cy}
            outerRadius={radiusConfig.outerRadius}
            innerRadius={isDonut ? radiusConfig.innerRadius : 0}
            activeShape={renderActiveShape}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getIn(theme.colors, tempColors[index])} />
            ))}
          </RechartsPie>

          {/* Center text for donut charts */}
          {isDonut && centerText && (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={theme.colors.surface.text.gray.normal}
              fontSize={theme.typography.fonts.size[200]}
              fontFamily={theme.typography.fonts.family.text}
              fontWeight={theme.typography.fonts.weight.medium}
              letterSpacing={theme.typography.letterSpacings[100]}
            >
              {centerText}
            </text>
          )}
        </RechartsPieChart>
      </RechartsResponsiveContainer>
    </BaseBox>
  );
};
