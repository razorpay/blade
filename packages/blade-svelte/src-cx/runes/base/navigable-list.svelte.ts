import { PRESS_KEYS } from './keys';
import { defaultSchedule } from './schedule';
import type { Schedule } from './schedule';

export type MoveAction = 'first' | 'last' | 'prev' | 'next' | 'pageUp' | 'pageDown';

export type ListAction = MoveAction | 'select' | 'open' | 'close' | 'type';

export type Orientation = 'vertical' | 'horizontal' | 'both';

export interface KeyModifiers {
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
}

export interface NavigableListOptions<T> {
  items: () => readonly T[];
  isDisabled?: (item: T, index: number) => boolean;
  /** Wrap from last to first and back. Default false (listbox semantics). */
  loop?: boolean;
  orientation?: Orientation;
  /** Enables typeahead: the text a typed prefix is matched against. */
  typeahead?: (item: T) => string;
  pageSize?: number;
  typeaheadDelay?: number;
  schedule?: Schedule;
}

export interface NavigableListModel<T> {
  /** The row the keyboard is on; -1 for none. Tracked by whatever reads it. */
  activeIndex(): number;
  active(): T | undefined;
  setActive(index: number): void;
  clearActive(): void;
  move(action: MoveAction): void;
  /** Feed one typed character; moves to the matching item. */
  type(char: string): void;
  /** The action a key requests, or null when the key must flow through untouched. */
  keyAction(key: string, mods?: KeyModifiers): ListAction | null;
  enabledIndices(): number[];
}

const MOVE_KEYS: Record<string, MoveAction> = {
  Home: 'first',
  End: 'last',
  PageUp: 'pageUp',
  PageDown: 'pageDown',
};

const AXIS_KEYS: Record<Orientation, Record<string, MoveAction>> = {
  vertical: { ArrowDown: 'next', ArrowUp: 'prev' },
  horizontal: { ArrowRight: 'next', ArrowLeft: 'prev' },
  both: {
    ArrowDown: 'next',
    ArrowUp: 'prev',
    ArrowRight: 'next',
    ArrowLeft: 'prev',
  },
};

/**
 * The APG listbox / menu / tablist core: an active index moved over the enabled
 * items, a key → action table, and a typeahead buffer. Selection is not here:
 * `choice-list` adds a held one, `menu` a momentary one.
 */
export function createNavigableList<T>(options: NavigableListOptions<T>): NavigableListModel<T> {
  const orientation = options.orientation ?? 'vertical';
  const pageSize = options.pageSize ?? 10;
  const schedule = options.schedule ?? defaultSchedule;
  let activeIndex = $state(-1);
  let buffer = '';
  let cancelReset: (() => void) | undefined;

  function enabledIndices(): number[] {
    const out: number[] = [];
    options.items().forEach((item, index) => {
      if (!options.isDisabled?.(item, index)) {
        out.push(index);
      }
    });
    return out;
  }

  function setActive(index: number): void {
    const count = options.items().length;
    const next = index >= 0 && index < count ? index : -1;
    if (next !== activeIndex) {
      activeIndex = next;
    }
  }

  function move(action: MoveAction): void {
    const enabled = enabledIndices();
    if (!enabled.length) {
      return;
    }
    const last = enabled.length - 1;
    const pos = enabled.indexOf(activeIndex);
    let target: number;
    switch (action) {
      case 'first':
        target = 0;
        break;
      case 'last':
        target = last;
        break;
      case 'next':
        target = pos < 0 ? 0 : pos + 1;
        target = target > last ? (options.loop ? 0 : last) : target;
        break;
      case 'prev':
        target = pos < 0 ? last : pos - 1;
        target = target < 0 ? (options.loop ? last : 0) : target;
        break;
      case 'pageDown':
        target = Math.min(last, (pos < 0 ? 0 : pos) + pageSize);
        break;
      default:
        target = Math.max(0, (pos < 0 ? 0 : pos) - pageSize);
    }
    setActive(enabled[target]);
  }

  function matchIndex(): number {
    const label = options.typeahead;
    if (!label) {
      return -1;
    }
    const enabled = enabledIndices();
    const items = options.items();
    // Repeating one letter cycles through items starting with it.
    const sameLetter = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);
    const query = (sameLetter ? buffer[0] : buffer).toLowerCase();
    const start = enabled.indexOf(activeIndex);
    const order = [...enabled.slice(start + 1), ...enabled.slice(0, start + 1)];
    if (!sameLetter && start >= 0) {
      // A growing prefix may still match the current item.
      order.unshift(enabled[start]);
    }
    return order.find((i) => label(items[i]).toLowerCase().startsWith(query)) ?? -1;
  }

  function type(char: string): void {
    buffer += char;
    cancelReset?.();
    cancelReset = schedule(() => {
      buffer = '';
      cancelReset = undefined;
    }, options.typeaheadDelay ?? 500);
    const hit = matchIndex();
    if (hit >= 0) {
      setActive(hit);
    }
  }

  function keyAction(key: string, mods: KeyModifiers = {}): ListAction | null {
    if (mods.ctrl || mods.meta) {
      return null;
    }
    if (mods.alt) {
      return key === 'ArrowDown' ? 'open' : null;
    }
    const axis = AXIS_KEYS[orientation][key];
    if (axis) {
      return axis;
    }
    const jump = MOVE_KEYS[key];
    if (jump) {
      return jump;
    }
    if (PRESS_KEYS.has(key)) {
      return 'select';
    }
    // Returned even for a bare listbox with nothing to close; callers that
    // are not behind a disclosure just ignore it.
    if (key === 'Escape') {
      return 'close';
    }
    if (options.typeahead && key.length === 1) {
      return 'type';
    }
    return null;
  }

  return {
    activeIndex: () => activeIndex,
    active: () => options.items()[activeIndex],
    setActive,
    clearActive() {
      setActive(-1);
    },
    move,
    type,
    keyAction,
    enabledIndices,
  };
}

/**
 * The one key → method dispatch for a navigable list: moves and types on the
 * list, and hands `select` to the owner's `onSelect`. `open`/`close` are
 * returned untouched: only a disclosure owner can act on them. Returns the
 * action so the caller can cancel the event.
 */
export function dispatchListKey<T>(
  list: NavigableListModel<T>,
  key: string,
  mods: KeyModifiers | undefined,
  onSelect: () => void,
): ListAction | null {
  const action = list.keyAction(key, mods);
  switch (action) {
    case 'select':
      onSelect();
      break;
    case 'type':
      list.type(key);
      break;
    case 'open':
    case 'close':
    case null:
      break;
    default:
      list.move(action);
  }
  return action;
}
