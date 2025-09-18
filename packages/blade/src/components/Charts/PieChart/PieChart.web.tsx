import React, { useState, useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import { PieChartContext, usePieChartContext } from './PieChartContext';
import type { ChartPieWrapperProps, CellProps, ChartPieProps } from './types';
import { RADIUS_MAPPING } from './tokens';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';

// Cell component - resolves Blade color tokens to actual colors
export const Cell: React.FC<CellProps> = ({ color, ...rest }) => {
  const { theme } = useTheme();
  const resolvedFill = color ? getIn(theme.colors, color) : undefined;

  return <RechartsCell {...rest} fill={resolvedFill} />;
};

const ChartPieWrapper: React.FC<ChartPieWrapperProps> = ({
  children,
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

const ChartPie: React.FC<ChartPieProps> = ({
  cx = '50%',
  cy = '50%',
  radius = 'medium',
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
  const themeColors = useChartsColorTheme({ colorTheme: colorTheme ?? 'default' });

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

export { ChartPie, ChartPieWrapper };
