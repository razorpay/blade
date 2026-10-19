/** One titled section of a list's options, as data. */
export interface CardGroupDataSection<T> {
  /** Identifies the section; keys its heading. */
  key: string;
  /** The heading over the section's options. */
  title: string;
  items: readonly T[];
}

/** A row's place in its section's box: what a boxed look frames it by. */
export type RowFrame = 'only' | 'first' | 'middle' | 'last';

/** One row of a list laid out flat: a section's heading, or an option. */
export type LayoutRow<T> =
  | { kind: 'title'; key: string; title: string; isFirst: boolean }
  | { kind: 'option'; key: string; option: T; index: number; frame?: RowFrame };

export interface DataRows<T> {
  /** Headings and options, in order: what a virtual window mounts a slice of. */
  rows: LayoutRow<T>[];
  /** One key per row. */
  keys: string[];
  /** The options alone, in order: what the list holds as its items. */
  options: T[];
  /** Each option's row, by its index among the options. */
  rowOf: number[];
}

/**
 * The key of an option: the caller's `itemKey`, else a string or number
 * itself, else its place (an object with no key keeps no measured size
 * across a search).
 */
export function optionKey<T>(
  itemKey: ((item: T) => string) | undefined,
  item: T,
  index: number,
): string {
  if (itemKey) {
    return itemKey(item);
  }
  return typeof item === 'string' || typeof item === 'number' ? String(item) : `#${index}`;
}

/**
 * A list's options flat, with a heading row before each section's: what a
 * virtual window mounts, since it measures rows one by one. A section with
 * no options is left out. Headings are keyed apart from the options, whose
 * keys are the caller's.
 */
export function layoutDataRows<T>(
  items: readonly T[] | undefined,
  sections: readonly CardGroupDataSection<T>[] | undefined,
  itemKey?: (item: T) => string,
): DataRows<T> {
  const rows: LayoutRow<T>[] = [];
  const options: T[] = [];
  const rowOf: number[] = [];
  const add = (option: T, frame?: RowFrame): void => {
    rowOf.push(rows.length);
    rows.push({
      kind: 'option',
      key: optionKey(itemKey, option, options.length),
      option,
      index: options.length,
      frame,
    });
    options.push(option);
  };
  if (sections) {
    for (const section of sections) {
      const count = section.items.length;
      if (count === 0) {
        continue;
      }
      rows.push({
        kind: 'title',
        key: `§${section.key}`,
        title: section.title,
        isFirst: rows.length === 0,
      });
      section.items.forEach((option, at) =>
        add(
          option,
          count === 1 ? 'only' : at === 0 ? 'first' : at === count - 1 ? 'last' : 'middle',
        ),
      );
    }
  } else {
    (items ?? []).forEach((option) => add(option));
  }
  return { rows, keys: rows.map((row) => row.key), options, rowOf };
}

/**
 * The row a window opens at for the option Tab enters at — its section's
 * heading when the option heads the section, so the heading is not
 * scrolled just out of view. -1 for the top.
 */
export function openingRow<T>(layout: DataRows<T>, option: number): number {
  const row = layout.rowOf[option] ?? -1;
  return row > 0 && layout.rows[row - 1]?.kind === 'title' ? row - 1 : row;
}
