import React, { useState, useMemo } from 'react';
import type { ComponentProps } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
  Sector,
} from 'recharts';
import type { PieProps as RechartsPieChartProps } from 'recharts';
import { useChartsColorTheme } from '../utils';
import { PieChartContext, usePieChartContext } from './PieChartContext';
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

export interface PieChartProps extends Omit<ComponentProps<typeof RechartsPieChart>, 'margin'> {
  centerText?: string;
  type?: 'donut' | 'pie';
}

export interface CellProps {
  color?: BladeColorToken;
}
// Radius mapping for different sizes
const RADIUS_MAPPING = {
  small: { outerRadius: 80, innerRadius: 52 },
  medium: { outerRadius: 120, innerRadius: 80 },
  large: { outerRadius: 162, innerRadius: 100 },
};

export interface PieProps {
  dataKey: string;
  nameKey: string;
  cx?: string | number;
  cy?: string | number;
  radius?: 'small' | 'medium' | 'large';
  showActiveShape?: boolean;
  children?: React.ReactNode;
  data: RechartsPieChartProps['data'];
  colorTheme?: 'default' | 'informational';
}

// Cell component - resolves Blade color tokens to actual colors
export const Cell: React.FC<CellProps> = ({ color, ...rest }) => {
  const { theme } = useTheme();
  const resolvedFill = color ? getIn(theme.colors, color) : undefined;

  return <RechartsCell {...rest} fill={resolvedFill} />;
};

const renderActiveShape = (
  props: Required<RechartsPieChartProps['activeShape']>,
): React.ReactElement => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload = {} as any,
    percent = 0,
    value = 0,
  } = (props as unknown) as any;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = Number(cx) + (outerRadius + 10) * cos;
  const sy = Number(cy) + (outerRadius + 10) * sin;
  const mx = Number(cx) + (outerRadius + 30) * cos;
  const my = Number(cy) + (outerRadius + 30) * sin;
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

export const PieChart: React.FC<PieChartProps> = ({
  children,
  data,
  dataKey,
  centerText,
  type = 'donut',
  ...props
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const isDonut = type === 'donut';

  return (
    <BaseBox {...metaAttribute({ name: 'donut-chart' })} width="100%" height="100%">
      <PieChartContext.Provider value={{ type, isHovered, setIsHovered }}>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsPieChart {...props}>
            {children}
            {!isHovered && isDonut && centerText && (
              <text
                x="50%"
                y="50%"
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
      </PieChartContext.Provider>
    </BaseBox>
  );
};

export const Pie: React.FC<PieProps> = ({
  cx = '50%',
  cy = '50%',
  radius = 'medium',
  showActiveShape = true,
  dataKey,
  nameKey,
  children,
  data,
  colorTheme = 'default',
  ...rest
}) => {
  const { setIsHovered, type } = usePieChartContext();
  const isDonut = type === 'donut';
  const radiusConfig = RADIUS_MAPPING[radius];
  const themeColors = useChartsColorTheme({ colorTheme });

  const modifiedChildren = useMemo(() => {
    if (Array.isArray(children)) {
      return children.map((child, index) =>
        React.cloneElement(child, {
          color: child.props.color || themeColors[index],
          key: index,
        }),
      );
    }
    return data?.map((_, index) =>
      React.createElement(RechartsCell, {
        fill: themeColors[index],
        key: index,
      }),
    );
  }, [children, data, themeColors]);

  return (
    <RechartsPie
      {...rest}
      cx={cx}
      cy={cy}
      outerRadius={radiusConfig.outerRadius}
      innerRadius={isDonut ? radiusConfig.innerRadius : 0}
      activeShape={
        showActiveShape
          ? (props: RechartsPieChartProps['activeShape']) => renderActiveShape(props)
          : undefined
      }
      data={data}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {modifiedChildren}
    </RechartsPie>
  );
};
