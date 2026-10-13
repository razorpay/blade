import { untrack } from 'svelte';
import { defineContext } from '../context';

/** A live count that mounted parts add themselves to while they hold. */
export interface Tally {
  readonly count: number;
  /** Counts one; the returned function uncounts it. */
  add(): () => void;
}

/** Call during component initialisation. */
export function createTally(): Tally {
  let count = $state(0);
  return {
    get count() {
      return count;
    },
    // Untracked: an effect that adds must not depend on the count it moves.
    add() {
      untrack(() => (count += 1));
      return () => untrack(() => (count -= 1));
    },
  };
}

/** One row, as a search sees it. */
export interface OptionSearchItem<T> {
  title: string;
  value: T;
}

/** The default match: the text holds the query, ignoring case and outer spaces. */
export function textMatches(text: string, query: string): boolean {
  const needle = query.trim().toLowerCase();
  return !needle || text.toLowerCase().includes(needle);
}

/**
 * What an OptionList offers the sections and rows inside it: the search,
 * and the tallies that let a section with no row left (and the list) step
 * aside. A VirtualOptionList provides none: its rows are data, filtered
 * before they are laid out.
 */
interface OptionListSearchContext {
  readonly isSearching: boolean;
  /** Whether a row passes the search; true without one. */
  matches(item: OptionSearchItem<unknown>): boolean;
  /** The rows drawn. */
  readonly shown: Tally;
  /** The sections mounted. */
  readonly sections: Tally;
}

interface OptionListSectionContext {
  /** The section's rows drawn. */
  readonly shown: Tally;
}

const SEARCH = defineContext<OptionListSearchContext>('blade-option-list-search');
const SECTION = defineContext<OptionListSectionContext>('blade-option-list-section');

export interface OptionListSearchOptions<T> {
  query: () => string;
  /** Replaces the title match. */
  filter: () => ((item: OptionSearchItem<T>, query: string) => boolean) | undefined;
}

export interface OptionListSearch {
  readonly isSearching: boolean;
  /** A search left no row. */
  readonly isEmpty: boolean;
  /** Any OptionListSection is mounted. */
  readonly hasSections: boolean;
}

/**
 * An OptionList's search over the OptionItems inside it, and its sections:
 * provided to them. Call during component initialisation.
 */
export function createOptionListSearch<T>(options: OptionListSearchOptions<T>): OptionListSearch {
  const shown = createTally();
  const sections = createTally();
  const isSearching = $derived(options.query().trim() !== '');
  SEARCH.set({
    get isSearching() {
      return isSearching;
    },
    matches(item) {
      const filter = options.filter();
      return filter
        ? filter(item as OptionSearchItem<T>, options.query())
        : textMatches(item.title, options.query());
    },
    shown,
    sections,
  });
  return {
    get isSearching() {
      return isSearching;
    },
    get isEmpty() {
      return isSearching && shown.count === 0;
    },
    get hasSections() {
      return sections.count > 0;
    },
  };
}

export interface OptionListSectionState {
  /** A search left the section no row: it steps aside, heading and all. */
  readonly isHidden: boolean;
}

/**
 * An OptionListSection: counts itself into the list (a boxed look splits
 * into one box per section) and its rows into itself. Its rows stay mounted
 * while it is hidden — they decide what passes. Call during component
 * initialisation.
 */
export function createOptionListSection(): OptionListSectionState {
  const search = SEARCH.get();
  const shown = createTally();
  SECTION.set({ shown });
  $effect.pre(() => search?.sections.add());
  return {
    get isHidden() {
      return Boolean(search?.isSearching) && shown.count === 0;
    },
  };
}

export interface OptionMatch {
  /** The row passes the list's search (always, without one): draw it. */
  readonly isShown: boolean;
}

/**
 * A row's place in its list's search: a row that fails it is not drawn — so
 * the keys skip it — and is not counted, so its section and the list know
 * when none is left. `item` returns `undefined` for a row that takes no part
 * (it is always drawn, never counted). Call during component initialisation.
 */
export function createOptionMatch(item: () => OptionSearchItem<unknown> | undefined): OptionMatch {
  const search = SEARCH.get();
  const section = SECTION.get();
  const isShown = $derived.by(() => {
    const row = item();
    return !search || !row || search.matches(row);
  });
  $effect.pre(() => {
    if (!isShown || !item()) {
      return undefined;
    }
    const uncountList = search?.shown.add();
    const uncountSection = section?.shown.add();
    return () => {
      uncountList?.();
      uncountSection?.();
    };
  });
  return {
    get isShown() {
      return isShown;
    },
  };
}

/**
 * A VirtualOptionList filters its data instead: it hides any search of a
 * list around it from its own rows. Call during component initialisation.
 */
export function clearOptionListSearch(): void {
  SEARCH.set(undefined);
  SECTION.set(undefined);
}
