import type { DatesRangeValue } from '@mantine/dates';

// interface valueType {
//   value: DatesRangeValue | null;
// }

// interface eventType {
//   eventType: 'change' | 'input' as 'string';
// }

// interface optionsType {
//   bubbles?: boolean;
//   writable?: boolean;
// }
export const fireNativeEvent = (
  ref: React.RefObject<HTMLElement> | null,
  value: DatesRangeValue | File[] | string | null,
  eventTypes: Array<'change' | 'input'>,
): void => {
  if (ref) {
    eventTypes.forEach((eventType) => {
      const event = new Event(eventType, { bubbles: true });
      Object.defineProperty(event, 'target', { value: { value }, writable: false });
      ref.current?.dispatchEvent(event);
    });
  } else {
    console.log('ref is not defined');
  }
};
