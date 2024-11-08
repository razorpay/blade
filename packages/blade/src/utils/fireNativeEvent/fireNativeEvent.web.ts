/**
 * Fires native events on a given HTML element reference.
 *
 * @param ref - A React ref object pointing to an HTML element or null.
 * @param eventTypes - An array of event types to be dispatched. Supported event types are 'change' and 'input'.
 *
 * @remarks
 * This function creates and dispatches native events of the specified types on the element referenced by `ref`.
 * If `ref` is null, a warning is logged to the console.
 *
 * @example
 * ```typescript
 * const inputRef = React.createRef<HTMLInputElement>();
 * fireNativeEvent(inputRef, ['change', 'input']);
 * ```
 */

export const fireNativeEvent = (
  ref: React.RefObject<HTMLElement> | null,
  eventTypes: Array<'change' | 'input'>,
): void => {
  if (!ref) return;

  eventTypes.forEach((eventType) => {
    const event = new Event(eventType, { bubbles: true });
    ref.current?.dispatchEvent(event);
  });
};
