import type { AxisValue } from '../../axes';
import type { IconStyleProps } from '../icon/styles';

/**
 * The parts Tabs, TabItem and TabPanel read their classes by. The picked
 * tab is keyed from JS (`cx` resolves no conflicts); focus and hover ride
 * the variant grammar. The indicator is placed from the rune's measure of
 * the picked tab (`--tab-x`, `--tab-y`, `--tab-w`, `--tab-h`).
 */
/** What a TabItem's snippets (`children`, `trailing`) receive. */
export interface TabItemState {
  isSelected: boolean;
  isDisabled: boolean;
}

export interface TabsClasses {
  root: string;
  /** The tablist's positioned box: scrolls, holds the indicator and the track line. */
  listBox: string;
  /** The tablist. */
  list: string;
  tab: string;
  /** Applied to a tab per state; `disabled` in place of the other two. */
  tabState: Record<'picked' | 'unpicked' | 'disabled', string>;
  /** The label text. */
  label: string;
  /** The glyph before the label. */
  icon: IconStyleProps;
  /** The box a `leading` asset sits in: the icon's size. */
  leading: string;
  /** The picked tab's marker; absent when the tab fills itself (filled, vertical). */
  indicator?: string;
  panel: string;
}

/** Style props in, the parts out. */
export type TabsStyleResolver<P> = (props: P) => TabsClasses;

/** The blade taxonomy as data. */
export const TABS_AXES = {
  variant: ['bordered', 'borderless', 'filled'],
  size: ['small', 'medium', 'large'],
  orientation: ['horizontal', 'vertical'],
} as const;

type Axis<K extends keyof typeof TABS_AXES> = AxisValue<typeof TABS_AXES, K>;

/** Derived from TABS_AXES: add a value there, never here. */
export interface TabsStyleProps {
  /** @default 'bordered' */
  variant?: Axis<'variant'>;
  /** @default 'medium' */
  size?: Axis<'size'>;
  /** @default 'horizontal' */
  orientation?: Axis<'orientation'>;
  /** Horizontal bordered tabs share the row equally (filled tabs always do). @default false */
  isFullWidthTabItem?: boolean;
}

type Size = Axis<'size'>;

// A per-size map, checked to name every size (in place of `satisfies`,
// which the repo's prettier cannot parse yet).
const bySize = (map: Record<Size, string>): Record<Size, string> => map;

// Blade's TabItem (tabTokens.ts, and Blade DSL's _Tabs/ Tab Item in Figma):
// the label body medium (large at large), medium weight, letter-spaced; the
// leading item (an icon, or an asset in its 16px box, 20px at large) and the
// trailing item each 8px from the label — one flat row with one gap; colours per state — picked `interactive.text.gray.normal`,
// unpicked `…muted`, `…subtle` on hover, disabled greyed; everything moves
// at gentle/standard. Focus is the inset 4px `surface.border.primary.muted`
// ring over the `interactive.background.gray.default` fill.
const TAB =
  'relative flex shrink-0 flex-row cursor-pointer items-center gap-2 whitespace-nowrap font-blade-text font-blade-medium outline-none transition-all duration-gentle ease-standard focus-visible:shadow-focus-inset disabled:cursor-not-allowed';
const LABEL: Record<Size, string> = {
  small: 'text-100 leading-100 tracking-50',
  medium: 'text-100 leading-100 tracking-50',
  large: 'text-200 leading-200 tracking-25',
};
const ICON: Record<Size, IconStyleProps> = {
  small: { size: 'medium' },
  medium: { size: 'medium' },
  large: { size: 'large' },
};
const LEADING: Record<Size, string> = {
  small: 'flex shrink-0 items-center justify-center w-4 h-4',
  medium: 'flex shrink-0 items-center justify-center w-4 h-4',
  large: 'flex shrink-0 items-center justify-center w-5 h-5',
};
// Each state names its own fill: `cx` resolves no conflicts, so the base
// sets none (the preflight already zeroes the button's border).
const TEXT = {
  picked: 'text-interactive-gray-normal',
  unpicked:
    'text-interactive-gray-muted hover:text-interactive-gray-subtle focus-visible:text-interactive-gray-subtle',
  disabled: 'bg-transparent text-interactive-gray-disabled',
};

// Bordered and borderless: no fill; a 2px bottom edge (1.5px left edge when
// vertical) that turns `interactive.border.gray.highlighted` on an unpicked
// tab's hover; the picked tab is marked by the sliding indicator in
// `interactive.border.neutral.highlighted`. Bordered adds the
// `surface.border.gray.muted` track under the row (beside the column).
// Blade DSL's Tabs (Figma) spaces horizontal tabs per size, not per
// breakpoint: 24px at small, 32px at medium and large.
const BORDERED = {
  horizontal: {
    list: bySize({ small: 'flex gap-6', medium: 'flex gap-8', large: 'flex gap-8' }),
    tab:
      'border-b-thicker border-solid border-transparent px-0 focus-visible:border-transparent focus-visible:rounded-medium focus-visible:bg-interactive-gray-default',
    pad: bySize({
      small: 'pt-0 pb-2',
      medium: 'pt-1 pb-3',
      large: 'py-3',
    }),
    hover: 'hover:border-interactive-gray-highlighted',
    indicator:
      'pointer-events-none absolute left-0 bottom-0 h-0.5 w-[var(--tab-w)] translate-x-[var(--tab-x)] bg-interactive-neutral-highlighted',
    track: 'border-b-thin border-solid border-surface-gray-muted',
  },
  vertical: {
    list: bySize({
      small: 'flex flex-col items-start',
      medium: 'flex flex-col items-start',
      large: 'flex flex-col items-start',
    }),
    tab:
      'w-full border-l-thick border-solid border-transparent px-3 focus-visible:rounded-medium focus-visible:bg-interactive-gray-default',
    pad: bySize({
      small: 'py-0.5',
      medium: 'py-1',
      large: 'py-2',
    }),
    hover: '',
    indicator:
      'pointer-events-none absolute left-0 top-0 w-[1.5px] h-[var(--tab-h)] translate-y-[var(--tab-y)] bg-interactive-neutral-highlighted',
    track: 'border-l-thin border-solid border-surface-gray-muted',
  },
};

