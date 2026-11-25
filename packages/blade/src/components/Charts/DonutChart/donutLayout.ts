import { DONUT_V2_EDGE, RADIUS_MAPPING } from './tokens';

type DonutRadiusSize = keyof typeof RADIUS_MAPPING;
type PlotArea = { x: number; y: number; width: number; height: number };

/**
 * `v2`: the outer radius of a ring that fits the plot area. Half the shorter side of the plot,
 * less `DONUT_V2_EDGE` for the outer stroke, and at most the `radius` size.
 */
const getDonutV2OuterRadius = (plotArea: PlotArea, radius: DonutRadiusSize = 'medium'): number =>
  Math.max(
    0,
    Math.min(
      RADIUS_MAPPING[radius].outerRadius,
      Math.floor(Math.min(plotArea.width, plotArea.height) / 2 - DONUT_V2_EDGE),
    ),
  );

/**
 * `v2`: the legend position that makes the ring and the legend one group. The ring stays in the
 * centre of the plot, and the legend box starts at the edge of the ring. The legend's own padding
 * is the gap. recharts keeps the plot the size of the box less the legend, so the group is
 * centred in the box.
 */
const getDonutV2LegendPosition = ({
  plotArea,
  radius,
  chartWidth,
  chartHeight,
  placement,
}: {
  plotArea: PlotArea;
  radius?: DonutRadiusSize;
  chartWidth: number;
  chartHeight: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}): { top?: number; bottom?: number; left?: number; right?: number } => {
  const outerRadius = getDonutV2OuterRadius(plotArea, radius);
  const cx = plotArea.x + plotArea.width / 2;
  const cy = plotArea.y + plotArea.height / 2;
  if (placement === 'top') return { bottom: chartHeight - (cy - outerRadius) };
  if (placement === 'left') return { right: chartWidth - (cx - outerRadius) };
  if (placement === 'right') return { left: cx + outerRadius };
  return { top: cy + outerRadius };
};

export { getDonutV2OuterRadius, getDonutV2LegendPosition };
export type { DonutRadiusSize };
