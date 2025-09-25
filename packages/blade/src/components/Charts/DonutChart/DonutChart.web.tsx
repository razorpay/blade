import React, { useMemo, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import type { ChartDonutWrapperProps, CellProps, ChartDonutProps } from './types';
import { RADIUS_MAPPING, START_AND_END_ANGLES, componentId } from './tokens';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';

// Cell component - resolves Blade color tokens to actual colors
const _Cell: React.FC<
  CellProps & {
    _isHovered?: boolean;
    _isOtherHovered?: boolean;
  }
> = ({ color, _isHovered = false, _isOtherHovered = false, ...rest }) => {
  const { theme } = useTheme();

  const resolvedFill = color ? getIn(theme.colors, color) : undefined;

  // Calculate opacity based on hover state
  const opacity = _isHovered ? 1 : _isOtherHovered ? 0.8 : 1;
  return <RechartsCell {...rest} fill={resolvedFill} opacity={opacity} />;
};

const Cell = assignWithoutSideEffects(_Cell, {
  componentId: componentId.cell,
});

const ChartDonutWrapper: React.FC<ChartDonutWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  centerText,
  testID,
  ...restProps
}) => {
  const { theme } = useTheme();

  return (
    <BaseBox
      {...metaAttribute({ name: 'donut-chart', testID })}
      {...makeAnalyticsAttribute(restProps)}
      width="100%"
      height="100%"
      {...restProps}
    >
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          {children}
          {centerText && (
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
    </BaseBox>
  );
};

const ChartDonut: React.FC<ChartDonutProps> = ({
  cx = '50%',
  cy = '50%',
  radius = 'medium',
  dataKey,
  nameKey,
  children,
  data,
  colorTheme = 'categorical',
  type = 'circle',
  ...rest
}) => {
  const radiusConfig = RADIUS_MAPPING[radius];
  const themeColors = useChartsColorTheme({ colorTheme: colorTheme ?? 'categorical' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const modifiedChildren = useMemo(() => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        if (getComponentId(child) === componentId.cell) {
          return React.cloneElement(child, {
            color: child.props.color,
            _colorTheme: colorTheme,
            _index: index,
            key: index,
            isHovered: hoveredIndex === index,
            isOtherHovered: hoveredIndex !== null && hoveredIndex !== index,
          });
        } else {
          return child;
        }
      });
    }
    return data?.map((_, index) =>
      React.createElement(RechartsCell, {
        key: index,
        fill: themeColors[index],
        opacity: hoveredIndex === index ? 1 : hoveredIndex !== null ? 0.2 : 1,
      }),
    );
  }, [children, data, colorTheme, hoveredIndex, themeColors]);

  return (
    <RechartsPie
      {...rest}
      cx={cx}
      cy={cy}
      outerRadius={radiusConfig.outerRadius}
      innerRadius={radiusConfig.innerRadius}
      data={data}
      startAngle={START_AND_END_ANGLES[type].startAngle}
      endAngle={START_AND_END_ANGLES[type].endAngle}
      strokeWidth={0}
      onMouseEnter={(data, index) => {
        setHoveredIndex(index);
      }}
      onMouseLeave={() => {
        setHoveredIndex(null);
      }}
    >
      {modifiedChildren}
    </RechartsPie>
  );
};

export { ChartDonut, ChartDonutWrapper, Cell };
