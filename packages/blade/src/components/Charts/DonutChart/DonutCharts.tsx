import React, { useState } from 'react';
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
  radius?: 'small' | 'medium' | 'large';
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

// Radius mapping for different sizes
const RADIUS_MAPPING = {
  small: { outerRadius: 80, innerRadius: 52 },
  medium: { outerRadius: 120, innerRadius: 80 },
  large: { outerRadius: 162, innerRadius: 100 },
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
  const [isHovered, setHovered] = useState(false);

  const radiusConfig = RADIUS_MAPPING[radius];
  const isDonut = type === 'donut';

  console.log('centerText', centerText);
  console.log('isHovered', isHovered);

  // Calculate the diameter based on outerRadius

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
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getIn(theme.colors, tempColors[index])} />
            ))}
          </RechartsPie>

          {/* Center text for donut charts */}
          {!isHovered && isDonut && centerText && (
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
