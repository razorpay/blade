import type { DatesRangeValue } from '@mantine/dates';

export const fireNativeEvent = (
  ref: React.RefObject<HTMLElement> | null,
  value: DatesRangeValue | File[] | string | null | number[] | string[] | number,
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
