import type { Snippet } from 'svelte';
import type { HTMLImgAttributes } from 'svelte/elements';
import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';

/** The blade taxonomy as data: Blade DSL's Avatar (Figma). */
export const AVATAR_AXES = {
  size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
  /** Circle for a person, square for a business or entity. */
  variant: ['circle', 'square'],
  color: ['neutral', 'primary', 'positive', 'negative', 'notice', 'information'],
} as const;

/** Blade DSL's Avatar Group (Figma): how far each avatar overlaps the one before. */
export const AVATAR_GROUP_AXES = {
  size: AVATAR_AXES.size,
  density: ['compact', 'normal', 'comfortable'],
} as const;

type Axis<K extends keyof typeof AVATAR_AXES> = AxisValue<typeof AVATAR_AXES, K>;
type GroupAxis<K extends keyof typeof AVATAR_GROUP_AXES> = AxisValue<typeof AVATAR_GROUP_AXES, K>;
export type AvatarSize = Axis<'size'>;

/** Derived from AVATAR_AXES: add a value there, never here. */
export interface AvatarStyleProps {
  /** Inside an AvatarGroup the group's size wins. @default 'medium' */
  size?: Axis<'size'>;
  /** @default 'circle' */
  variant?: Axis<'variant'>;
  /** The tint behind initials or an icon. @default 'neutral' */
  color?: Axis<'color'>;
  /** A 2px primary border. @default false */
  isSelected?: boolean;
}

/** Derived from AVATAR_GROUP_AXES: add a value there, never here. */
export interface AvatarGroupStyleProps {
  /** Every avatar's size. @default 'medium' */
  size?: GroupAxis<'size'>;
  /** @default 'compact' */
  density?: GroupAxis<'density'>;
}

export interface AvatarClasses {
  /** The white disc or tile the face sits on: `class` lands here, and its addons hang off it. */
  root: string;
  /** The face: the tint, the rim, and initials, an icon or the image. A button or a link when interactive. */
  face: string;
  /** Added to the face when it's a button or a link. */
  interactive: string;
  image: string;
  initials: string;
  /** The glyph's size. */
  iconSize: 'small' | 'medium' | 'large' | 'xlarge';
  /** The top-right addon's box (an indicator dot). */
  topAddon: string;
  /** The bottom-right addon's box (a trusted badge). */
  bottomAddon: string;
}

export interface AvatarGroupClasses {
  root: string;
  /** On every avatar after the first: the overlap. */
  overlap: string;
  /** The "+N" avatar's face and text. */
  more: { root: string; face: string; text: string };
}

// Blade DSL's Avatar (Figma) and avatarTokens.ts per size: the box, the
// square's radius, the initials (Body Semibold, Heading at xlarge), the
// glyph, and the addons' boxes and offsets (the indicator 6–10px at the
// top right, the trusted badge 8–20px at the bottom right).
const SIZE: Record<
  Axis<'size'>,
  {
    box: string;
    square: string;
    initials: string;
    icon: AvatarClasses['iconSize'];
    top: Record<Axis<'variant'>, string>;
    bottom: Record<Axis<'variant'>, string>;
  }
