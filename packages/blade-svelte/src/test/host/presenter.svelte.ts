import type { ActionListRequest, PresentDropdownAdapter } from '../../runes/modal/dropdown';
import type { PhoneCountry } from '../../runes/phone/parts';

/** One dropdown the presenter shows. */
export interface PresentedEntry {
  id: number;
  request: ActionListRequest<PhoneCountry>;
  isOpen: boolean;
  close: (result?: PhoneCountry) => void;
}

/**
 * A stand-in for an app's presenter (`adapters.presentDropdown`), for the
 * stories and tests: TestHost shows what it presents as a BottomSheet. Not
 * shipped: an app brings its own.
 */
export function createTestPresenter(): {
  presentDropdown: PresentDropdownAdapter;
  readonly entries: PresentedEntry[];
} {
  let entries = $state<PresentedEntry[]>([]);
  let nextId = 0;

  const presentDropdown: PresentDropdownAdapter = (_kind, request) => {
    const id = nextId++;
    return new Promise<PhoneCountry | undefined>((resolve) => {
      const close = (value?: PhoneCountry): void => {
        entries = entries.map((entry) => (entry.id === id ? { ...entry, isOpen: false } : entry));
        resolve(value);
      };
      request.cancelled.then(() => close()).catch(() => undefined);
      entries = [...entries, { id, request, isOpen: true, close }];
    });
  };

  return {
    presentDropdown,
    get entries() {
      return entries;
    },
  };
}
