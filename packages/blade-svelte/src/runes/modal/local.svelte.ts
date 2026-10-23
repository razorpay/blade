export interface LocalOverlay<P, R> {
  /** The props of what is open; undefined while closed. Reactive. */
  readonly props: P | undefined;
  readonly isOpen: boolean;
  /** Opens it with these props; resolves with what `close` is given. A pending one settles `undefined`. */
  open(props: P): Promise<R | undefined>;
  /** Closes it; `result` settles with `value` (`undefined`: a dismissal). */
  close(value?: R): void;
}

/**
 * An overlay a component renders itself (a dropdown under its field),
 * behind the same promise an app's presenter returns — so the caller
 * awaits one result whoever shows it. Call during component
 * initialisation.
 */
export function createLocalOverlay<P, R>(): LocalOverlay<P, R> {
  let props = $state.raw<P>();
  let settle: ((value: R | undefined) => void) | undefined;

  function close(value?: R): void {
    props = undefined;
    const done = settle;
    settle = undefined;
    done?.(value);
  }

  return {
    get props() {
      return props;
    },
    get isOpen() {
      return props !== undefined;
    },
    open(next) {
      settle?.(undefined);
      props = next;
      return new Promise<R | undefined>((resolve) => {
        settle = resolve;
      });
    },
    close,
  };
}
