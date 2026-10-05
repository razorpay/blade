import type {
  CardGroupItemState as ModelItemState,
  CardGroupValidationState,
} from '../../runes/card-group/card-group.svelte';
import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';
import { chevronDown } from '../icons';

export type { CardGroupValidationState };

// CardGroup's look is Blade React's Accordion (the component was cx's
// Accordion, renamed): the `Blade's …` notes below name React's parts.

/**
 * The parts CardGroup reads its classes by. Parts that share a property are
 * keyed on every state — `cx` resolves no conflicts.
 */
export interface CardGroupClasses {
  /** `class` from the caller lands here. */
  root: string;
  /** Wraps every item: the surface of `filled`. */
  items: string;
  invalid: string;
  /** Carries the divider after the item. */
  item: string;
  /** Blade's `role="heading"` wrapper around the button. */
  heading: string;
  /** The button. Its content is phrasing, never interactive. */
  header: string;
  headerState: Record<'expanded' | 'collapsed', string>;
  /** Lays the prefix or leading, the title block and the trailing out in a row. */
  headerRow: string;
  /**
   * Blade centres the row on the header, except with a subtitle, a number
   * prefix or a leading, which sit on the first line with the chevron.
   */
  headerRowAlign: Record<'center' | 'start', string>;
  /** Wraps the title and subtitle, or the `header` snippet replacing them. */
  headerContent: string;
  /** The `showNumberPrefix` number. */
  prefix: string;
  /** The `leading` box, on the first line; the prefix wins over it. */
  leading: string;
  /** A `title` string's type; a snippet sits in the same box. */
  title: string;
  subtitle: string;
  /** The hairline under an expanded header; hover and focus hide it. */
  headerDivider: string;
  /** Wraps the chevron, or the `trailing` snippet replacing it. */
  trailing: string;
  /** The wrapper's colour, which the chevron inherits; keyed so none clash. */
  trailingTone: Record<'expanded' | 'collapsed', string>;
  /** Turns the chevron per kind; a `trailing` snippet owns its own look. */
  chevronState: Record<'expanded' | 'collapsed' | 'go', string>;
  /**
   * The one chevron; `chevronState` turns it per kind (pointing right for
   * `go`, flipped when expanded) so a change of kind animates.
   */
  chevron: IconSource;
  /** Around the `content` snippet: Blade's AccordionItemBody box. `children` skip it. */
  body: string;
  /** How long the panel slides, in ms (Blade's `moderate`); 0 for none. */
  slide: number;
}

/** Style props in, the parts out. */
export type CardGroupStyleResolver<P> = (props: P) => CardGroupClasses;

/** The blade taxonomy as data. */
export const CARD_GROUP_AXES = {
  variant: ['transparent', 'filled'],
  size: ['large', 'medium'],
} as const;

type Axis<K extends keyof typeof CARD_GROUP_AXES> = AxisValue<typeof CARD_GROUP_AXES, K>;

/** Derived from CARD_GROUP_AXES: add a value there, never here. */
export interface CardGroupStyleProps {
  /**
   * `transparent`: items on the page, a divider after each. `filled`: one
   * raised surface, dividers between items.
   * @default 'transparent'
   */
  variant?: Axis<'variant'>;
  /**
   * The title's type, the header's line box and the number prefix; a
   * `header` or `title` snippet sizes its own text from `state.size`.
   * @default 'large'
   */
  size?: Axis<'size'>;
}

/** What every CardGroupItem snippet receives. */
export interface CardGroupItemState extends ModelItemState {
  size: Axis<'size'>;
  /** Closes the item if it is open: for the body's own actions ("Use this card"). */
  collapse: () => void;
}

/** What a CardGroup hands its items. */
export interface CardGroupShared {
  classes: CardGroupClasses;
  size: Axis<'size'>;
  showNumberPrefix: boolean;
  scrollOnExpand: boolean;
  testID: string | undefined;
}

const DIVIDER = 'border-solid border-surface-gray-muted';

const VARIANT: Record<
  Axis<'variant'>,
  { items: string; item: string; header: string; collapsed: string }
