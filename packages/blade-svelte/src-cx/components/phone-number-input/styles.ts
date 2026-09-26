import type { IconSource } from '../../runes/icon/source';
import type { PhoneParts } from '../../runes/phone/parts';
import type { IconStyleProps } from '../icon';
import {
  bottomSheetLook,
  type BottomSheetStyleProps,
} from '../bottom-sheet/styles';
import type { ModalLookProp } from '../modal';
import { chevronUpDown } from '../icons';
import type { OptionListStyleProps } from '../option-list';

/**
 * PhoneNumberInput's parts. The field is a TextInput and the picker a Modal
 * holding an OptionList: these style what sits between them and choose how
 * the two composed components look.
 */
export interface PhoneNumberInputClasses<D, L> {
  /** The country button before the number; a plain span when not selectable. */
  country: string;
  flag: string;
  dialCode: string;
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
  /** Style props handed to the picker's Modal. */
  modal: D;
  /** Style props handed to the picker's OptionList. */
  optionList: L;
}

/** Style props in, the parts out. */
export type PhoneNumberInputStyleResolver<P, D, L> = (
  props: P
) => PhoneNumberInputClasses<D, L>;

export type PhoneNumberChange = PhoneParts;

/** Blade's phone field has one look: no style axes yet. */
export type PhoneNumberInputStyleProps = Record<never, never>;

export const resolvePhoneNumberInput: PhoneNumberInputStyleResolver<
  PhoneNumberInputStyleProps,
  BottomSheetStyleProps & ModalLookProp,
  OptionListStyleProps
> = () => ({
  // Blade's leading country selector: a 28px pill (6px padding, 8px radius)
  // round the flag and a small chevron, tinted on hover. Pulled left so the
  // flag sits where the field's own padding would put it.
  country:
    // Colours per Blade's InputDropdownButton: chevron `surface.icon.gray.muted`,
    // hover/focus fill `interactive.background.gray.faded`, focus ring the
    // 4px primary-muted one.
    '-ml-2 flex h-7 items-center gap-1 rounded-small px-1.5 text-surface-gray-muted hover:enabled:bg-interactive-gray-faded focus-visible:outline-none focus-visible:bg-interactive-gray-faded focus-visible:shadow-focus',
  // Blade draws the flag bare: no hairline round it.
  flag: 'h-blade-15 w-5 shrink-0 [border-radius:1px] object-cover',
  dialCode: 'ml-1.5 mr-0.5 tabular-nums text-surface-gray-muted',
  chevron: chevronUpDown,
  chevronIcon: { size: 'small' },
  search: 'mb-3',
  list: 'h-80',
  row: 'flex w-full items-center gap-3',
  rowName: 'min-w-0 flex-1 truncate text-start',
  // Blade's ActionListItemText trailing: `interactive.text.gray.muted`.
  rowDialCode: 'shrink-0 tabular-nums text-interactive-gray-muted',
  empty: 'py-8 text-center text-75 leading-50 text-surface-gray-subtle',
  // A sheet on phones, a centred modal on desktop.
  modal: { look: bottomSheetLook, adaptive: true },
  optionList: { variant: 'plain', indicator: 'none' },
});
