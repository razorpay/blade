import type { AxisValue } from '../../axes';

export type CheckboxValidationState = 'none' | 'error';

/**
 * Checkbox's parts. Static class strings only. The input is semantics and
 * keys; the drawn indicator is the visual, keyed from JS on both axes (`cx`
 * resolves no conflicts) so native needs no `peer-checked:` bridge.
 */
export interface CheckboxClasses {
  root: string;
  /** Applied to the root while the checkbox is disabled. */
  disabled: string;
  /** The label element wrapping the control, its title and its help text. */
  label: string;
  /** Applied to the label while the checkbox is disabled. */
  labelDisabled: string;
  /** The row: the indicator and the title. */
  row: string;
  /** The checkbox input. */
  control: string;
  /** The drawn control: a box and its always-mounted marks. */
  indicator: {
    root: string;
    look: Record<'default' | 'invalid', Record<'checked' | 'unchecked', string>>;
    /** Wraps a mark, shown or hidden. */
    mark: Record<'shown' | 'hidden', string>;
  };
  /** The title (the component's children). */
  title: string;
  /** The help text under the title, lined up with it. */
  support: string;
  supportText: string;
}

/** Style props in, the parts out. */
export type CheckboxStyleResolver<P> = (props: P) => CheckboxClasses;

/** The blade taxonomy as data. */
export const CHECKBOX_AXES = {
  size: ['small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof CHECKBOX_AXES> = AxisValue<typeof CHECKBOX_AXES, K>;

/** Derived from CHECKBOX_AXES: add a value there, never here. */
export interface CheckboxStyleProps {
  size?: Axis<'size'>;
}

// Blade's CheckboxIcon (blade-core Checkbox/checkbox.module.css). Colours per
// variant × checked: default-checked `interactive.background.primary.default`
// fill with the `interactive.border.primary.default` border; on hover the
// fill and border both take `interactive.background.primary.highlighted` —
// drawn here as a transparent border over the highlighted fill, as the
// border token set has no class for a background token. Unchecked:
// `interactive.border.gray.highlighted`, `interactive.background.gray.faded`
// on hover. Negative: `interactive.*.negative.default`. Disabled wins over
// negative: `interactive.background.primary.disabled` with no border when
// checked, `interactive.border.gray.disabled` when not. The marks are
// `interactive.icon.on-primary.normal`, `interactive.icon.static-white.
// disabled` when disabled — set on the box, and the marks fill with
// `currentColor`. The hidden input is the `peer`, so hovering the label
// (which hovers the labelled control) and keyboard focus restyle the box;
// hover in moves at 2xquick/standard, the rest is instant, as in Blade. The
// marks stay mounted and scale between .6 and 1 while they fade, xquick —
// entrance easing in, exit easing out. Focus is Blade's 4px outline, 1px
// off the box.
const CHECKED_DISABLED =
  'peer-disabled:bg-interactive-primary-disabled peer-disabled:border-transparent';
const UNCHECKED_DISABLED = 'peer-disabled:border-interactive-gray-disabled';
const INDICATOR = {
  root:
    'relative m-0.5 flex shrink-0 items-center justify-center rounded-xsmall border-solid icon-interactive-on-primary-normal peer-disabled:icon-interactive-static-white-disabled peer-hover:transition-colors peer-hover:duration-2xquick peer-hover:ease-standard peer-focus-visible:outline-solid peer-focus-visible:outline-4 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-surface-primary-muted',
  look: {
    default: {
      checked: `border-interactive-primary-default bg-interactive-primary-default peer-hover:border-transparent peer-hover:bg-interactive-primary-highlighted ${CHECKED_DISABLED}`,
      unchecked: `border-interactive-gray-highlighted bg-transparent peer-hover:bg-interactive-gray-faded ${UNCHECKED_DISABLED}`,
    },
    invalid: {
      checked: `border-interactive-negative-default bg-interactive-negative-default ${CHECKED_DISABLED}`,
      unchecked: `border-interactive-negative-default bg-transparent ${UNCHECKED_DISABLED}`,
    },
  },
  mark: {
    shown:
      'absolute flex scale-100 opacity-1300 transition-all duration-xquick ease-entrance motion-reduce:transition-none',
    hidden:
      'absolute flex [scale:.6] opacity-0 transition-all duration-xquick ease-exit motion-reduce:transition-none',
  },
};

// Per size (checkboxTokens.ts, checkbox.module.css): the box and its border,
// the mark, the title's type, and the help text's indent (the box plus
// 8px) and caption. The error line is the shared FieldHint. The small box nudges its
// tick 1px down; the dash stays centred (`smallTick`).
const SIZE: Record<
  Axis<'size'>,
  {
    box: string;
    smallTick: string;
    mark: string;
    title: string;
    indent: string;
    caption: string;
  }
> = {
  small: {
    box: 'w-3 h-3 border-thick',
    smallTick: 'pt-px',
    mark: 'w-2 h-2',
    title: 'text-75 leading-75 tracking-50',
    indent: 'ml-5',
    caption: 'text-50 leading-50',
  },
  medium: {
    box: 'w-4 h-4 border-thick',
    smallTick: '',
    mark: 'w-3 h-3',
    title: 'text-100 leading-100 tracking-50',
    indent: 'ml-6',
    caption: 'text-50 leading-50',
  },
  large: {
    box: 'w-5 h-5 border-thicker',
    smallTick: '',
    mark: 'w-4 h-4',
    title: 'text-200 leading-200 tracking-25',
    indent: 'ml-7',
    caption: 'text-100 leading-50',
  },
};

export interface CheckboxSizeParts {
  /** On the box while it shows the tick (not the dash). */
  tickNudge: string;
  /** The marks' size. */
  mark: string;
}

/** The size-dependent bits Checkbox applies from JS. */
export function checkboxSizeParts(size: Axis<'size'> = 'medium'): CheckboxSizeParts {
  return { tickNudge: SIZE[size].smallTick, mark: SIZE[size].mark };
}

// Semantic tokens only.
export const resolveCheckbox: CheckboxStyleResolver<CheckboxStyleProps> = (
  props: CheckboxStyleProps = {},
) => {
  const size = SIZE[props.size ?? 'medium'];
  return {
    root: 'block',
    disabled: 'cursor-not-allowed',
    // `relative`: the hidden control is absolutely positioned, and it must sit
    // in its own label — else focusing it scrolls whatever ancestor it lands in.
    label: 'relative my-0.5 flex cursor-pointer select-none flex-col',
    labelDisabled: 'pointer-events-none',
    row: 'flex',
    control: 'peer sr-only',
    indicator: { ...INDICATOR, root: `${INDICATOR.root} ${size.box}` },
    // Blade's SelectorTitle: 4px past the box's 2px margin.
    title: `ml-1 font-text font-regular text-surface-gray-subtle peer-disabled:text-surface-gray-disabled ${size.title}`,
    // Blade's SelectorSupportText sits in a 16px/normal line box, so the
    // caption keeps React's leading.
    support: `block text-200 [line-height:normal] ${size.indent}`,
    supportText: `font-text font-regular tracking-50 text-surface-gray-muted ${size.caption}`,
  };
};
