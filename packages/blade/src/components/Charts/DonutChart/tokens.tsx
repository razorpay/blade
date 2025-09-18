const RADIUS_MAPPING = {
  small: { outerRadius: 80, innerRadius: 52 },
  medium: { outerRadius: 120, innerRadius: 80 },
  large: { outerRadius: 162, innerRadius: 100 },
};

const START_AND_END_ANGLES = {
  circle: { startAngle: 90, endAngle: 450 },
  semicircle: { startAngle: 180, endAngle: 0 },
};

const componentId = {
  pieChart: 'pieChart',
};

export { RADIUS_MAPPING, componentId, START_AND_END_ANGLES };
