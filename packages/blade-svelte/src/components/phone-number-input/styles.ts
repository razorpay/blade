import type { IconSource } from '../../runes/icon/source';
import type { PhoneParts } from '../../runes/phone/parts';
import type { IconStyleProps } from '../icon';
import { ChevronUpDownIcon } from '../../icons';
import { resolveActionList } from '../action-list/styles';
import type { CardGroupClasses } from '../card-group/styles';
import type { FloatingClasses } from '../modal/styles';
import { POPUP_GAP } from '../shared/popup-list';
import type { TextInputStyleProps } from '../text-input/styles';

/**
 * PhoneNumberInput's parts. The field is a TextInput and the picker a
 * dropdown under it holding a CardGroup, as Blade's CountrySelector: these
 * style what sits between them and choose how the list looks. An app may
 * show the list its own way (`adapters.presentDropdown`).
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
  /** The dial code trailing each country row. */
  rowDialCode: string;
  /** The dropdown under the field, as wide as its frame. */
  dropdown: FloatingClasses;
  /** The picker's list look: ActionList's (`plain`). */
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
  CardGroupClasses
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
    // Blade's ActionListItemText trailing: `interactive.text.gray.muted`.
    rowDialCode: 'shrink-0 tabular-nums text-interactive-gray-muted',
    // Blade's DropdownOverlay under the field: the popup surface, as wide
    // as the field's frame, 8px below it, scrolling past 320px (half the
    // viewport on a short screen). No overlay gutter under the field: the
    // list's rows sit at the popup's own 8px, even inside a modal.
    dropdown: {
      panel:
        'pointer-events-auto absolute z-50 flex max-h-[min(320px,50vh)] flex-col overflow-hidden rounded-large bg-popup-gray-moderate text-surface-gray-normal shadow-dropdown backdrop-blur-medium outline-none [transition-property:opacity,transform] duration-quick ease-entrance data-[state=closed]:-translate-y-2 data-[state=closed]:opacity-0 motion-reduce:transition-none [--overlay-gutter:0px]',
      gap: POPUP_GAP,
    },
    // ActionList's look (a menu's rows), as Blade's CountrySelector:
    // its rows are ActionListItems.
    optionList: resolveActionList(),
  };
};
