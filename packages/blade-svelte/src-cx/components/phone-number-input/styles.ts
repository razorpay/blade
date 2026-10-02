import type { IconSource } from '../../runes/icon/source';
import type { PhoneParts } from '../../runes/phone/parts';
import type { IconStyleProps } from '../icon';
import { chevronUpDown } from '../icons';
import type { OptionListStyleProps } from '../option-list';
import type { TextInputStyleProps } from '../text-input/styles';

/**
 * PhoneNumberInput's parts. The field is a TextInput and the picker a Modal
 * holding an OptionList: these style what sits between them and choose how
 * the list looks. The picker's Modal follows the app's `Modal` defaults
 * (BladeProvider), e.g. `{ variant: { base: 'sheet', m: 'modal' } }`.
 */
export interface PhoneNumberInputClasses<L> {
  /** The country button before the number; a plain span when not selectable. */
  country: string;
  flag: string;
  dialCode: string;
  /** Added to the dial code when there is no selector before it. */
  dialCodeAlone: string;
  /** Marks the button as opening a picker. */
  chevron: IconSource;
  /** Style props handed to the chevron's Icon: the host sizes it. */
  chevronIcon: IconStyleProps;
  search: string;
  /** Bounds the list's height: the OptionList inside is virtualised. */
  list: string;
  row: string;
  rowName: string;
  rowDialCode: string;
  empty: string;
  /** Style props handed to the picker's OptionList. */
  optionList: L;
}

/** Style props in, the parts out. */
export type PhoneNumberInputStyleResolver<P, L> = (
  props: P
) => PhoneNumberInputClasses<L>;

export type PhoneNumberChange = PhoneParts;

/** The text field's sizes. */
export interface PhoneNumberInputStyleProps {
  /** @default 'medium' */
  size?: TextInputStyleProps['size'];
}

export const resolvePhoneNumberInput: PhoneNumberInputStyleResolver<
  PhoneNumberInputStyleProps,
  OptionListStyleProps
> = () => ({
  // Blade's leading country selector: a 28px pill (6px padding, 8px radius)
  // round the flag and a small chevron, tinted on hover. Pulled left so the
  // flag sits where the field's own padding would put it.
  // Blade's CountrySelector: a 56×28 button 4px in from the box, 6px
  // round, a 20px flag and a 16px chevron 4px apart; the gray faded fill
  // on hover and focus, and the 4px focus outline flush with it. The dial
  // code follows 12px on, in the muted body text.
  country:
    '-ml-2 flex h-7 shrink-0 items-center gap-1 [border-radius:6px] border-none bg-transparent px-2 py-0 text-surface-gray-muted hover:enabled:bg-interactive-gray-faded focus-visible:bg-interactive-gray-faded focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-0 focus-visible:outline-surface-primary-muted',
  flag: 'h-[15px] w-5 shrink-0 [border-radius:1px] object-cover',
  dialCode: 'ml-3 tabular-nums text-surface-gray-muted',
  dialCodeAlone: 'ml-0',
  chevron: chevronUpDown,
  chevronIcon: { size: 'medium' },
  search: 'mb-3',
  list: 'h-80',
  row: 'flex w-full items-center gap-3',
  rowName: 'min-w-0 flex-1 truncate text-start',
  // Blade's ActionListItemText trailing: `interactive.text.gray.muted`.
  rowDialCode: 'shrink-0 tabular-nums text-interactive-gray-muted',
  empty: 'py-8 text-center text-75 leading-50 text-surface-gray-subtle',
  optionList: { variant: 'plain', indicator: 'none' },
});
