import type { AxisValue } from '../../axes';

/**
 * The parts of a Switch. The input is semantics and keys (`role="switch"`);
 * the drawn track and thumb are the visual, keyed from JS on the state
 * (`cx` resolves no conflicts).
 */
export interface SwitchClasses {
  root: string;
  /** Applied to the root while the switch is disabled. */
  disabled: string;
  /** The label element wrapping the control and its text. */
  row: string;
  /** The checkbox input. */
  control: string;
  track: Record<'on' | 'off', string>;
  thumb: Record<'on' | 'off', string>;
  /** Drawn inside the thumb while a change is in flight. */
  loading: string;
  /** The check inside the thumb: shown while on (and enabled). */
  icon: Record<'on' | 'off', string>;
  /** The check's Icon size. */
  iconSize: '2xsmall' | 'xsmall';
  /** The label text (the component's children). */
  label: string;
}

export type SwitchStyleResolver<P> = (props: P) => SwitchClasses;

/** The blade taxonomy as data. */
export const SWITCH_AXES = {
  size: ['small', 'medium'],
} as const;

type Axis<K extends keyof typeof SWITCH_AXES> = AxisValue<
  typeof SWITCH_AXES,
  K
>;

/** Derived from SWITCH_AXES: add a value there, never here. */
export interface SwitchStyleProps {
  size?: Axis<'size'>;
}

// Blade's Switch motion (switchTokens.ts `switchMotion`, getTrackStyles.ts,
// AnimatedThumb.web.tsx): the track's colour changes in `2xquick`, the thumb
// slides its own width in `quick`, both on the standard easing.
const TRACK =
  'relative inline-flex shrink-0 items-center rounded-max p-0.5 transition-colors duration-2xquick ease-standard motion-reduce:transition-none peer-focus-visible:shadow-focus';
// Blade's Switch (blade-core Switch/switch.module.css): the thumb is
// `interactive.background.static-white.default`, `…static-white.disabled`
// while disabled (read off the row's `data-disabled`: the thumb is no
// sibling of the input), and casts no shadow.
// The thumb carries the check's colour (`interactive.icon.primary.subtle`,
// `…disabled` while disabled) for the Icon inside it to inherit.
const THUMB =
  'relative left-0 flex items-center justify-center rounded-max bg-interactive-static-white-default icon-interactive-primary-subtle group-data-[disabled]:bg-interactive-static-white-disabled group-data-[disabled]:icon-interactive-primary-disabled [transition-property:translate,width,left] duration-quick ease-standard motion-reduce:transition-none';

// Blade's ThumbIcon (ThumbIcon.tsx, AnimatedThumbIcon.web.tsx): shown only
// while effectively on (on and enabled), fading in over `quick` once the
// thumb is under way (`2xquick` delay) and out at once.
const ICON =
  'transition-opacity duration-quick ease-standard motion-reduce:transition-none';

// Pressed (the row held down), Blade stretches the thumb to 125% of its width
// and shifts it toward where it will travel: `left` 12.5% of the thumb's
// width while off, -39% while on. In px here, as `left` would otherwise
// resolve against the track.
// Blade's switchTokens.ts per device: phones get the bigger switch, from
// `m` up the desktop one. Track 36×20 / 44×24 on phones, 28×16 / 36×20 on
// desktop; the thumb 4px under the track's height; the check 8/10px on
// phones, 6/8px on desktop (important: Icon's own size sits on the same
// element). Pressed, the thumb widens to 125% and shifts so it grows from
// its centre (Blade's -39% on, 12.5% off, of the thumb's width).
const SIZE: Record<
  Axis<'size'>,
  {
    track: string;
    thumb: string;
    pressed: Record<'on' | 'off', string>;
    icon: SwitchClasses['iconSize'];
    iconBox: string;
  }
> = {
  small: {
    track: 'h-5 w-9 m:h-4 m:w-7',
    thumb: 'w-4 h-4 m:w-3 m:h-3',
    icon: '2xsmall',
    iconBox: '!w-2 !h-2 m:!w-[6px] m:!h-[6px]',
    pressed: {
      on: 'group-active:w-5 group-active:[left:-6.24px] m:group-active:w-[15px] m:group-active:[left:-4.68px]',
      off: 'group-active:w-5 group-active:[left:2px] m:group-active:w-[15px] m:group-active:[left:1.5px]',
    },
  },
  medium: {
    track: 'h-6 w-11 m:h-5 m:w-9',
    thumb: 'w-5 h-5 m:w-4 m:h-4',
    icon: 'xsmall',
    iconBox: '!w-[10px] !h-[10px] m:!w-2 m:!h-2',
    pressed: {
      on: 'group-active:w-[25px] group-active:[left:-7.8px] m:group-active:w-5 m:group-active:[left:-6.24px]',
      off: 'group-active:w-[25px] group-active:[left:2.5px] m:group-active:w-5 m:group-active:[left:2px]',
    },
  },
};

// Ported from app/v2/components/switch/Switch.svelte: the thumb slides, and
// while a change is in flight it becomes a spinning arc.
export const resolveSwitch: SwitchStyleResolver<SwitchStyleProps> = (props) => {
  const size = SIZE[props.size ?? 'medium'];
  return {
    root: '',
    // Blade fades nothing: the track, thumb and label take disabled colours.
    disabled: 'pointer-events-none',
    // `relative`: the hidden control is absolutely positioned, and it must sit
    // in its own row — else focusing it scrolls whatever ancestor it lands in.
    row: 'group relative inline-flex cursor-pointer items-center gap-2',
    control: 'peer sr-only',
    // Blade: on `interactive.background.primary.default` (highlighted on
    // hover, faded when disabled); off `interactive.background.gray.default`
    // (highlighted on hover, `…gray.disabled` when disabled).
    track: {
      on: `${TRACK} ${size.track} bg-interactive-primary-default peer-hover:bg-interactive-primary-highlighted peer-disabled:bg-interactive-primary-faded`,
      off: `${TRACK} ${size.track} bg-interactive-gray-default peer-hover:bg-interactive-gray-highlighted peer-disabled:bg-interactive-gray-disabled`,
    },
    thumb: {
      on: `${THUMB} ${size.thumb} translate-x-full ${size.pressed.on}`,
      off: `${THUMB} ${size.thumb} translate-x-0 ${size.pressed.off}`,
    },
    icon: {
      on: `${ICON} ${size.iconBox} opacity-1300 delay-2xquick group-data-[disabled]:opacity-0 group-data-[disabled]:[transition-delay:0ms]`,
      off: `${ICON} ${size.iconBox} opacity-0`,
    },
    iconSize: size.icon,
    loading:
      'block w-full h-full animate-spin rounded-max border-thicker border-solid border-surface-primary-normal border-t-transparent motion-reduce:animate-none',
    // Blade's Switch draws no label; this follows its SelectorTitle siblings
    // (Checkbox, Radio): `surface.text.gray.subtle`, disabled greyed.
    label:
      'text-100 leading-100 text-surface-gray-subtle peer-disabled:text-surface-gray-disabled',
  };
};
