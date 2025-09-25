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
  pieChart: 'pieChart',
  cell: 'cell',
};

const CENTER_TEXT_POSITION = {
  withLegend: { x: '50%', y: '48%' },
  withoutLegend: { x: '50%', y: '50%' },
};

export { RADIUS_MAPPING, componentId, START_AND_END_ANGLES, CENTER_TEXT_POSITION };
