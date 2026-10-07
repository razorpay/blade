import type { OptionListClasses } from '../option-list/styles';

// ActionList standalone: OptionList's anatomy (a native radio or checkbox
// row) in Menu's and Dropdown's look (`shared/popup-list`) — rows 2px apart
// in no box; each 36px, 8px in, 8px radius, its parts side by side 8px
// apart; the selected wash, `interactive.background.gray.default` under the
// pointer, the 4px ring from the keys. The native control is hidden: the
// row draws its pick (the wash, or ActionListRow's checkbox). A negative
// row (`data-intent`) is red with a red wash.
const ROW_PICKED =
  'bg-interactive-gray-faded-highlighted text-interactive-gray-normal data-[intent=negative]:bg-interactive-negative-faded-highlighted data-[intent=negative]:text-interactive-negative-normal';
const ROW_UNPICKED =
  'text-interactive-gray-normal hover:bg-interactive-gray-default data-[intent=negative]:text-interactive-negative-normal data-[intent=negative]:hover:bg-interactive-negative-faded';

/** The classes ActionList hands OptionList (and PhoneNumberInput's country picker). */
export function resolveActionList(): OptionListClasses {
  return {
    root: 'flex w-full flex-col',
    disabled: 'opacity-blade-600',
    options: 'flex flex-col gap-0.5',
    virtual: { root: 'min-h-0', viewport: 'min-h-0 flex-1', options: 'flex flex-col gap-0.5' },
    // `relative`: the hidden control is absolutely positioned inside its row.
    row: 'relative flex cursor-pointer items-center gap-2 p-2 rounded-small font-blade-text text-100 leading-100 tracking-50 whitespace-nowrap select-none transition-colors',
    rowState: { picked: ROW_PICKED, unpicked: ROW_UNPICKED },
    rowActive: 'outline-solid outline-4 outline-offset-1 outline-surface-primary-muted',
    rowDisabled: 'pointer-events-none opacity-blade-600',
    control: { radio: 'sr-only', checkbox: 'sr-only' },
    invalid: 'outline-solid outline-thin outline-interactive-negative-default',
    content: 'flex min-w-0 flex-1 flex-row items-center gap-2',
  };
}
