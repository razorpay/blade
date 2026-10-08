import type { ChipGroupValidationState } from '../../runes/chip/group.svelte';
import type { AxisValue } from '../../axes';
import type { FieldSize } from '../shared/field';

export type { ChipGroupValidationState };

/** The blade taxonomy as data. */
export const CHIP_GROUP_AXES = {
  size: ['xsmall', 'small', 'medium', 'large'],
  color: ['primary', 'positive', 'negative'],
} as const;

type Axis<K extends keyof typeof CHIP_GROUP_AXES> = AxisValue<typeof CHIP_GROUP_AXES, K>;

export type ChipSize = Axis<'size'>;
export type ChipColor = Axis<'color'>;

/** Derived from CHIP_GROUP_AXES: add a value there, never here. */
export interface ChipGroupStyleProps {
  /** Every chip's size. @default 'small' */
  size?: ChipSize;
  /** The picked chips' colour; a Chip's own `color` wins. @default 'primary' */
  color?: ChipColor;
}

/** What a ChipGroup hands its Chips. */
export interface ChipShared {
  size: ChipSize;
  color: ChipColor;
}

/** A chip's look: picked or not, enabled or not, in its colour. */
export type ChipTone = 'unchecked' | 'checked' | 'uncheckedDisabled' | 'checkedDisabled';

export interface ChipClasses {
  root: string;
  label: string;
  labelDisabled: string;
  /** The hidden input: the `peer` the frame's focus ring reads. */
  control: string;
  /** Blade's AnimatedChip: the outer border, scaled while pressed. */
  frame: string;
  framePressed: string;
  /** Blade's StyledChipWrapper: the fill and the inner border. */
  inner: string;
  icon: string;
  text: string;
  /** Icon, per the Icon component's sizes. */
  iconSize: 'small' | 'medium' | 'large';
}

export interface ChipGroupClasses {
  root: string;
  chips: string;
  /** The FieldLabel's and FieldHint's size: one step up from the chips. */
  fieldSize: FieldSize;
}

// Blade's Chip (blade-core Chip/chip.module.css, chip.ts; chipTokens.ts).
// Per size: height, side padding, radius (the inner one 1px less), the
// inner border's width, the text and the icon.
// Blade DSL's _Chip (Figma) sets the large label in Heading/MediumRegular —
// the heading face at 20/26 — and the smaller ones in body type.
const SIZE: Record<
  ChipSize,
  {
    radius: string;
    inner: string;
    text: string;
    icon: ChipClasses['iconSize'];
  }
> = {
  xsmall: {
    radius: 'rounded-small',
    inner: 'h-6 px-2 border-thinner [border-radius:7px]',
    text: 'font-sans font-normal text-75 leading-75 tracking-50',
    icon: 'small',
  },
  small: {
    radius: 'rounded-small',
    inner: 'h-7 px-2 border-thinner [border-radius:7px]',
    text: 'font-sans font-normal text-100 leading-100 tracking-50',
    icon: 'small',
  },
  medium: {
    radius: 'rounded-small',
    inner: 'h-9 px-3 border-thin [border-radius:7px]',
    text: 'font-sans font-normal text-200 leading-200 tracking-25',
    icon: 'medium',
  },
  large: {
    radius: 'rounded-medium',
    inner: 'h-12 px-4 border-thin [border-radius:11px]',
    text: 'font-heading font-normal text-400 leading-400 tracking-100',
    icon: 'large',
  },
};

// Colours per tone × colour (chipColorTokens): the frame's border, the
// inner fill and border (hover a step up), and the text and icon.
const TONE: Record<
  ChipTone,
  Record<ChipColor, { frame: string; inner: string; content: string }>
> = {
  unchecked: {
    primary: uncheckedLook(),
    positive: uncheckedLook(),
    negative: uncheckedLook(),
  },
  checked: {
    primary: checkedLook('primary'),
    positive: checkedLook('positive'),
    negative: checkedLook('negative'),
  },
  uncheckedDisabled: {
    primary: uncheckedDisabledLook(),
    positive: uncheckedDisabledLook(),
    negative: uncheckedDisabledLook(),
  },
  checkedDisabled: {
    primary: checkedDisabledLook('primary'),
    positive: checkedDisabledLook('positive'),
    negative: checkedDisabledLook('negative'),
  },
};

function uncheckedLook(): { frame: string; inner: string; content: string } {
  return {
    frame: 'border-interactive-gray-faded',
    inner: 'border-transparent bg-surface-gray-intense hover:bg-interactive-gray-faded',
    content: 'text-interactive-gray-subtle icon-interactive-gray-subtle',
  };
}

