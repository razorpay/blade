import React, { isValidElement, useMemo, useState, useRef, useEffect } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
  Label,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import { componentId as commonChartComponentId } from '../CommonChartComponents/tokens';
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

const getTranslate = (
  legendLayout: 'horizontal' | 'vertical',
  legendAlignment: 'left' | 'right',
  legendWidth: number,
  legendHeight: number,
): string => {
  if (legendLayout === 'vertical') {
    return `translate(calc(-50% + ${
      legendAlignment === 'right' ? -legendWidth / 2 : legendWidth / 2
    }px) ,  calc(-50%))`;
  }
  return `translate(-50%, calc(-50% - ${legendHeight / 2}px))`;
};

const ChartDonutWrapper: React.FC<ChartDonutWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  content,
  testID,
  ...restProps
}) => {
  const { theme } = useTheme();
  const [legendHeight, setLegendHeight] = useState(0);
  const [legendWidth, setLegendWidth] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const isValuePresentInContent = content && typeof content === 'object' && 'value' in content;
  const isLabelPresentInContent = content && typeof content === 'object' && 'label' in content;
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const legendWrapper = chartRef.current?.querySelector('.recharts-legend-wrapper');
          if (legendWrapper) {
            const height = legendWrapper.getBoundingClientRect().height;
            const width = legendWrapper.getBoundingClientRect().width;
            setLegendHeight(height);
            setLegendWidth(width);
          }
        }
      });
    });

    if (chartRef.current) {
      observer.observe(chartRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

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

  const legendLayout = useMemo(() => {
    if (Array.isArray(children)) {
      const legendChild = children.find(
        (child) => getComponentId(child) === commonChartComponentId.chartLegend,
      );
      if (!legendChild || !isValidElement(legendChild)) {
        return 'horizontal';
      }
      return legendChild?.props?.layout || 'horizontal';
    }
    return 'horizontal';
  }, [children]);

  const legendAlignment = useMemo(() => {
    if (Array.isArray(children)) {
      const legendChild = children.find(
        (child) => getComponentId(child) === commonChartComponentId.chartLegend,
      );
      if (!legendChild || !isValidElement(legendChild)) {
        return 'right';
      }
      return legendChild?.props?.align || 'right';
    }
    return 'right';
  }, [children]);

  return (
    <BaseBox
      ref={chartRef}
      {...metaAttribute({ name: 'donut-chart', testID })}
      {...makeAnalyticsAttribute(restProps)}
      width="100%"
      height="100%"
      {...restProps}
      position={isValidElement(content) ? 'relative' : undefined}
    >
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          {children}
          {isLabelPresentInContent && (
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
                isValuePresentInContent
                  ? LABEL_DISTANCE_FROM_CENTER[pieChartRadius].withText
                  : LABEL_DISTANCE_FROM_CENTER[pieChartRadius].normal
              }
            >
              {content?.label}
            </Label>
          )}
          {isValuePresentInContent && (
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
                isLabelPresentInContent
                  ? LABEL_DISTANCE_FROM_CENTER[pieChartRadius].withLabel
                  : LABEL_DISTANCE_FROM_CENTER[pieChartRadius].normal
              }
            >
              {content?.value}
            </Label>
          )}
        </RechartsPieChart>
      </RechartsResponsiveContainer>

      {isValidElement(content) && (
        <BaseBox
          position="absolute"
          top="50%"
          left="50%"
          transform={getTranslate(legendLayout, legendAlignment, legendWidth, legendHeight)}
          zIndex={10}
          textAlign="center"
        >
          {content}
        </BaseBox>
      )}
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
