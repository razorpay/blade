import React, { isValidElement, useMemo, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
  Label,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import type {
  ChartDonutWrapperProps,
  ChartDonutCellProps,
  ChartDonutProps,
  ChartRadius,
} from './types';
import {
  RADIUS_MAPPING,
  START_AND_END_ANGLES,
  componentId,
  LABEL_DISTANCE_FROM_CENTER,
  LABEL_FONT_STYLES,
} from './tokens';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';

// Cell component
const _Cell: React.FC<ChartDonutCellProps> = ({ ...rest }) => {
  return <RechartsCell {...rest} />;
};

const ChartDonutCell = assignWithoutSideEffects(_Cell, {
  componentId: componentId.cell,
});

const ChartDonutWrapper: React.FC<ChartDonutWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  content,
  testID,
  ...restProps
}) => {
  const { theme } = useTheme();

  const pieChartRadius: ChartRadius = useMemo(() => {
    if (Array.isArray(children)) {
      const donutChild = children.find((child) => getComponentId(child) === componentId.chartDonut);
      if (!donutChild || !isValidElement(donutChild)) {
        return 'medium';
      }
      return donutChild?.props?.radius || 'medium';
    }
    return 'medium';
  }, [children]);

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
          {content?.label && (
            <Label
              position="center"
              fill={theme.colors.surface.text.gray.muted}
              fontSize={
                theme.typography.fonts.size[
                  LABEL_FONT_STYLES[pieChartRadius].fontSize
                    .label as keyof typeof theme.typography.fonts.size
                ]
              }
              fontFamily={theme.typography.fonts.family.text}
              fontWeight={theme.typography.fonts.weight.medium}
              letterSpacing={theme.typography.letterSpacings[100]}
              dy={
                content?.text
                  ? LABEL_DISTANCE_FROM_CENTER[pieChartRadius].withText
                  : LABEL_DISTANCE_FROM_CENTER[pieChartRadius].normal
              }
            >
              {content?.label}
            </Label>
          )}
          {content?.text && (
            <Label
              position="center"
              fill={theme.colors.surface.text.gray.normal}
              fontSize={
                theme.typography.fonts.size[
                  LABEL_FONT_STYLES[pieChartRadius].fontSize
                    .text as keyof typeof theme.typography.fonts.size
                ]
              }
              fontFamily={theme.typography.fonts.family.heading}
              fontWeight={theme.typography.fonts.weight.bold}
              letterSpacing={theme.typography.letterSpacings[100]}
              dy={
                content?.label
                  ? LABEL_DISTANCE_FROM_CENTER[pieChartRadius].withLabel
                  : LABEL_DISTANCE_FROM_CENTER[pieChartRadius].normal
              }
            >
              {content?.text}
            </Label>
          )}
        </RechartsPieChart>
      </RechartsResponsiveContainer>
    </BaseBox>
  );
};

const _ChartDonut: React.FC<ChartDonutProps> = ({
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
  const themeColors = useChartsColorTheme({ colorTheme });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  const getCellOpacity = (hoveredIndex: number | null, currentIndex: number): number => {
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === currentIndex) return 1;
    return 0.2;
  };

  const modifiedChildren = useMemo(() => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        if (getComponentId(child) === componentId.cell) {
          /* 
           Why we are not using React.cloneElement ?  just use ChartDonutCell no?
           cell can never be  custom component in recharts. (as of v3.1.2)
           (https://github.com/recharts/recharts/issues/2788)
           https://github.com/recharts/recharts/discussions/5474

           So we have placeholder component ChartDonutCell. which we replaced by RechartsCell internally so dev can see hover effects
           working out of box. 
           */
          const fill = getIn(theme.colors, child.props.color) || themeColors[index];
          return (
            <RechartsCell
              {...child.props}
              fill={fill}
              key={index}
              opacity={getCellOpacity(hoveredIndex, index)}
            />
          );
        } else {
          return child;
        }
      });
    }
    return data?.map((_, index) => (
      <RechartsCell
        fill={themeColors[index]}
        key={index}
        opacity={getCellOpacity(hoveredIndex, index)}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

const ChartDonut = assignWithoutSideEffects(_ChartDonut, {
  componentId: componentId.chartDonut,
});

export { ChartDonut, ChartDonutWrapper, ChartDonutCell };