> = {
  transparent: {
    items: 'flex w-full flex-col',
    // Blade draws a divider after every item, the last one included.
    item: `border-b-thin ${DIVIDER}`,
    header: '',
    collapsed: '',
  },
  filled: {
    // Blade's surface: 12px radius, the raised card shadow with its 1px rim.
    items: 'flex w-full flex-col rounded-medium bg-surface-gray-intense surface-raised',
    item: `[&+&]:border-t-thin ${DIVIDER}`,
    // The hover fill follows the box's corners: the first header's top, the
    // last header's bottom while it is collapsed.
    header: 'group-first/item:rounded-tl-medium group-first/item:rounded-tr-medium',
    collapsed: 'group-last/item:rounded-bl-medium group-last/item:rounded-br-medium',
  },
};

// The header's first line: Blade centres the prefix and the chevron on it.
const LINE: Record<Axis<'size'>, string> = {
  large: 'h-7',
  medium: 'h-5',
};

// Blade's title: Text large or medium, and the number prefix with it.
const TITLE_TEXT: Record<Axis<'size'>, string> = {
  large: 'text-200 leading-200 tracking-25',
  medium: 'text-100 leading-100 tracking-50',
};

// Blade caps a leading at 32px, 24px at medium.
const LEADING_MAX: Record<Axis<'size'>, string> = {
  large: 'max-w-8 max-h-8',
  medium: 'max-w-6 max-h-6',
};

// Title and subtitle grey out with the (disabled) header button, the group.
const DISABLED_TEXT = 'group-disabled:text-surface-gray-disabled';

// Blade motion: the header's fill in 2xquick, the chevron and the panel in
// moderate, both on the standard easing.
const TURN = 'transition-transform duration-moderate ease-standard motion-reduce:transition-none';

export const resolveCardGroup: CardGroupStyleResolver<CardGroupStyleProps> = (
  props: CardGroupStyleProps = {},
) => {
  const { variant = 'transparent', size = 'large' } = props;
  const look = VARIANT[variant];
  const line = `flex shrink-0 items-center justify-center ${LINE[size]}`;
  return {
    root: 'flex w-full flex-col',
    items: look.items,
    invalid: 'outline-solid outline-thin outline-feedback-negative-intense',
    item: `group/item flex flex-col ${look.item}`,
    heading: 'w-full',
    header: `group relative flex w-full cursor-pointer border-none bg-transparent p-0 text-start [transition-property:background-color,box-shadow,border-radius,color] duration-2xquick ease-standard hover:bg-interactive-gray-faded focus-visible:bg-interactive-gray-faded focus-visible:z-1 focus-visible:rounded-small focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted disabled:cursor-not-allowed disabled:text-surface-gray-disabled ${look.header}`,
    // Blade's header box: 16px in from the sides and 16px above and below.
    headerState: { expanded: '', collapsed: look.collapsed },
    headerRow: 'flex w-full select-none px-4 py-4',
    headerRowAlign: { center: 'items-center', start: 'items-start' },
    // Blade nudges the title 1px down and the number 1px up.
    headerContent: 'flex min-w-0 flex-1 flex-col pr-4 pt-px',
    prefix: `${line} -mt-px mr-2 font-semibold text-surface-gray-normal ${TITLE_TEXT[size]}`,
    leading: `${line} mr-2 overflow-hidden ${LEADING_MAX[size]}`,
    title: `font-semibold [word-break:break-word] text-surface-gray-normal ${DISABLED_TEXT} ${TITLE_TEXT[size]}`,
    // Small whatever the card group's size, as in Blade.
    subtitle: `text-75 leading-75 tracking-50 text-surface-gray-muted ${DISABLED_TEXT}`,
    headerDivider: `pointer-events-none absolute inset-x-0 bottom-0 border-b-thinner ${DIVIDER} transition-opacity duration-2xquick ease-standard group-hover:opacity-0 group-focus-visible:opacity-0`,
    trailing: line,
    // The chevron takes the button's colour: gray-muted, gray-subtle while
    // hovered, focused or expanded, gray-disabled on a disabled header.
    trailingTone: {
      collapsed:
        'icon-interactive-gray-muted group-hover:icon-interactive-gray-subtle group-focus-visible:icon-interactive-gray-subtle group-disabled:icon-interactive-gray-disabled',
      expanded: 'icon-interactive-gray-subtle group-disabled:icon-interactive-gray-disabled',
    },
    chevronState: {
      expanded: `-rotate-180 ${TURN}`,
      collapsed: `rotate-0 ${TURN}`,
      go: `-rotate-90 ${TURN}`,
    },
    chevron: chevronDown,
    // Blade's AccordionItemBody: 12px under the header, 16px in and below.
    body: 'mx-4 mb-4 mt-3 flex flex-col gap-4',
    slide: 280,
  };
};
