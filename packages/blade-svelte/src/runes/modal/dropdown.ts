import type { PhoneCountry } from '../phone/parts';

// The contract between a library dropdown and the app that may present it
// its own way (`adapters.presentDropdown`). Types only: what renders it is
// the app's.

/**
 * A list to pick one item from: ActionList's props as data, and how to
 * present it. A presenter can hand the first half to an ActionList as is.
 *
 * Single selection only. A multiple one would add
 * `selectionType: 'single' | 'multiple'` (absent means `'single'`), as
 * `ActionListRequest<T, S extends 'single' | 'multiple' = 'single'>`: with
 * `'multiple'`, `value` is `readonly T[]` and the presenter resolves with
 * `readonly T[] | undefined`.
 *
 * No anchor element: the request stays data that can cross a JS bridge to a
 * native host, and an element can't. A presenter that places a popover by
 * the field would add it as data (`anchorRect?: DOMRect`), or as a getter
 * (`anchor?: () => HTMLElement`).
 */
export interface ActionListRequest<T> {
  /** The items to pick from (ActionList's `items`). */
  items: readonly T[];
  /** The item picked now (ActionList's `value`). */
  value: T | undefined;
  /** A stable key per item (ActionList's `itemKey`). */
  itemKey: (item: T) => string;
  /** The item's text: what a search matches (ActionList's `itemText`). */
  itemText: (item: T) => string;
  /** Items that can't be picked (ActionList's `isItemDisabled`). */
  isItemDisabled?: (item: T) => boolean;
  /** Localized; the list's name, and the overlay's title (ActionList's `label`). */
  label: string;
  /**
   * The field's: name the overlay `${testID}-picker` and the list
   * `${testID}-countries`, as Blade's own dropdown does.
   */
  testID?: string;
  /** Localized; a close button's accessible name. */
  closeLabel?: string;
  /**
   * Resolves once the field withdraws it (it unmounted, or opened another);
   * never rejects. Never already resolved when handed over. A native host
   * forwards it: `request.cancelled.then(() => bridge.send('dropdown.dismiss'))`.
   */
  cancelled: Promise<void>;
}

/**
 * Every library dropdown an app may present, by what it picks:
 * `dial-code` is PhoneNumberInput's country list.
 */
export interface DropdownValues {
  'dial-code': PhoneCountry;
}

export type DropdownKind = keyof DropdownValues;

/**
 * The app's presenter for library dropdowns. Return a promise to take the
 * dropdown over: it resolves with the pick, or `undefined` on a dismissal.
 * Return `undefined` to keep Blade's dropdown under the field.
 */
export type PresentDropdownAdapter = <K extends DropdownKind>(
  kind: K,
  request: ActionListRequest<DropdownValues[K]>,
) => Promise<DropdownValues[K] | undefined> | undefined;
