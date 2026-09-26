import type { Snippet } from 'svelte';
import type { TabsPick } from '../../runes/tabs/tabs.svelte';
import type { AxisValue } from '../../axes';

/**
 * The parts Tabs reads its classes by. The picked tab is keyed from JS
 * (`cx` resolves no conflicts); focus rides the variant grammar.
 */
export interface TabsClasses {
  root: string;
  /** The tablist. */
  list: string;
  tab: string;
  pick: Record<'picked' | 'unpicked', string>;
  /** A disabled tab: used in place of `pick`. */
  disabled: string;
  panel: string;
}

/** Style props in, the parts out. */
export type TabsStyleResolver<P> = (props: P) => TabsClasses;

export type { TabsPick };

/** The tabs rendered inside the tablist, plus the sliding underline. */
export type TabsListSnippet<P> = Snippet<[P, Snippet, TabsPick]>;

/** The blade taxonomy as data. */
export const TABS_AXES = {
  /** `fill`: equal tabs across the row, and the underline slides. */
  layout: ['auto', 'fill'],
  size: ['medium', 'large'],
} as const;

type Axis<K extends keyof typeof TABS_AXES> = AxisValue<typeof TABS_AXES, K>;

/** Derived from TABS_AXES: add a value there, never here. */
export interface TabsStyleProps {
  layout?: Axis<'layout'>;
  size?: Axis<'size'>;
}

const SIZE: Record<Axis<'size'>, string> = {
  medium: 'px-3 py-2 text-100 leading-100',
  large: 'px-4 py-3 text-200 leading-200',
};

// Blade's tab (tabs.module.css): transparent, its focus ring Blade's 4px
// primary-muted ring drawn inside it.
const TAB =
  'relative -mb-px cursor-pointer whitespace-nowrap border-b-thicker border-solid bg-transparent font-text font-medium outline-none transition-colors focus-visible:shadow-focus-inset';

// Blade's bordered tabs. With `fill` the picked tab carries no underline of
// its own — the sliding one is it — so the two are never drawn together.
export const resolveTabs: TabsStyleResolver<TabsStyleProps> = (props) => {
  const { layout = 'auto', size = 'medium' } = props;
  const isFill = layout === 'fill';
  return {
    root: 'flex w-full flex-col',
    list: 'relative flex border-b-thin border-solid border-surface-gray-muted',
    tab: `${TAB} ${SIZE[size]} ${isFill ? 'min-w-0 flex-1 text-center' : ''}`.trim(),
    // Blade: selected gray-normal text on the neutral-highlighted indicator;
    // unselected gray-muted, going gray-subtle with a gray-highlighted
    // underline on hover and the gray fill while focused.
    pick: {
      picked: isFill
        ? 'border-transparent text-interactive-gray-normal'
        : 'border-interactive-neutral-highlighted text-interactive-gray-normal',
      unpicked:
        'border-transparent text-interactive-gray-muted hover:text-interactive-gray-subtle hover:border-interactive-gray-highlighted focus-visible:border-transparent focus-visible:bg-interactive-gray-default',
    },
    disabled: 'pointer-events-none border-transparent text-interactive-gray-disabled',
    panel: 'pt-4 outline-none',
  };
};
