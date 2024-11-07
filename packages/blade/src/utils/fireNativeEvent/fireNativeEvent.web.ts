export const fireNativeEvent = (
  ref: React.RefObject<HTMLElement> | null,
  value: unknown,
  eventTypes: Array<'change' | 'input'>,
): void => {
  if (ref) {
    eventTypes.forEach((eventType) => {
      const event = new Event(eventType, { bubbles: true });
      Object.defineProperty(event, 'target', { value: { value }, writable: false });
      ref.current?.dispatchEvent(event);
    });
  } else {
    console.warn('ref is not defined');
  }
};
