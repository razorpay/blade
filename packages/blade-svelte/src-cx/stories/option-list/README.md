# Option list

`OptionList` (`components/option-list/OptionList.svelte`) is Blade's
ActionList and v2's OptionList in one: a form field that holds a choice
among visible options. Its options are the `OptionItem`s inside it, read in
document order — anything else between them (a heading, a note, a "show all"
button) is left alone: outside the value, the keyboard and `isRequired`.

```svelte
<OptionList label="Bank" name="bank" bind:value>
  <p>Popular</p>
  {#each popular as bank (bank.code)}
    <OptionItem value={bank} title={bank.name} description={bank.note} />
  {/each}
  <button type="button" onclick={showAll}>All {count} options</button>
</OptionList>
```

It is the headless choice list (`runes/base/choice-list.svelte.ts`: a form
field, registered choices in document order, the keyboard) drawn as native
radio and checkbox rows. CardGroup is the same choice list drawn as
expanding headers.

## Props

| Prop | Notes |
| --- | --- |
| `children` | The `OptionItem`s and anything between them |
| `value` | The picked option, or an array of them with `selectionType="multiple"`; bindable |
| `selectionType` | `single` (default) or `multiple`: rows become checkboxes and the root a `group`; otherwise radios in a `radiogroup` |
| `onChange` | Fires on a user pick with `{ name, value }` — "pick = submit" goes here, not in a button inside the row |
| `classes` | A whole look (`OptionListClasses`) in place of the built-in one: `resolveActionList()`, or your own; see below |
| `compare` | Value equality. Default: the same value, or plain objects alike in every key (so values bound to `$state`, which holds proxies, still match). Pass it to match by an id |
| `isDisabled` | The whole list; an `OptionItem`'s own `isDisabled` for one option |
| `isDeselectable` | Single choice: picking the pick clears it |
| `name`, `isRequired`, `validationState`, `helpText`, `errorText` | The field contract, as RadioGroup |

`OptionItem`:

| Prop | Notes |
| --- | --- |
| `value` | The option: what the list's value holds when it is picked |
| `title`, `description`, `leading`, `trailing` | The usual content, laid out by the item |
| `children` | Snippet `(state)` with `state = { index, isSelected, isDisabled }`: custom content in place of the layout |
| `isDisabled` | Refuses picks; the keyboard skips it |
| `text` | What typeahead matches; defaults to `title`, else the row's text |
| `testID` | Overrides the `${testID}-${index}` the list hands the control |

## The row belongs to the list

Each row is a `<label>` around a native radio or checkbox, so semantics,
exclusivity and label clicks are the browser's. The item owns the click,
the pick and disabled looks; its `children` draw content and are told the
state instead of recomputing it. The keyboard is handled on each option's
control, so a button between items keeps its own Enter and Space.

The native input is always visually hidden (`sr-only`), never removed:
screen readers, the keyboard and the form still use it, and the row's
picked state (the gray wash) is what shows the pick. OptionList has one
look of its own: divided rows in one box.

## Bringing your own look

OptionList's anatomy (the `<label>` and native input per row, the
`radiogroup` / `group` root, label and hint) and behaviour (value, form
field, keyboard, tab stop) don't depend on its looks. Pass `classes` (an
`OptionListClasses` map) to `OptionList` or `VirtualOptionList` and it
replaces the built-in look entirely. That's how ActionList brings Menu's
and Dropdown's rows (`resolveActionList()`); `resolveOptionList()` gives
the built-in one to start from. A map's `control` part decides the native
input's look, so a custom look could show it.

```svelte
<OptionList bind:value label="Plan" classes={myClasses}>…</OptionList>
```

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
| a printable key | Typeahead over each item's `text` (its `title`, else its text) |
| Escape, everything else | Not the list's: flows to the page (a modal closes) |

Enter picks, so it does not submit an enclosing form while the list has focus.

Row states are separate looks, each in its own style part: **hover** and
**pressed** are CSS (`hover:`, `active:` on the unpicked look); **active** —
the row the keyboard is on — is a ring toggled from JS, shown only while the
keyboard is driving (a pointer press hides it until the next key, and it
leaves with focus); **picked** is the value; **disabled** dims and ignores
input. Active and picked are independent: moving never changes the value.

## Virtualised

`VirtualOptionList` mounts only the rows in view, so it cannot learn its
options from the items inside it: it takes them as data — `options`,
`optionKey`, `isOptionDisabled`, `optionText` — and a `children(option,
state)` snippet that renders an `OptionItem` per row. Give it a bounded
height through `class` (`h-80`).

```svelte
<VirtualOptionList class="h-80" options={banks} optionKey={(b) => b.code} bind:value>
  {#snippet children(bank)}
    <OptionItem value={bank} title={bank.name} />
  {/snippet}
</VirtualOptionList>
```
 Rows can be of any height. Nothing is configured:
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
attributes (`OptionRow.native.svelte`). Dropdown and Menu are not part of
this component.
