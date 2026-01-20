import React, { isValidElement, useMemo, useState, useRef, useEffect } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
  Label,
} from 'recharts';
import {
  useChartsColorTheme,
  getHighestColorInRange,
  sanitizeString,
  assignDataColorMapping,
} from '../utils';
import { componentId as commonChartComponentId } from '../CommonChartComponents/tokens';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import type { DataColorMapping } from '../CommonChartComponents/types';
import type {
  ChartDonutWrapperProps,
  ChartDonutCellProps,
  ChartDonutProps,
  ChartRadius,
} from './types';
import {
  RADIUS_MAPPING,
  BASE_CONTAINER_SIZE,
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

// Context to share container dimensions for responsive radius calculation
type DonutContainerContextType = {
  containerWidth: number;
  containerHeight: number;
};

const DonutContainerContext = React.createContext<DonutContainerContextType>({
  containerWidth: 0,
  containerHeight: 0,
});

// Helper to calculate scaled radius based on container size
const getScaledRadius = (
  baseRadius: number,
  containerSize: number,
  baseContainerSize: number,
): number => {
  if (containerSize <= 0) return baseRadius;
  // Scale the radius proportionally, but cap it at the base value
  const scaleFactor = Math.min(containerSize / baseContainerSize, 1);
  return Math.round(baseRadius * scaleFactor);
};

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
  const colorTheme = useMemo(() => {
    if (Array.isArray(children)) {
      const donutChild = children.find((child) => getComponentId(child) === componentId.chartDonut);
      if (!donutChild || !isValidElement(donutChild)) {
        return 'categorical';
      }
      return donutChild?.props?.colorTheme || 'categorical';
    }
    return 'categorical';
  }, [children]);

  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'donut',
  });
  const [legendHeight, setLegendHeight] = useState(0);
  const [legendWidth, setLegendWidth] = useState(0);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  const isValuePresentInContent = content && typeof content === 'object' && 'value' in content;
  const isLabelPresentInContent = content && typeof content === 'object' && 'label' in content;

  useEffect(() => {
    const mutationObserver = new MutationObserver((mutations) => {
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

    // ResizeObserver to track container dimensions for responsive radius
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerDimensions({ width, height });
      }
    });

    if (chartRef.current) {
      mutationObserver.observe(chartRef.current, { childList: true, subtree: true });
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
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
  /**
   * We need to  check child of ChartDonutWrapper. if they have any custom color we store that.
   * We need these mapping because colors of tooltip & legend is determine based on this
   *  recharts do provide a color but it is hex code and we need blade color token .
   */

  const dataColorMapping = useMemo(() => {
    const dataColorMapping: DataColorMapping = {};
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (getComponentId(child) === componentId.chartDonut) {
          const data = (child as React.ReactElement<ChartDonutProps>).props.data;
          // Donut Chart can also have <Cell/>  which will come under donutChildren.
          const donutChildren = (child as React.ReactElement<ChartDonutProps>).props.children;
          if (Array.isArray(donutChildren)) {
            donutChildren.forEach((child, index) => {
              if (getComponentId(child) === componentId.cell && data[index]?.name) {
                //  assign  colors to the dataColorMapping, if no color is assigned  we assign color in `assignDataColorMapping`

                dataColorMapping[sanitizeString(data[index].name as string)] = {
                  colorToken: child.props?.color,
                  isCustomColor: Boolean(child.props?.color),
                };
              }
            });
          } else {
            // if we don't have cell as child component then we can we directly assign theme colors
            data.forEach((item, index) => {
              dataColorMapping[sanitizeString(item.name as string)] = {
                colorToken: themeColors[index],
                isCustomColor: false,
              };
            });
          }
        }
      });
    }
    assignDataColorMapping(dataColorMapping, themeColors);

    return dataColorMapping;
  }, [children, themeColors]);

  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'donut', dataColorMapping }}>
      <DonutContainerContext.Provider
        value={{
          containerWidth: containerDimensions.width,
          containerHeight: containerDimensions.height,
        }}
      >
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
      </DonutContainerContext.Provider>
    </CommonChartComponentsContext.Provider>
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
  const baseRadiusConfig = RADIUS_MAPPING[radius];
  const baseContainerSize = BASE_CONTAINER_SIZE[radius];
  const { containerWidth, containerHeight } = React.useContext(DonutContainerContext);
  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'donut',
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  // Calculate responsive radius based on container size
  const containerSize = Math.min(containerWidth, containerHeight);
  const scaledOuterRadius = getScaledRadius(
    baseRadiusConfig.outerRadius,
    containerSize,
    baseContainerSize,
  );
  const scaledInnerRadius = getScaledRadius(
    baseRadiusConfig.innerRadius,
    containerSize,
    baseContainerSize,
  );
  // Stroke inner radius is slightly smaller than outer for the border effect
  const scaledStrokeInnerRadius = scaledOuterRadius - 0.75;

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
          const fill = getIn(theme.colors, child.props.color || themeColors[index]);
          return (
            <RechartsCell
              {...child.props}
              fill={fill}
              key={index}
              opacity={getCellOpacity(hoveredIndex, index)}
              strokeWidth={0}
            />
          );
        } else {
          return child;
        }
      });
    }
    return data?.map((_, index) => (
      <RechartsCell
        fill={getIn(theme.colors, themeColors[index])}
        key={index}
        opacity={getCellOpacity(hoveredIndex, index)}
        strokeWidth={0}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, data, colorTheme, hoveredIndex, themeColors]);

  const modifiedExternalDonutChildren = useMemo(() => {
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

          const fill = getIn(
            theme.colors,
            getHighestColorInRange({
              colorToken: child.props.color || themeColors[index],
              followIntensityMapping: Boolean(child.props.color),
            }),
          );
          return (
            <RechartsCell
              {...child.props}
              key={`stroke-${index}`}
              fill="transparent"
              stroke={fill} // Different stroke color for each cell
              strokeWidth={0.75}
              strokeOpacity={getCellOpacity(hoveredIndex, index)}
            />
          );
        } else {
          return child;
        }
      });
    }
    return data?.map((_, index) => (
      <RechartsCell
        key={`stroke-${index}`}
        fill="transparent"
        stroke={getIn(
          theme.colors,
          getHighestColorInRange({
            colorToken: themeColors[index],
          }),
        )} // Different stroke color for each cell
        strokeWidth={0.75}
        strokeOpacity={getCellOpacity(hoveredIndex, index)}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, data, colorTheme, hoveredIndex, themeColors]);

  return (
    <>
      <RechartsPie
        {...rest}
        cx={cx}
        cy={cy}
        outerRadius={scaledOuterRadius}
        innerRadius={scaledInnerRadius}
        data={data}
        startAngle={START_AND_END_ANGLES[type].startAngle}
        endAngle={START_AND_END_ANGLES[type].endAngle}
        onMouseEnter={(data, index) => {
          setHoveredIndex(index);
        }}
        onMouseLeave={() => {
          setHoveredIndex(null);
        }}
        paddingAngle={1.5}
      >
        {modifiedChildren}
      </RechartsPie>
      <RechartsPie
        cx={cx}
        cy={cy}
        outerRadius={scaledOuterRadius}
        innerRadius={scaledStrokeInnerRadius}
        data={data}
        startAngle={START_AND_END_ANGLES[type].startAngle}
        endAngle={START_AND_END_ANGLES[type].endAngle}
        fill="transparent"
        legendType="none"
        tooltipType="none"
        paddingAngle={1.5}
      >
        {modifiedExternalDonutChildren}
      </RechartsPie>
    </>
  );
};

const ChartDonut = assignWithoutSideEffects(_ChartDonut, {
  componentId: componentId.chartDonut,
});

export { ChartDonut, ChartDonutWrapper, ChartDonutCell };
