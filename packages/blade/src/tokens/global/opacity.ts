type OpacityLevels = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type opacity = Readonly<Record<OpacityLevels, number>>;

const opacities: opacity = {
  1: 0.09,
  2: 0.18,
  3: 0.32,
  4: 1.0,
  5: 1.0,
  6: 1.0,
  7: 1.0,
  8: 1.0,
  9: 1.0,
};

export default opacities;