// Filled: the row on `interactive.background.gray.faded`, 4px in (2px at
// small, horizontal), 8px round (12px from medium); tabs share it, round at
// 8px (6px at small), `interactive.background.gray.default` on an unpicked
// tab's hover. Horizontal, a `surface.background.gray.intense` pill slides
// under the picked tab; vertical, the picked tab fills itself.
const FILLED = {
  horizontal: {
    list: bySize({
      small: 'flex gap-0.5 rounded-small p-0.5',
      medium: 'flex gap-0.5 rounded-medium p-1',
      large: 'flex gap-0.5 rounded-medium p-1',
    }),
    tab: bySize({
      small: 'z-1 min-w-0 flex-1 justify-center [border-radius:6px] px-2 py-0.5',
      medium: 'z-1 min-w-0 flex-1 justify-center rounded-small px-2 py-1',
      large: 'z-1 min-w-0 flex-1 justify-center rounded-small p-2',
    }),
    indicator: bySize({
      small: '[border-radius:6px]',
      medium: 'rounded-small',
      large: 'rounded-small',
    }),
  },
  vertical: {
    list: 'flex flex-col rounded-medium p-1',
    tab: bySize({
      small: 'w-full rounded-small px-3 py-2',
      medium: 'w-full rounded-small p-3',
      large: 'w-full rounded-small p-3',
    }),
  },
};
const FILLED_PILL =
  'pointer-events-none absolute left-0 top-0 w-[var(--tab-w)] h-[var(--tab-h)] translate-x-[var(--tab-x)] translate-y-[var(--tab-y)] bg-surface-gray-intense';
const MOTION = 'transition-all duration-moderate ease-standard motion-reduce:transition-none';

export const resolveTabs: TabsStyleResolver<TabsStyleProps> = (props = {}) => {
  const {
    variant = 'bordered',
    size = 'medium',
    orientation = 'horizontal',
    isFullWidthTabItem = false,
  } = props;
  const isVertical = orientation === 'vertical';
  const base = {
    root: isVertical ? 'flex w-full flex-row' : 'flex w-full flex-col',
    label: LABEL[size],
    icon: ICON[size],
    leading: LEADING[size],
    panel: 'min-w-0 flex-1 outline-none',
  };

  if (variant === 'filled') {
    const isCompact = size === 'small' && !isVertical;
    const listBox = `relative shrink-0 bg-interactive-gray-faded ${
      isCompact ? 'rounded-small' : 'rounded-medium'
    } ${isVertical ? '' : 'overflow-x-auto'}`;
    const unpicked = `${TEXT.unpicked} bg-transparent hover:bg-interactive-gray-default focus-visible:bg-interactive-gray-default`;
    if (isVertical) {
      return {
        ...base,
        listBox,
        list: FILLED.vertical.list,
        tab: `${TAB} ${FILLED.vertical.tab[size]} focus-visible:rounded-small`,
        tabState: {
          picked: `${TEXT.picked} bg-surface-gray-intense`,
          unpicked,
          disabled: TEXT.disabled,
        },
      };
    }
    return {
      ...base,
      listBox,
      list: FILLED.horizontal.list[size],
      tab: `${TAB} ${FILLED.horizontal.tab[size]} focus-visible:rounded-small`,
      tabState: { picked: `${TEXT.picked} bg-transparent`, unpicked, disabled: TEXT.disabled },
      indicator: `${FILLED_PILL} ${FILLED.horizontal.indicator[size]} ${MOTION}`,
    };
  }

  const axis = BORDERED[orientation];
  const track = variant === 'bordered' ? axis.track : '';
  return {
    ...base,
    listBox: `relative shrink-0 ${isVertical ? '' : 'overflow-x-auto'} ${track}`.trim(),
    list: axis.list[size],
    tab: `${TAB} ${axis.tab} ${axis.pad[size]} ${
      isFullWidthTabItem && !isVertical ? 'min-w-0 flex-1 justify-center' : ''
    }`.trim(),
    tabState: {
      picked: `${TEXT.picked} bg-transparent`,
      unpicked: `${TEXT.unpicked} bg-transparent ${axis.hover}`.trim(),
      disabled: TEXT.disabled,
    },
    indicator: `${axis.indicator} ${MOTION}`,
  };
};
