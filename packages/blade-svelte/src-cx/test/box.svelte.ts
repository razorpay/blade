export interface Box<T> {
  value: T;
}

/** A reactive input for a rune under test: read through a getter, set to change. */
export function box<T>(initial: T): Box<T> {
  let value = $state(initial);
  return {
    get value() {
      return value;
    },
    set value(next) {
      value = next;
    },
  };
}
