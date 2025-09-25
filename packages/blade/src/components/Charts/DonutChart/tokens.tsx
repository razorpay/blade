const RADIUS_MAPPING = {
  small: { outerRadius: 80, innerRadius: 52 },
  medium: { outerRadius: 120, innerRadius: 80 },
  large: { outerRadius: 162, innerRadius: 100 },
};

const START_AND_END_ANGLES = {
  circle: { startAngle: 450, endAngle: 90 },
  semicircle: { startAngle: 180, endAngle: 0 },
};

const componentId = {
  chartDonut: 'chartDonut',
  cell: 'cell',
};

const CENTER_TEXT_POSITION = {
  withLegend: { x: '50%', y: '48%' },
  withoutLegend: { x: '50%', y: '50%' },
};

const LABEL_DISTANCE_FROM_CENTER = {
  small: { normal: 0, withText: -14, withLabel: 6 },
  medium: { normal: 0, withText: -16, withLabel: 8 },
  large: { normal: 0, withText: -18, withLabel: 10 },
};

const LABEL_FONT_STYLES = {
  small: { fontSize: { label: 75, text: 500 } },
  medium: { fontSize: { label: 100, text: 600 } },
  large: { fontSize: { label: 200, text: 700 } },
};

export {
  RADIUS_MAPPING,
  componentId,
  START_AND_END_ANGLES,
  CENTER_TEXT_POSITION,
  LABEL_DISTANCE_FROM_CENTER,
  LABEL_FONT_STYLES,
};
