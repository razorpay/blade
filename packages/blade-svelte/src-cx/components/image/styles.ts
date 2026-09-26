import type { AxisValue } from '../../axes';
import { resolveSkeleton } from '../skeleton/styles';

/**
 * The parts of an Image. The box is the root and the caller sizes it by
 * `class`; what fills it is the picture, the wait for it, or what stands in
 * when it cannot load.
 */
export interface ImageClasses {
  root: string;
  img: string;
  /** Shown while a promised source is out. */
  pending: string;
  /** The stand-in: the caller's snippet, or the initial. */
  fallback: string;
}

export type ImageStyleResolver<P> = (props: P) => ImageClasses;

/** The blade taxonomy as data. */
export const IMAGE_AXES = {
  shape: ['square', 'rounded', 'circle'],
  fit: ['contain', 'cover'],
} as const;

type Axis<K extends keyof typeof IMAGE_AXES> = AxisValue<typeof IMAGE_AXES, K>;

/** Derived from IMAGE_AXES: add a value there, never here. */
export interface ImageStyleProps {
  shape?: Axis<'shape'>;
  fit?: Axis<'fit'>;
}

const SHAPE: Record<Axis<'shape'>, string> = {
  square: '',
  rounded: 'rounded-xsmall',
  circle: 'rounded-max',
};

const FIT: Record<Axis<'fit'>, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
};

// Ported from app/v2/lib/components/image/Image.svelte. The box has no size
// of its own: `cx` resolves no conflicts, so it comes from the caller's class.
// The initial stand-in has no Blade counterpart: it takes Blade's neutral
// Avatar colours (avatarTokens.ts), the faded neutral fill under the neutral
// text.
export const resolveImage: ImageStyleResolver<ImageStyleProps> = (props) => {
  const { shape = 'square', fit = 'contain' } = props;
  return {
    root: `inline-flex shrink-0 items-center justify-center overflow-hidden ${SHAPE[shape]}`.trim(),
    img: `w-full h-full ${FIT[fit]}`,
    pending: `w-full h-full ${resolveSkeleton()}`,
    fallback:
      'flex w-full h-full items-center justify-center bg-interactive-neutral-faded font-text font-semibold text-interactive-neutral-normal',
  };
};
