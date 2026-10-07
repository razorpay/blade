import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';
import type { LinkColor, LinkSize } from '../link/styles';

/** The blade taxonomy as data: Blade DSL's Breadcrumb (Figma). */
export const BREADCRUMB_AXES = {
  size: ['small', 'medium', 'large'],
  color: ['primary', 'neutral', 'white'],
  /** `subtle`: links between slashes. `intense`: pills between chevrons (Figma draws it at small). */
  emphasis: ['subtle', 'intense'],
} as const;

type Axis<K extends keyof typeof BREADCRUMB_AXES> = AxisValue<typeof BREADCRUMB_AXES, K>;

/** Derived from BREADCRUMB_AXES: add a value there, never here. */
export interface BreadcrumbStyleProps {
  /** Subtle only: intense has Figma's one size. @default 'medium' */
  size?: Axis<'size'>;
  /** `white` over a dark or brand surface. @default 'primary' */
  color?: Axis<'color'>;
  /** @default 'subtle' */
  emphasis?: Axis<'emphasis'>;
}

export interface BreadcrumbClasses {
  /** The `<ol>`. */
  list: string;
  /** Each `<li>`: the item and the separator after it. */
  item: string;
  /** Subtle: the Link's colour and size, and the fade a non-primary trail takes. */
  link: { color: LinkColor; size: LinkSize; class: string };
  /** Intense: the item as a pill link. */
  pill: string;
  /** The current page: plain text (subtle) or the selected pill (intense). */
  current: string;
  /** The glyph's size. */
  iconSize: 'small' | 'medium';
  /** The separator: a slash (subtle) or a chevron's box (intense). */
  separator: string;
}

// Blade DSL's Breadcrumb, subtle (Figma): Links (Body Medium 12/17, 14/20,
// 16/24, a 12/16/16px glyph) 4px apart with the slash, in
// `surface.text.gray.muted` (`staticWhite.muted` on white); a neutral or
// white trail's links at Blade's 0.56 opacity, primary's at full. The
// current page is plain Body Medium, `surface.text.gray.normal`
// (`staticWhite.normal`).
const SUBTLE: Record<Axis<'size'>, { text: string; link: LinkSize; icon: BreadcrumbClasses['iconSize'] }> = {
  small: { text: 'text-75 leading-75 tracking-50', link: 'small', icon: 'small' },
  medium: { text: 'text-100 leading-100 tracking-50', link: 'medium', icon: 'medium' },
  large: { text: 'text-200 leading-200 tracking-25', link: 'large', icon: 'medium' },
};

const SUBTLE_TONE: Record<Axis<'color'>, { current: string; separator: string }> = {
  primary: { current: 'text-surface-gray-normal', separator: 'text-surface-gray-muted' },
  neutral: { current: 'text-surface-gray-normal', separator: 'text-surface-gray-muted' },
  white: { current: 'text-surface-static-white-normal', separator: 'text-surface-static-white-muted' },
};

// Blade DSL's Breadcrumb, intense (Figma's stepper items): 28px pills, 12px
// in, 16px radius, Body Small 12/18, 24px apart with a 16px chevron. At rest
// `interactive.text.gray.subtle` (white: `staticWhite.subtle`), the
// `interactive.background.gray.default` wash under the pointer; the current
// page Semibold on `interactive.background.primary.faded` in
// `interactive.text.primary.normal` (white: `staticBlack.faded` in
// `staticWhite.normal`). Focus: Blade's 4px ring.
const PILL =
  'inline-flex h-7 items-center gap-1 rounded-large px-3 py-1 font-blade-text text-75 [line-height:1.125rem] whitespace-nowrap no-underline';
const PILL_FOCUS =
  'transition-colors duration-xquick ease-standard hover:bg-interactive-gray-default focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted';
const INTENSE_TONE: Record<Axis<'color'>, { pill: string; current: string; separator: string }> = {
  primary: {
    pill: 'font-blade-regular text-interactive-gray-subtle',
    current: 'font-blade-semibold bg-interactive-primary-faded text-interactive-primary-normal',
    separator: 'text-surface-gray-muted',
  },
  neutral: {
    pill: 'font-blade-regular text-interactive-gray-subtle',
    current: 'font-blade-semibold bg-interactive-gray-faded-highlighted text-interactive-gray-normal',
    separator: 'text-surface-gray-muted',
  },
  white: {
    pill: 'font-blade-regular text-interactive-static-white-subtle',
    current: 'font-blade-semibold bg-interactive-static-black-faded text-interactive-static-white-normal',
    separator: 'text-surface-static-white-muted',
  },
};

export function resolveBreadcrumb(props: BreadcrumbStyleProps = {}): BreadcrumbClasses {
  const { size = 'medium', color = 'primary', emphasis = 'subtle' } = props;
  if (emphasis === 'intense') {
    const tone = INTENSE_TONE[color];
    return {
      list: 'm-0 flex list-none flex-row flex-wrap items-center gap-6 p-0',
      item: 'flex items-center gap-6',
      link: {
        color: color === 'white' ? 'white' : 'neutral',
        size: 'small',
        class: '',
      },
      pill: `${PILL} ${PILL_FOCUS} ${tone.pill}`,
      current: `${PILL} ${tone.current}`,
      iconSize: 'medium',
      separator: `flex items-center ${tone.separator}`,
    };
  }
  const look = SUBTLE[size];
  const tone = SUBTLE_TONE[color];
  return {
    list: 'm-0 flex list-none flex-row flex-wrap items-center gap-1 p-0',
    item: 'flex items-center gap-1',
    link: {
      color,
      size: look.link,
      class: color === 'primary' ? '' : 'opacity-blade-700',
    },
    pill: '',
    current: `inline-flex items-center gap-1 font-blade-text font-blade-medium ${look.text} ${tone.current}`,
    iconSize: look.icon,
    separator: `font-blade-text font-blade-medium ${look.text} ${tone.separator}`,
  };
}

/** Breadcrumb: the user's location, as a trail of links. */
export interface BreadcrumbBehaviourProps {
  /** The BreadcrumbItems. */
  children: Snippet;
  /** A separator after the last item too. @default false */
  showLastSeparator?: boolean;
  /** Names the trail. @default 'Breadcrumb' */
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
}

export interface BreadcrumbItemProps {
  href: string;
  /** For a router: called on click (call `event.preventDefault()` to stay put). */
  onClick?: (event: MouseEvent) => void;
  /** The current page: plain text (or the selected pill), `aria-current="page"`. @default false */
  isCurrentPage?: boolean;
  /** The label; omit for an icon-only item (then give `accessibilityLabel`). */
  children?: Snippet;
  /** Before the label. */
  icon?: IconSource;
  /** Names an icon-only item. */
  accessibilityLabel?: string;
  testID?: string;
}

/** What a Breadcrumb hands its items. */
export interface BreadcrumbShared {
  classes: BreadcrumbClasses;
  emphasis: Axis<'emphasis'>;
  showLastSeparator: boolean;
}
