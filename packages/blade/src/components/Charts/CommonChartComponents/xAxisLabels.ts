/**
 * Which X labels a chart shows, so that no two labels overlap. The first and the last label stay
 * where they can. Each label is one line.
 *
 * The labels sit at equal steps across the plot. A line or area chart puts its first label from
 * its tick to the right (`isEdgeAnchored`) and its last label from its tick to the left. A bar
 * chart centres every label on its bar.
 */
const getVisibleXLabelIndexes = ({
  widths,
  plotWidth,
  minGap,
  isBand,
  isEdgeAnchored,
  paddingLeft = 0,
  paddingRight = 0,
}: {
  /** The width of each label, in px, in data order. */
  widths: number[];
  /** The width of the plot, in px. */
  plotWidth: number;
  /** The smallest gap between two labels, in px. */
  minGap: number;
  /** True for a bar chart: each tick sits in the middle of a band. */
  isBand: boolean;
  /** True for a line or area chart: the first and last labels align to their tick. */
  isEdgeAnchored: boolean;
  paddingLeft?: number;
  paddingRight?: number;
}): number[] => {
  const count = widths.length;
  if (count <= 1) return count === 1 ? [0] : [];
  const span = Math.max(0, plotWidth - paddingLeft - paddingRight);
  const step = isBand ? span / count : span / (count - 1);

  // How far a label reaches to the left or the right of its tick.
  const reach = (index: number, side: 'left' | 'right'): number => {
    const width = widths[index];
    if (isEdgeAnchored && index === 0) return side === 'right' ? width : 0;
    if (isEdgeAnchored && index === count - 1) return side === 'left' ? width : 0;
    return width / 2;
  };
  const fits = (left: number, right: number): boolean =>
    (right - left) * step - reach(left, 'right') - reach(right, 'left') >= minGap;

  const last = count - 1;
  for (let every = 1; every < count; every += 1) {
    const indexes: number[] = [];
    for (let index = 0; index < last; index += every) indexes.push(index);
    // Keep the last label. When it meets the label before it, that label goes instead.
    if (fits(indexes[indexes.length - 1], last)) {
      indexes.push(last);
    } else if (indexes.length > 1 && fits(indexes[indexes.length - 2], last)) {
      indexes.pop();
      indexes.push(last);
    }
    if (indexes.every((index, i) => i === 0 || fits(indexes[i - 1], index))) return indexes;
  }
  return [0];
};

export { getVisibleXLabelIndexes };