> = {
  xsmall: {
    box: 'w-5 h-5',
    square: 'rounded-xsmall',
    initials: 'font-text text-25 leading-25 tracking-50',
    icon: 'small',
    top: { circle: 'w-[6px] h-[6px] -top-px -right-px', square: 'w-[6px] h-[6px] -top-0.5 -right-0.5' },
    bottom: { circle: 'w-2 h-2 -bottom-px -right-px', square: 'w-2 h-2 [bottom:-10%] [right:-10%]' },
  },
  small: {
    box: 'w-7 h-7',
    square: 'rounded-xsmall',
    initials: 'font-text text-25 leading-25 tracking-50',
    icon: 'medium',
    top: { circle: 'w-[6px] h-[6px] top-0.5 right-0.5', square: 'w-[6px] h-[6px] -top-0.5 -right-0.5' },
    bottom: { circle: 'w-2 h-2 bottom-0 right-0', square: 'w-2 h-2 [bottom:-10%] [right:-10%]' },
  },
  medium: {
    box: 'w-9 h-9',
    square: 'rounded-small',
    initials: 'font-text text-75 leading-75 tracking-50',
    icon: 'medium',
    top: { circle: 'w-2 h-2 top-0.5 right-0.5', square: 'w-2 h-2 -top-0.5 -right-0.5' },
    bottom: { circle: 'w-3 h-3 bottom-0 right-0', square: 'w-3 h-3 [bottom:-10%] [right:-10%]' },
  },
  large: {
    box: 'w-12 h-12',
    square: 'rounded-small',
    initials: 'font-text text-100 leading-100 tracking-50',
    icon: 'large',
    top: { circle: 'w-2 h-2 top-1 right-1', square: 'w-2 h-2 -top-0.5 -right-0.5' },
    bottom: { circle: 'w-4 h-4 bottom-0 right-0', square: 'w-4 h-4 [bottom:-10%] [right:-10%]' },
  },
  xlarge: {
    box: 'w-14 h-14',
    square: 'rounded-medium',
    initials: 'font-heading text-400 leading-400',
    icon: 'xlarge',
    top: { circle: 'w-2.5 h-2.5 top-1 right-1', square: 'w-2.5 h-2.5 -top-0.5 -right-0.5' },
    bottom: { circle: 'w-5 h-5 bottom-0 right-0', square: 'w-5 h-5 [bottom:-10%] [right:-10%]' },
  },
};

// The tint (`interactive.background.{color}.faded`, `…fadedHighlighted`
// under the pointer) and the initials' and glyph's colour
// (`interactive.text.{color}.normal`).
const COLOR: Record<Axis<'color'>, { face: string; hover: string }> = {
  neutral: {
    face: 'bg-interactive-neutral-faded text-interactive-neutral-normal',
    hover: 'hover:bg-interactive-neutral-faded-highlighted',
  },
  primary: {
    face: 'bg-interactive-primary-faded text-interactive-primary-normal',
    hover: 'hover:bg-interactive-primary-faded-highlighted',
  },
  positive: {
    face: 'bg-interactive-positive-faded text-interactive-positive-normal',
    hover: 'hover:bg-interactive-positive-faded-highlighted',
  },
  negative: {
    face: 'bg-interactive-negative-faded text-interactive-negative-normal',
    hover: 'hover:bg-interactive-negative-faded-highlighted',
  },
  notice: {
    face: 'bg-interactive-notice-faded text-interactive-notice-normal',
    hover: 'hover:bg-interactive-notice-faded-highlighted',
  },
  information: {
    face: 'bg-interactive-information-faded text-interactive-information-normal',
    hover: 'hover:bg-interactive-information-faded-highlighted',
  },
};

// Figma's rim: 1px `surface.border.gray.subtle`, drawn inside; selected, a
// 2px `surface.border.primary.normal` one.
const RIM = {
  rest: 'border-thin border-surface-gray-subtle',
  selected: 'border-thicker border-surface-primary-normal',
};

export function resolveAvatar(props: AvatarStyleProps = {}): AvatarClasses {
  const { size = 'medium', variant = 'circle', color = 'neutral', isSelected = false } = props;
  const look = SIZE[size];
  const radius = variant === 'circle' ? 'rounded-max' : look.square;
  return {
    // The white underlay: the tint is translucent, as in Figma.
    root: `relative inline-flex shrink-0 bg-surface-gray-intense ${look.box} ${radius}`,
    face: `m-0 flex h-full w-full items-center justify-center overflow-hidden border-solid p-0 font-semibold no-underline select-none ${radius} ${RIM[isSelected ? 'selected' : 'rest']} ${COLOR[color].face}`,
    // Blade's focus ring: 4px `surface.border.primary.muted`, 1px out.
    interactive: `cursor-pointer transition-colors duration-xquick ease-standard ${COLOR[color].hover} focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted`,
    image: `block h-full w-full object-cover ${radius}`,
    initials: `whitespace-nowrap ${look.initials}`,
    iconSize: look.icon,
    topAddon: `pointer-events-none absolute flex ${look.top[variant]}`,
    bottomAddon: `pointer-events-none absolute flex ${look.bottom[variant]}`,
  };
}

