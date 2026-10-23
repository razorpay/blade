import { untrack } from 'svelte';

/** What a header rendered inside an overlay draws. */
export interface HeaderParts {
  title: boolean;
  subtitle: boolean;
}

/**
 * A host's registry of the headers composed into it — an overlay's, a
 * card's: whether one is drawn (an overlay draws Blade's empty header
 * otherwise), and what labels the host: the title and subtitle ids the
 * header uses, so `aria-labelledby` and `aria-describedby` point at
 * elements that exist.
 */
export interface HeaderRegistry {
  readonly titleId: string;
  readonly subtitleId: string;
  readonly hasHeader: boolean;
  readonly hasTitle: boolean;
  readonly hasSubtitle: boolean;
  /** A header mounted: what it draws. The returned function unregisters it. */
  add(parts: HeaderParts): () => void;
}

/** Call during component initialisation (the host). */
export function createHeaderRegistry(id: string): HeaderRegistry {
  // Raw: an entry is found again by identity on unregister, and a deep
  // state array would hand back its proxy instead.
  let entries = $state.raw<readonly HeaderParts[]>([]);
  return {
    titleId: `${id}-title`,
    subtitleId: `${id}-subtitle`,
    get hasHeader() {
      return entries.length > 0;
    },
    get hasTitle() {
      return entries.some((entry) => entry.title);
    },
    get hasSubtitle() {
      return entries.some((entry) => entry.subtitle);
    },
    // Untracked: a header registers from an effect, which must not depend on
    // the list it changes.
    add(parts) {
      const entry = { ...parts };
      untrack(() => {
        entries = [...entries, entry];
      });
      return () =>
        untrack(() => {
          entries = entries.filter((other) => other !== entry);
        });
    },
  };
}
