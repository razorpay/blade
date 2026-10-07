import type { AxisValue } from '../../axes';
import type { ValidationState } from '../../runes/form/hint';
import { resolveIconButton } from '../icon-button/styles';
import {
  INPUT_ACTIVE,
  INPUT_ACTIVE_ON_FOCUS,
  INPUT_DISABLED_CONTENT,
  INPUT_DISABLED_FILL,
  INPUT_DISABLED_ON_CONTROL,
  INPUT_DISABLED_TEXT_ON_CONTROL,
  INPUT_FILL,
  INPUT_INACTIVE,
  INPUT_TEXT,
} from '../shared/input';

export type TextInputValidationState = ValidationState;

type Validated = Exclude<TextInputValidationState, 'none'>;

/** Alone the control draws its own frame; in an InputGroup the group does. */
export type TextInputFrame = 'solo' | 'grouped';

/**
 * TextInput's parts. Static class strings only. The box is the drawn field —
 * border, fill, padding, focus ring — and the control inside it is bare, so
 * the affixes sit inside the field and the box's flex row spaces them. Focus
 * is toggled from JS: the ring belongs to the box, and `focus-within:` is
 * not in the grammar native maps.
 */
export interface TextInputClasses {
  root: string;
  /**
   * The root inside an InputGroup, in place of `root`: the member's cell.
   * It names no width — the group's grid sizes the cell, and stretches the
   * member by the pixel it pulls back over its neighbour's frame.
   */
  grouped: string;
  /**
   * Applied while the field is disabled: to the root, the box and each
   * affix. Toggled from JS like focus — `has-*` is not in native's grammar.
   */
  disabled: Record<'root' | 'box' | 'affix', string>;
  /** The drawn field: the row holding the affixes and the control. */
  box: string;
  /** The input element: text only, no frame of its own. */
  control: string;
  /** The box's border and radius. */
  frame: Record<TextInputFrame, string>;
  /**
   * Applied to the box by whether the control has focus. Keyed on both
   * states: the two differ in border colour and `cx` resolves no conflicts.
   */
  focus: Record<TextInputFrame, Record<'focused' | 'blurred', string>>;
  /** Applied to the box per validation state. */
  validation: Record<TextInputFrame, Record<Validated, string>>;
  /**
   * The parts before the text, in Figma's order: `leadingIcon`, `prefix`,
   * the `leading` snippet. The group spaces them; each carries its own
   * inset from the field's edge (see the README).
   */
  leading: Record<'group' | 'icon' | 'prefix' | 'slot', string>;
  /**
   * The parts after the text: the clear button, `suffix`, `trailingIcon`,
   * the `trailing` snippet. The group sits the field's gap after the text.
   */
  trailing: Record<'group' | 'item', string>;
  /** The glyphs' size: 12, 16, 20px. */
  iconSize: 'small' | 'medium' | 'large';
  /** The clear button (`showClearButton`): IconButton's medium look. */
  clear: string;
  /** The hint line and the character counter, side by side. */
  footer: string;
  /** The counter's box: the hint's gap above it, 2px off the end. */
  counter: string;
}

/** Style props in, the parts out. */
export type TextInputStyleResolver<P> = (props: P) => TextInputClasses;

/** The blade taxonomy as data. */
export const TEXT_INPUT_AXES = {
  size: ['small', 'medium', 'large'],
  textAlign: ['left', 'center', 'right'],
} as const;

type Axis<K extends keyof typeof TEXT_INPUT_AXES> = AxisValue<typeof TEXT_INPUT_AXES, K>;

/** Derived from TEXT_INPUT_AXES: add a value there, never here. */
export interface TextInputStyleProps {
  /** Also sizes the label and the hint. @default 'medium' */
  size?: Axis<'size'>;
  /** @default 'left' */
  textAlign?: Axis<'textAlign'>;
}

// Blade DSL's Text Input (Figma) per size: 32/36/48px tall, the body text
// (letter-spacing -1.3%, -3.3% at large), 8px round (12px at large). Figma
// builds the field as 4px of padding round its parts, each part carrying
// its own inset beside it: the text 4px (8px from medium), a glyph or the
// prefix the same, a selector (the `leading` snippet) none. So text and
// glyphs sit 8px (12px) from the edge, a selector 4px. Between the parts:
// the leading ones 2px apart (8px), the text 4px (8px) after them, and
// the trailing ones 2px (8px) after the text and 4px (8px) apart.
// Medium keeps 16px text on phones — iOS zooms into a smaller field — and
// Figma's 14px from `m` up.
const SIZE: Record<
  Axis<'size'>,
  {
    box: string;
    text: string;
    radius: string;
    framed: string;
    control: string;
    leading: Record<'group' | 'icon' | 'prefix', string>;
    trailing: Record<'group' | 'item', string>;
    icon: TextInputClasses['iconSize'];
  }
