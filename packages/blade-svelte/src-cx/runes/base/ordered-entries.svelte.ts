import type { Attachment } from 'svelte/attachments';

/** Anything a parent reads back in document order: an item, a header, a tab. */
export interface OrderedEntry {
  /** Its element once mounted: orders the entries and takes focus. */
  getElement(): HTMLElement | undefined;
}

/** What a parent offers the entries that register with it. */
export interface EntryHost<E extends OrderedEntry> {
  /** Adds an entry; returns its unregister. */
  register(entry: E): () => void;
  /** An entry mounted or moved: re-read document order. */
  reorder(): void;
  /** An entry's position in document order; -1 when unregistered. Tracked. */
  indexOf(entry: E): number;
}

export interface OrderedEntries<E extends OrderedEntry> extends EntryHost<E> {
  /** The entries in document order. Tracked. */
  readonly ordered: readonly E[];
}

// `compareDocumentPosition`: the other node precedes this one.
const PRECEDING = 2;

/**
 * Children that register with their parent, read back in document order —
 * not mount order: an entry mounted later may sit before an earlier one.
 * Before mount (and on native) mount order it is. What lets a list hold
 * anything between its entries: only entries register.
 */
export function createOrderedEntries<E extends OrderedEntry>(): OrderedEntries<E> {
  // A plain array in mount order; `version` tells readers it changed. It is
  // written from a plain counter, never `+=`: registering and mounting run
  // inside effects, and reading `version` there would make them loop.
  const entries: E[] = [];
  let changes = 0;
  let version = $state(0);
  const bump = (): void => {
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
      // eslint-disable-next-line no-bitwise -- compareDocumentPosition returns a bit mask
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

export interface RegisteredEntry<E extends OrderedEntry, N extends HTMLElement> {
  /** What the host holds: the fields given, and the element once attached. */
  readonly entry: E;
  /** The element, once attached. */
  readonly node: N | undefined;
  /** On the element: gives the entry its element and re-reads document order. */
  readonly attach: Attachment<N>;
  /** Takes the entry off its host: the component's `onDestroy`. */
  readonly unregister: () => void;
}

/**
 * One child's side of registration: the entry registers with its host now
 * — before mount, so an index is there for the first paint (and for SSR) —
 * and `attach` on its element orders it. Without a host (an item drawn on
 * its own) the entry is inert. Lifecycle-free like every state core: the
 * caller hands `unregister` to its `onDestroy`.
 */
export function registerEntry<E extends OrderedEntry, N extends HTMLElement = HTMLElement>(
  host: Pick<EntryHost<E>, 'register' | 'reorder'> | undefined,
  fields: Omit<E, 'getElement'>,
): RegisteredEntry<E, N> {
  let node: N | undefined;
  const entry = { ...fields, getElement: () => node } as E;
  const unregister = host?.register(entry) ?? (() => undefined);
  return {
    entry,
    unregister,
    get node() {
      return node;
    },
    attach(element) {
      node = element;
      host?.reorder();
      return () => {
        node = undefined;
      };
    },
  };
}
