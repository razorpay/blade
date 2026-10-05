// Text and Heading share their weight and colour scales. The classes live
// apart from text.ts/heading.ts because those re-export the components,
// which import these resolvers — one file would be an import cycle.
import type { Component, Snippet } from 'svelte';
import type { AxisValue } from '../../axes';

/** The blade taxonomy as data — owned here, not by the headless core. */
export const TEXT_AXES = {
  size: ['xsmall', 'small', 'medium', 'large'],
  weight: ['regular', 'medium', 'semibold'],
  color: ['default', 'subtle', 'muted', 'primary', 'danger', 'success', 'white', 'inherit'],
  textAlign: ['start', 'center', 'end'],
  truncate: ['none', '1', '2', '3'],
} as const;

type TextAxis<K extends keyof typeof TEXT_AXES> = AxisValue<typeof TEXT_AXES, K>;

/** Derived from TEXT_AXES: add a value there, never here. */
export interface TextStyleProps {
  size?: TextAxis<'size'>;
  weight?: TextAxis<'weight'>;
  color?: TextAxis<'color'>;
  textAlign?: TextAxis<'textAlign'>;
  /** Clamp to this many lines with an ellipsis. */
  truncate?: TextAxis<'truncate'>;
}

const SIZE: Record<TextAxis<'size'>, string> = {
  xsmall: 'text-25 leading-50',
  small: 'text-75 leading-50',
  medium: 'text-100 leading-100',
  large: 'text-200 leading-200',
};

const WEIGHT: Record<TextAxis<'weight'>, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
};

// Blade's Text/Heading colour tokens: `surface.text.gray.*`, the primary
// surface text, the intense feedback text and the static white.
export const COLOR: Record<TextAxis<'color'>, string> = {
  default: 'text-surface-gray-normal',
  subtle: 'text-surface-gray-subtle',
  muted: 'text-surface-gray-muted',
  primary: 'text-surface-primary-normal',
  danger: 'text-feedback-negative-intense',
  success: 'text-feedback-positive-intense',
  // Static on purpose: text over a fixed dark or brand surface.
  white: 'text-surface-static-white-normal',
  inherit: 'text-inherit',
};

const TEXT_ALIGN: Record<TextAxis<'textAlign'>, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
};

const TRUNCATE: Record<TextAxis<'truncate'>, string> = {
  none: '',
  '1': 'clamp-1',
  '2': 'clamp-2',
  '3': 'clamp-3',
};

export function resolveText(props: TextStyleProps = {}): string {
  const {
    size = 'medium',
    weight = 'regular',
    color = 'default',
    textAlign = 'start',
    truncate = 'none',
  } = props;
  // Blade's BaseText: no margin, whatever the element (`p` has 1em).
  return `m-0 font-text ${SIZE[size]} ${WEIGHT[weight]} ${COLOR[color]} ${TEXT_ALIGN[textAlign]} ${TRUNCATE[truncate]}`.trim();
}

/** The blade taxonomy as data — owned here, not by the headless core. */
export const HEADING_AXES = {
  size: ['small', 'medium', 'large', 'xlarge'],
  weight: ['regular', 'medium', 'semibold'],
  color: ['default', 'muted', 'primary', 'inherit'],
  textAlign: ['start', 'center', 'end'],
} as const;

type HeadingAxis<K extends keyof typeof HEADING_AXES> = AxisValue<typeof HEADING_AXES, K>;

/** Derived from HEADING_AXES: add a value there, never here. */
export interface HeadingStyleProps {
  size?: HeadingAxis<'size'>;
  weight?: HeadingAxis<'weight'>;
  color?: HeadingAxis<'color'>;
  textAlign?: HeadingAxis<'textAlign'>;
}

// medium + semibold reproduces app/v2/components/heading/Heading.svelte.
const HEADING_SIZE: Record<HeadingAxis<'size'>, string> = {
  small: 'text-200 leading-200',
  medium: 'text-300 leading-300',
  large: 'text-400 leading-400',
  xlarge: 'text-500 leading-500',
};

export function resolveHeading(props: HeadingStyleProps = {}): string {
  const { size = 'medium', weight = 'semibold', color = 'default', textAlign = 'start' } = props;
  return `m-0 font-heading ${HEADING_SIZE[size]} ${WEIGHT[weight]} ${COLOR[color]} ${TEXT_ALIGN[textAlign]}`;
}

/**
 * Text and Heading have no behaviour model: the contract is these props plus
 * each component's own style props.
 */
export interface TextBehaviourProps {
  /** The element: prose (`p`), inline (`span`), a block (`div`). */
  as?: 'p' | 'span' | 'div';
  testID?: string;
  class?: string;
  children: Snippet;
}

export interface HeadingBehaviourProps {
  /** The document level; independent of the visual `size`. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  testID?: string;
  class?: string;
  children: Snippet;
}

/** The blade Text: its behaviour props over its style props. */
export type TextComponent = Component<TextBehaviourProps & TextStyleProps>;

/** The blade Heading: its behaviour props over its style props. */
export type HeadingComponent = Component<HeadingBehaviourProps & HeadingStyleProps>;