> = {
  small: {
    box: 'min-h-8 px-1',
    text: 'text-75 leading-75 tracking-50',
    radius: 'rounded-small',
    framed: 'min-h-8 px-2 py-1',
    control: 'pl-1',
    leading: { group: 'gap-0.5', icon: 'pl-1', prefix: 'pl-0.5' },
    trailing: { group: 'ms-0.5', item: 'pr-1' },
    icon: 'small',
  },
  medium: {
    box: 'min-h-9 px-1',
    text: 'text-200 leading-200 tracking-25 m:text-100 m:leading-100 m:tracking-50',
    radius: 'rounded-small',
    framed: 'min-h-9 px-3 py-2',
    control: 'pl-2',
    leading: { group: 'gap-2', icon: 'pl-2', prefix: 'pl-2' },
    trailing: { group: 'ms-2', item: 'pr-2' },
    icon: 'medium',
  },
  large: {
    box: 'min-h-12 px-1',
    text: 'text-200 leading-200 tracking-25',
    radius: 'rounded-medium',
    framed: 'min-h-12 px-3 py-2',
    control: 'pl-2',
    leading: { group: 'gap-2', icon: 'pl-2', prefix: 'pl-2' },
    trailing: { group: 'ms-2', item: 'pr-2' },
    icon: 'large',
  },
};

const ALIGN: Record<Axis<'textAlign'>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// The box is the field: the parts sit inside its border, in one row with no
// gap of its own — each part carries its spacing, as in Figma.
const BOX = `relative flex w-full cursor-text flex-row items-center whitespace-nowrap text-surface-gray-muted ${INPUT_FILL}`;
const CONTROL = `min-w-0 flex-1 self-stretch bg-transparent py-0 pr-0 ${INPUT_TEXT} ${INPUT_DISABLED_TEXT_ON_CONTROL}`;

// In an InputGroup the member draws the same frame it has alone — the
// group rounds the corners it holds — and overlaps its neighbours' by a
// pixel, so a shared edge shows whichever member is on top. The states
// are stacked for that: focus over error over hover over rest, as z-index
// steps inside the group's isolated context. A raised state carries a
// hover twin, since a plain `hover:` step would otherwise outrank it.
const FRAME = {
  solo: 'border-thin border-solid',
  grouped: 'border-thin border-solid',
};
const FOCUS = {
  solo: { focused: `z-5 ${INPUT_ACTIVE}`, blurred: INPUT_INACTIVE },
  grouped: {
    focused: `z-30 hover:z-30 ${INPUT_ACTIVE}`,
    blurred: `hover:z-10 ${INPUT_INACTIVE}`,
  },
};

/** The same field drawn on one element, per size: what a text area's control is. */
export function framedControl(size: Axis<'size'> = 'medium'): string {
  const look = SIZE[size];
  return `h-full w-full border-thin border-solid focus:z-5 ${look.framed} ${look.radius} ${look.text} ${INPUT_FILL} ${INPUT_TEXT} ${INPUT_INACTIVE} ${INPUT_ACTIVE_ON_FOCUS} ${INPUT_DISABLED_ON_CONTROL}`;
}
// Blade (baseInputTokens / baseInput.module.css): error is a thick negative
// border in every state, and focus keeps the same primary-muted ring; success
// keeps the gray border — only its hint line turns positive.
export const FRAMED_VALIDATION = {
  error:
    'z-1 !border-thick !border-interactive-negative-default focus:!border-interactive-negative-default',
  success: '',
};

export const resolveTextInput: TextInputStyleResolver<TextInputStyleProps> = (
  props: TextInputStyleProps = {},
) => {
  const look = SIZE[props.size ?? 'medium'];
  return {
    root: 'relative flex w-full flex-col',
    // No `w-full`: a width of its own would end the member a pixel short
    // of its cell, and its frame would sit beside the next one's instead
    // of under it. Stretched by the grid, it is the cell plus that pixel.
    grouped: 'relative flex min-w-0 flex-col',
    disabled: {
      root: 'pointer-events-none',
      box: INPUT_DISABLED_FILL,
      affix: INPUT_DISABLED_CONTENT,
    },
    box: `${BOX} ${look.box} ${look.text}`,
    // Inputs do not inherit letter-spacing: the control takes the type too.
    control: `${CONTROL} ${look.control} ${look.text} ${ALIGN[props.textAlign ?? 'left']}`,
    frame: { solo: `${FRAME.solo} ${look.radius}`, grouped: FRAME.grouped },
    focus: FOCUS,
    // Blade: error overrides the border (thick negative) in every state but
    // leaves the focus ring primary-muted; success keeps the gray border.
    validation: {
      solo: {
        error: 'z-1 !border-thick !border-interactive-negative-default',
        success: '',
      },
      grouped: {
        error: 'z-20 hover:z-20 !border-thick !border-interactive-negative-default',
        success: '',
      },
    },
    leading: {
      group: `flex shrink-0 flex-row items-center ${look.leading.group}`,
      icon: `flex shrink-0 items-center ${look.leading.icon}`,
      prefix: `flex shrink-0 items-center ${look.leading.prefix}`,
      slot: 'flex shrink-0 items-center',
    },
    trailing: {
      group: `flex shrink-0 flex-row items-center ${look.trailing.group}`,
      item: `flex shrink-0 items-center ${look.trailing.item}`,
    },
    iconSize: look.icon,
    clear: resolveIconButton({ size: 'medium' }).root,
    footer: 'flex items-start justify-between gap-2',
    counter: `ms-auto me-0.5 flex shrink-0 ${props.size === 'large' ? 'mt-2' : 'mt-1'}`,
  };
};
