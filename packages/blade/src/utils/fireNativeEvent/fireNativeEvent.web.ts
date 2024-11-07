export const fireNativeEvent = (
  ref: React.RefObject<HTMLElement> | null,
  eventTypes: Array<'change' | 'input'>,
): void => {
  if (ref) {
    eventTypes.forEach((eventType) => {
      const event = new Event(eventType, { bubbles: true });
      ref.current?.dispatchEvent(event);
    });
  } else {
    console.warn('ref is not defined');
  }
};
