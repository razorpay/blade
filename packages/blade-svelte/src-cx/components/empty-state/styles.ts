import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';

/** The blade taxonomy as data. */
export const EMPTY_STATE_AXES = {
  size: ['small', 'medium', 'large', 'xlarge'],
} as const;

type Axis<K extends keyof typeof EMPTY_STATE_AXES> = AxisValue<typeof EMPTY_STATE_AXES, K>;

/** Derived from EMPTY_STATE_AXES: add a value there, never here. */
export interface EmptyStateStyleProps {
  /** @default 'medium' */
  size?: Axis<'size'>;
}

export type EmptyStateHeadingLevel = 'h3' | 'h5' | 'h6';

export interface EmptyStateClasses {
  root: string;
  /** The box capping the asset. */
  asset: string;
  /** Title and description. */
  content: string;
  /** The icon and the line it leads (the title, else the description). */
  lead: string;
  /** The icon's size: Figma's 12/16/20/32px. */
  iconSize: 'small' | 'medium' | 'large' | '2xlarge';
  title: string;
  description: string;
  /** Blade's Heading picks its level from its size. */
  headingLevel: EmptyStateHeadingLevel;
}

// emptyStateTokens.ts and Blade DSL's Empty State (Figma): the gap between
// sections, the asset's cap, the title's Heading and description's Text
// sizes, and the leading icon with its gap to the line it leads. Heading
// has no letter-spacing; body text does.
const SIZE: Record<Axis<'size'>, Omit<EmptyStateClasses, 'content'>> = {
  small: {
    root: 'gap-4',
    lead: 'gap-1',
    iconSize: 'small',
    asset: 'max-w-[60px] max-h-[60px]',
    title: 'text-300 leading-300',
    description: 'text-25 leading-25 tracking-50',
    headingLevel: 'h6',
  },
  medium: {
    root: 'gap-5',
    lead: 'gap-2',
    iconSize: 'medium',
    asset: 'max-w-[90px] max-h-[90px]',
    title: 'text-300 leading-300',
    description: 'text-75 leading-75 tracking-50',
    headingLevel: 'h6',
  },
  large: {
    root: 'gap-6',
    lead: 'gap-3',
    iconSize: 'large',
    asset: 'max-w-[120px] max-h-[120px]',
    title: 'text-400 leading-400',
    description: 'text-100 leading-100 tracking-50',
    headingLevel: 'h5',
  },
  xlarge: {
    root: 'gap-8',
    lead: 'gap-3',
    iconSize: '2xlarge',
    asset: 'max-w-[160px] max-h-[160px]',
    title: 'text-600 leading-600',
    description: 'text-200 leading-200 tracking-25',
    headingLevel: 'h3',
  },
};

export function resolveEmptyState(props: EmptyStateStyleProps = {}): EmptyStateClasses {
  const size = SIZE[props.size ?? 'medium'];
  return {
    root: `flex flex-col items-center justify-center ${size.root}`,
    asset: size.asset,
    // Figma: the title 4px over the description.
    content: 'flex flex-col items-center gap-1',
    lead: `flex flex-row items-center justify-center ${size.lead}`,
    iconSize: size.iconSize,
    title: `m-0 text-center font-heading font-blade-semibold text-surface-gray-subtle ${size.title}`,
    description: `m-0 text-center font-blade-text font-blade-regular text-surface-gray-muted ${size.description}`,
    headingLevel: size.headingLevel,
  };
}

/**
 * EmptyState is the centred stack a screen shows instead of content: nothing
 * here, or something went wrong. No behaviour; the action is the caller's
 * Button, in `children`.
 */
export interface EmptyStateBehaviourProps {
  /** The heading: text, or a snippet in the heading's box. */
  title?: string | Snippet;
  /** A glyph before the title (before the description when there is none). */
  icon?: IconSource;
  /** Under the title: text, or a snippet (a Link in it). */
  description?: string | Snippet;
  /** An illustration or an icon, above the title. */
  asset?: Snippet;
  /** Actions, under the description. */
  children?: Snippet;
  testID?: string;
  class?: string;
}
