import type { AxisValue } from '../../axes';

/** The blade taxonomy as data. */
export const DIVIDER_AXES = {
  orientation: ['horizontal', 'vertical'],
  dividerStyle: ['solid', 'dashed'],
  variant: ['normal', 'subtle', 'muted'],
  thickness: ['thinner', 'thin', 'thick', 'thicker'],
} as const;

type Axis<K extends keyof typeof DIVIDER_AXES> = AxisValue<typeof DIVIDER_AXES, K>;

/** Derived from DIVIDER_AXES: add a value there, never here. */
export interface DividerStyleProps {
  /** @default 'horizontal' */
  orientation?: Axis<'orientation'>;
  /** @default 'solid' */
  dividerStyle?: Axis<'dividerStyle'>;
  /** The line's colour: `surface.border.gray.{variant}`. @default 'muted' */
  variant?: Axis<'variant'>;
  /** The line's width, Blade's border widths. @default 'thin' */
  thickness?: Axis<'thickness'>;
}

// Blade's Divider (Divider.tsx): a horizontal line is the bottom border of a
// box that grows along a flex row; a vertical one is the left border of a
// box stretched across the row. Its width, style and colour are the props.
const EDGE: Record<Axis<'orientation'>, Record<Axis<'thickness'>, string>> = {
  horizontal: {
    thinner: 'border-b-thinner',
    thin: 'border-b-thin',
    thick: 'border-b-thick',
    thicker: 'border-b-thicker',
  },
  vertical: {
    thinner: 'border-l-thinner',
    thin: 'border-l-thin',
    thick: 'border-l-thick',
    thicker: 'border-l-thicker',
  },
};

const ORIENTATION: Record<Axis<'orientation'>, string> = {
  horizontal: 'grow border-t-none border-r-none border-l-none',
  vertical: 'self-stretch border-t-none border-r-none border-b-none',
};

const STYLE: Record<Axis<'dividerStyle'>, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
};

const VARIANT: Record<Axis<'variant'>, string> = {
  normal: 'border-surface-gray-normal',
  subtle: 'border-surface-gray-subtle',
  muted: 'border-surface-gray-muted',
};

export function resolveDivider(props: DividerStyleProps = {}): string {
  const {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
  } = props;
  return `m-0 shrink-0 ${ORIENTATION[orientation]} ${EDGE[orientation][thickness]} ${STYLE[dividerStyle]} ${VARIANT[variant]}`;
}

/** A separator line: style-only. */
export interface DividerBehaviourProps {
  testID?: string;
  /** Merged last; spacing round the line, and a width or height, live here. */
  class?: string;
}