function checkedLook(color: ChipColor): { frame: string; inner: string; content: string } {
  const frame = {
    primary: 'border-interactive-primary-default',
    positive: 'border-interactive-positive-default',
    negative: 'border-interactive-negative-default',
  }[color];
  const inner = {
    primary:
      'border-interactive-primary-default bg-interactive-primary-faded hover:bg-interactive-primary-faded-highlighted',
    positive:
      'border-interactive-positive-default bg-interactive-positive-faded hover:bg-interactive-positive-faded-highlighted',
    negative:
      'border-interactive-negative-default bg-interactive-negative-faded hover:bg-interactive-negative-faded-highlighted',
  }[color];
  const content = {
    primary: 'text-interactive-primary-normal icon-interactive-primary-normal',
    positive: 'text-interactive-positive-normal icon-interactive-positive-normal',
    negative: 'text-interactive-negative-normal icon-interactive-negative-normal',
  }[color];
  return { frame, inner, content };
}

function uncheckedDisabledLook(): { frame: string; inner: string; content: string } {
  return {
    frame: 'border-interactive-gray-disabled',
    inner: 'pointer-events-none border-transparent bg-transparent',
    content: 'text-interactive-gray-disabled icon-interactive-gray-disabled',
  };
}

function checkedDisabledLook(color: ChipColor): { frame: string; inner: string; content: string } {
  const frame = {
    primary: 'border-interactive-primary-disabled',
    positive: 'border-interactive-positive-disabled',
    negative: 'border-interactive-negative-disabled',
  }[color];
  const inner = {
    primary:
      'pointer-events-none border-interactive-primary-disabled bg-interactive-primary-disabled',
    positive:
      'pointer-events-none border-interactive-positive-disabled bg-interactive-positive-disabled',
    negative:
      'pointer-events-none border-interactive-negative-disabled bg-interactive-negative-disabled',
  }[color];
  return {
    frame,
    inner,
    content: 'text-interactive-gray-disabled icon-interactive-gray-disabled',
  };
}

/** One chip's parts for its size, tone and colour. */
export function resolveChip(size: ChipSize, tone: ChipTone, color: ChipColor): ChipClasses {
  const look = SIZE[size];
  const colors = TONE[tone][color];
  return {
    root: 'inline-flex',
    // Blade's SelectorLabel: 2px above and below, as on Checkbox.
    label: 'relative my-0.5 flex w-full cursor-pointer',
    labelDisabled: 'cursor-not-allowed',
    control: 'peer sr-only',
    // The ring is Blade's: 2px of `interactive.border.primary.default`, 2px
    // off the chip. Max widths per Blade: 280px on phones, 420px above.
    frame: `flex w-full items-center justify-center text-left border-thin border-solid bg-transparent [transition-property:transform] duration-xquick ease-standard max-w-[280px] d:max-w-[420px] peer-focus-visible:outline-solid peer-focus-visible:outline-thicker peer-focus-visible:outline-offset-2 peer-focus-visible:outline-interactive-primary-default ${look.radius} ${colors.frame}`,
    framePressed: 'scale-[.92]',
    inner: `flex w-full flex-row items-center justify-center overflow-hidden whitespace-nowrap border-solid transition-colors duration-xquick ease-standard ${look.inner} ${colors.inner} ${colors.content}`,
    icon: 'flex',
    // The label container's 4px each side: the gap after a leading icon or
    // slot, and the text's own inset when there is none.
    text: `truncate px-1 ${look.text}`,
    iconSize: look.icon,
  };
}

// Blade's ChipGroup (ChipGroup.tsx, blade-core Chip/chipGroup.module.css):
// the label above (cx labels are always on top), the chips wrapping with a
// gap per size and the same gap under them, then the hint. Label and hint
// take the FormLabel / FormHint size one step up from the chips
// (`chipGroupLabelSizeTokens`), drawn by the shared FieldLabel and
// FieldHint.
const GROUP_SIZE: Record<ChipSize, { chips: string; field: FieldSize }> = {
  xsmall: {
    chips: 'gap-x-2 gap-y-2 mb-2',
    field: 'small',
  },
  small: {
    chips: 'gap-x-2 gap-y-2 mb-2',
    field: 'medium',
  },
  medium: {
    chips: 'gap-x-2 gap-y-3 mb-3',
    field: 'large',
  },
  large: {
    chips: 'gap-x-2 gap-y-3 mb-3',
    field: 'large',
  },
};

export function resolveChipGroup(props: ChipGroupStyleProps = {}): ChipGroupClasses {
  const { size = 'small' } = props;
  const look = GROUP_SIZE[size];
  return {
    root: 'flex flex-col',
    chips: `flex flex-row flex-wrap ${look.chips}`,
    fieldSize: look.field,
  };
}
