# Option list

`OptionList` (`packages/blade/components/option-list/OptionList.svelte`,
over the `createOptionChoice` and `createField` models) is Blade's ActionList
and v2's OptionList in one: a form field that holds a choice among visible
options.

## Props

| Prop | Notes |
| --- | --- |
| `options`, `optionKey` | The options array and a stable key per option (filtering and re-ordering keep the pick on the option) |
| `value` | The picked option, or an array of them with `isMultiple`; bindable |
| `isMultiple` | Rows become checkboxes and the root a `group`; otherwise radios in a `radiogroup` |
| `onChange` | Fires on a user pick with the new value — "pick = submit" goes here, not in a button inside the row |
| `compare` | Defaults to identity; pass it when option objects are rebuilt |
| `isOptionDisabled`, `isDisabled` | One option, or the whole list |
| `optionText` | Enables typeahead: the text a typed prefix is matched against |
| `isDeselectable` | Single choice: picking the pick clears it |
| `name`, `isRequired`, `validationState`, `helpText`, `errorText` | The field contract, as RadioGroup |
| `item` | Snippet `(option, state)` with `state = { index, isSelected, isDisabled }` — the row's content only |

## The row belongs to the list

Each row is a `<label>` around a native radio or checkbox, so semantics,
exclusivity and label clicks are the browser's. The list owns the keyboard,
the
click, the pick and disabled looks; the `item` snippet draws content and is
told the state instead of recomputing it. `OptionListItem` (`title`,
`description`, `leading`, `trailing`) is the usual content — a style-only
component.

The native input is also the indicator: the `indicator` axis shows it at an
edge or hides it visually (`none`), never removes it. `variant` picks divided
rows in one box (`plain`) or a card per row (`card`).

## Keyboard and states

The same keys for single and multiple choice — the list handles them, so a
radio does not pick as it moves and a checkbox list is not one tab stop per
row:

| Key | Does |
| --- | --- |
| Tab / Shift+Tab | Enters and leaves: the list is one tab stop — the picked row while it is mounted (the rows are one radio group, which the browser tabs into at its checked member only), else the active row, else the first enabled one in view |
| Arrow Up / Down | Moves the active row; picks nothing. Disabled rows are skipped; it stops at the ends |
| Home / End, PageUp / PageDown | First / last enabled row, a page at a time. In a virtualised list the window scrolls to mount the row |
| Enter, Space | Picks the active row exactly as a click would: selects (or clears, with `isDeselectable`), toggles in a multiple list. `onChange` fires here, never on movement |
| a printable key | Typeahead, when `optionText` is given |
| Escape, everything else | Not the list's: flows to the page (a modal closes) |

Enter picks, so it does not submit an enclosing form while the list has focus.

Row states are separate looks, each in its own style part: **hover** and
**pressed** are CSS (`hover:`, `active:` on the unpicked look); **active** —
the row the keyboard is on — is a ring toggled from JS, shown only while the
keyboard is driving (a pointer press hides it until the next key, and it
leaves with focus); **picked** is the value; **disabled** dims and ignores
input. Active and picked are independent: moving never changes the value.

## Virtualised

`virtualize` mounts only the rows in view; give the list a bounded height
through `class` (`h-80`). Rows can be of any height. Nothing is configured:
each mounted row is measured, an unseen row counts as the mean of the measured
ones, and the total is that prediction — it corrects itself as you scroll.
When rows above the view turn out taller or shorter than predicted, the scroll
position is corrected so what you are looking at stays put. The arithmetic is
the pure `createVirtualWindow` model (`runes/virtual/window.ts`); the DOM half is
`VirtualWindow` (`components/virtual/`), exported for other lists too.

A virtualised list opens scrolled to its pick, so a long list shows what is
chosen rather than its top. It stays one tab stop: when the pick is beyond
the mounted slice, the first enabled row in view holds it, so Tab still
reaches the list and the keyboard continues from where you are looking.

Limits: a focused row that is scrolled out of view by the pointer loses focus
(the keyboard then re-enters at the tab stop), and the scrollbar jumps
slightly while the prediction settles.

On native the row is a pressable container carrying `checked` / `disabled`
attributes (`OptionRow.native.svelte`). Sections, Dropdown and Menu are not
part of this component.
