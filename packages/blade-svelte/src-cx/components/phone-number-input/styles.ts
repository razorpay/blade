import type { IconSource } from '../../runes/icon/source';
import type { PhoneParts } from '../../runes/phone/parts';
import type { IconStyleProps } from '../icon';
import { ChevronUpDownIcon } from '../../icons';
import { resolveActionList } from '../action-list/styles';
import type { OptionListClasses } from '../option-list/styles';
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
  /** The dial code trailing each country row. */
  rowDialCode: string;
  empty: string;
  /** The picker's OptionList look: ActionList's rows. */
  optionList: L;
}

/** Style props in, the parts out. */
export type PhoneNumberInputStyleResolver<P, L> = (props: P) => PhoneNumberInputClasses<L>;

export type PhoneNumberChange = PhoneParts;

/** The blade taxonomy as data: Blade DSL's Phone Number Input (Figma) sizes. */
export const PHONE_NUMBER_INPUT_AXES = {
  size: ['medium', 'large'],
} as const;

/** The text field's sizes. */
export interface PhoneNumberInputStyleProps {
  /** @default 'medium' */
  size?: Extract<TextInputStyleProps['size'], 'medium' | 'large'>;
}

// Blade DSL's _Input / Selector (Figma): a 28px pill (36px at large) round
// the flag (20×15, 24×18 at large) and a 12px chevron 4px apart, 6.5px in
// (9px at large), 6px round (8px at large). It sits on the field's 4px
// padding (2px more at large); the dial code follows 4px on, and the
// number 8px after that.
const SELECTOR = {
  medium: { country: 'h-7 [padding-inline:6.5px] [border-radius:6px]', flag: 'h-[15px] w-5' },
  large: { country: 'ml-0.5 h-9 [padding-inline:9px] rounded-small', flag: 'h-[18px] w-6' },
};

export const resolvePhoneNumberInput: PhoneNumberInputStyleResolver<
  PhoneNumberInputStyleProps,
  OptionListClasses
> = (props = {}) => {
  const selector = SELECTOR[props.size === 'large' ? 'large' : 'medium'];
  return {
  // The gray faded fill on hover and focus, and the 4px focus outline flush
  // with it.
  country: `flex shrink-0 items-center gap-1 border-none bg-transparent py-0 text-surface-gray-muted hover:enabled:bg-interactive-gray-faded focus-visible:bg-interactive-gray-faded focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-0 focus-visible:outline-surface-primary-muted ${selector.country}`,
  flag: `shrink-0 [border-radius:1px] object-cover ${selector.flag}`,
  dialCode: 'ml-1 tabular-nums text-surface-gray-muted',
  // With no selector the dial code is TextInput's prefix inset: 8px past the
  // field's padding.
  dialCodeAlone: 'ml-2',
  chevron: ChevronUpDownIcon,
  chevronIcon: { size: 'small' },
  search: 'mb-3',
  list: 'h-80',
  // Blade's ActionListItemText trailing: `interactive.text.gray.muted`.
  rowDialCode: 'shrink-0 tabular-nums text-interactive-gray-muted',
  empty: 'py-8 text-center text-75 leading-50 text-surface-gray-subtle',
  // ActionList's rows (Menu's and Dropdown's look), as Blade's CountrySelector.
  optionList: resolveActionList(),
  };
};
