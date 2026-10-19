import { untrack } from 'svelte';
import { defineContext } from '../context';

/** A live count that mounted parts add themselves to while they hold. */
interface Tally {
  readonly count: number;
  /** Counts one; the returned function uncounts it. */
  add(): () => void;
}

function createTally(): Tally {
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

const SECTIONS = defineContext<Tally>('blade-card-group-sections');

export interface CardGroupSections {
  /** Any CardGroupSection is mounted: a boxed look draws a box per section. */
  readonly hasSections: boolean;
}

/** A CardGroup's sections, counted as they mount. Call during component initialisation. */
export function provideCardGroupSections(): CardGroupSections {
  const sections = createTally();
  SECTIONS.set(sections);
  return {
    get hasSections() {
      return sections.count > 0;
    },
  };
}

/** A CardGroupSection counts itself into its list. Call during component initialisation. */
export function registerCardGroupSection(): void {
  const sections = SECTIONS.get();
  $effect.pre(() => sections?.add());
}
