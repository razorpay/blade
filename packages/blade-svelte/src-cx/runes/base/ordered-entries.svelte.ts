/** Anything a parent reads back in document order: an item, a header, a tab. */
export interface OrderedEntry {
  /** Its element once mounted: orders the entries and takes focus. */
  getElement(): HTMLElement | undefined;
}

export interface OrderedEntries<E extends OrderedEntry> {
  /** Adds an entry; returns its unregister. */
  register(entry: E): () => void;
  /** An entry mounted or moved: re-read document order. */
  reorder(): void;
  /** The entries in document order. Tracked. */
  readonly ordered: readonly E[];
  /** An entry's position in document order; -1 when unregistered. Tracked. */
  indexOf(entry: E): number;
}

// `compareDocumentPosition`: the other node precedes this one.
const PRECEDING = 2;

/**
 * Children that register with their parent, read back in document order —
 * not mount order: an entry mounted later may sit before an earlier one.
 * Before mount (and on native) mount order it is. What lets a list hold
 * anything between its entries: only entries register.
 */
export function createOrderedEntries<
  E extends OrderedEntry,
>(): OrderedEntries<E> {
  // A plain array in mount order; `version` tells readers it changed. It is
  // written from a plain counter, never `+=`: registering and mounting run
  // inside effects, and reading `version` there would make them loop.
  const entries: E[] = [];
  let changes = 0;
  let version = $state(0);
  const bump = () => {
    changes += 1;
    version = changes;
  };
  const ordered = $derived.by(() => {
    void version;
    return [...entries].sort((a, b) => {
      const one = a.getElement();
      const two = b.getElement();
      if (!one?.compareDocumentPosition || !two) {
        return 0;
      }
      return one.compareDocumentPosition(two) & PRECEDING ? 1 : -1;
    });
  });

  return {
    register(entry) {
      entries.push(entry);
      bump();
      return () => {
        const at = entries.indexOf(entry);
        if (at >= 0) {
          entries.splice(at, 1);
          bump();
        }
      };
    },
    reorder: bump,
    get ordered() {
      return ordered;
    },
    indexOf: (entry) => ordered.indexOf(entry),
  };
}
