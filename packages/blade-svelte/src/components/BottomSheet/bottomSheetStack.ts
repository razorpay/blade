import { writable, get } from 'svelte/store';

/**
 * Module-level stack of mounted BottomSheet IDs. Replaces React's
 * `BottomSheetStackContext` — Svelte doesn't need a provider because module
 * state is global within a single bundle.
 *
 * The most recently mounted sheet sits at the **front** (index 0); call
 * `getTopOfTheStack()` to read it. Drag handling is enabled only for the top
 * sheet so swipe-down on a deeper sheet doesn't dismiss the foreground one.
 */
export const bottomSheetStack = writable<string[]>([]);

export function addBottomSheetToStack(id: string | undefined): void {
  // `useId` returns `undefined` on first render in some environments; ignore.
  if (id === undefined) return;
  bottomSheetStack.update((prev) => [id, ...prev]);
}

export function removeBottomSheetFromStack(id: string): void {
  bottomSheetStack.update((prev) => {
    const next = [...prev];
    const popped = next.shift();
    // Only pop if the passed id matches the top — otherwise restore.
    if (popped === id) return next;
    if (popped !== undefined) next.unshift(popped);
    // Also handle the case where this id is somewhere deeper (forced unmount).
    return next.filter((stackId) => stackId !== id);
  });
}

export function getTopOfTheStack(): string | null {
  const stack = get(bottomSheetStack);
  return stack[0] ?? null;
}

export function getCurrentStackIndexById(id: string): number {
  const stack = get(bottomSheetStack);
  return stack.findIndex((stackId) => stackId === id);
}
