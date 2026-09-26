import type { AxisValue } from '../../axes';

/** The blade taxonomy as data. */
export const DIVIDER_AXES = {
  orientation: ['horizontal', 'vertical'],
  line: ['solid', 'dashed'],
} as const;

type Axis<K extends keyof typeof DIVIDER_AXES> = AxisValue<
  typeof DIVIDER_AXES,
  K
>;

/** Derived from DIVIDER_AXES: add a value there, never here. */
export interface DividerStyleProps {
  orientation?: Axis<'orientation'>;
  line?: Axis<'line'>;
}

// One border per orientation, never both: `cx` resolves no conflicts. With
// no preflight the other sides are zeroed explicitly, as the style is set on
// all four.
const ORIENTATION: Record<Axis<'orientation'>, string> = {
  horizontal: 'w-full border-t-thin border-r-none border-b-none border-l-none',
  vertical: 'h-auto self-stretch border-l-thin border-t-none border-r-none border-b-none',
};

const LINE: Record<Axis<'line'>, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
};

export function resolveDivider(props: DividerStyleProps = {}): string {
  const { orientation = 'horizontal', line = 'solid' } = props;
  return `m-0 shrink-0 border-surface-gray-muted ${ORIENTATION[orientation]} ${LINE[line]}`;
}

/** A separator line: style-only. */
export interface DividerBehaviourProps {
  testID?: string;
  /** Merged last; spacing around the line lives here. */
  class?: string;
}