// avatarGroupDensityOverlapTokens: compact overlaps half an avatar; normal
// 14px at xsmall and 16px above (Figma's −16px); comfortable 8px.
const OVERLAP: Record<GroupAxis<'density'>, Record<GroupAxis<'size'>, string>> = {
  compact: {
    xsmall: '[margin-left:-10px]',
    small: '[margin-left:-14px]',
    medium: '[margin-left:-18px]',
    large: '[margin-left:-24px]',
    xlarge: '[margin-left:-28px]',
  },
  normal: {
    xsmall: '[margin-left:-14px]',
    small: '[margin-left:-16px]',
    medium: '[margin-left:-16px]',
    large: '[margin-left:-16px]',
    xlarge: '[margin-left:-16px]',
  },
  comfortable: {
    xsmall: '[margin-left:-8px]',
    small: '[margin-left:-8px]',
    medium: '[margin-left:-8px]',
    large: '[margin-left:-8px]',
    xlarge: '[margin-left:-8px]',
  },
};

export function resolveAvatarGroup(props: AvatarGroupStyleProps = {}): AvatarGroupClasses {
  const { size = 'medium', density = 'compact' } = props;
  const look = SIZE[size];
  return {
    root: 'inline-flex flex-row items-center',
    overlap: OVERLAP[density][size],
    // Figma's "+N": `surface.background.gray.subtle` with the rim, its text
    // `interactive.text.neutral.muted`.
    more: {
      root: `relative inline-flex shrink-0 rounded-max ${look.box}`,
      face: `flex h-full w-full items-center justify-center rounded-max border-thin border-solid border-surface-gray-subtle bg-surface-gray-subtle font-semibold text-interactive-neutral-muted`,
      text: `whitespace-nowrap ${look.initials}`,
    },
  };
}

/**
 * An Avatar is a person or an entity at a glance: their image, else their
 * initials, else a glyph. With `onClick` or `href` it's a button or a link.
 */
export interface AvatarBehaviourProps {
  /** Initials come from it; it also names the avatar (the image's alt). */
  name?: string;
  /** The image; initials or the glyph show until (and unless) it loads. */
  src?: string;
  /** Names the avatar (the image's alt); defaults to `name`. Give it for a glyph-only avatar. */
  alt?: string;
  srcSet?: string;
  crossOrigin?: HTMLImgAttributes['crossorigin'];
  referrerPolicy?: HTMLImgAttributes['referrerpolicy'];
  /** The glyph when there's no name or image. @default UserIcon */
  icon?: IconSource;
  /** A button, with this as its click. */
  onClick?: (event: MouseEvent) => void;
  /** A link. */
  href?: string;
  target?: string;
  rel?: string;
  /** At the top right: an indicator dot. */
  topAddon?: Snippet;
  /** At the bottom right: a trusted badge (an image) or a glyph. */
  bottomAddon?: Snippet;
  testID?: string;
  class?: string;
}

export interface AvatarGroupBehaviourProps {
  /** How many avatars show; the rest fold into a "+N" avatar. */
  maxCount?: number;
  /** Names the group. */
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
  /** The Avatars. */
  children: Snippet;
}

/** What an AvatarGroup hands its Avatars. */
export interface AvatarGroupShared {
  size: AvatarSize;
  overlap: string;
}
