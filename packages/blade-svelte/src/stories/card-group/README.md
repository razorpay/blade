# CardGroup

`CardGroup` (`components/card-group/CardGroup.svelte`) is Blade DSL's Card
Group: rows stacked on one raised surface, with hairlines between them. A row
that has a `value` is a choice, and the group is a form field that holds the
pick. A row without a `value` either navigates (`href`), discloses its
`content`, or just shows content. The group reads
its `CardGroupItem`s in document order. Anything placed between them (a
heading, a note, a "show all" button) is ignored by the value, the keyboard
and `isRequired`. ActionList shares its anatomy and behaviour (the internal
`BaseCardGroup`), in Menu's look.

```svelte
<CardGroup label="Bank" name="bank" bind:value>
  <p>Popular</p>
  {#each popular as bank (bank.code)}
    <CardGroupItem value={bank} title={bank.name} description={bank.note} />
  {/each}
  <button type="button" onclick={showAll}>All {count} options</button>
</CardGroup>
```

Underneath is the headless choice list (`runes/base/choice-list.svelte.ts`):
a form field, choices registered in document order, and the keyboard. Each
choice is drawn as a native radio or checkbox row.

## Rows

| A `CardGroupItem` with   | Is                                                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`                  | A choice: a native radio or checkbox row. A picked row has a 1.5px primary ring on the plain surface                                          |
| `href` (`target`, `rel`) | A link with a chevron pointing right. It isn't a choice and is a tab stop of its own. When disabled it has no `href` and leaves the tab order |
| neither, with `content`   | A disclosure: a button with `aria-expanded` and a chevron that flips when the content opens                                                      |
| neither, and no `content`   | Plain content, with no hover and no press                                                                                                     |

A `content` snippet is what a row reveals under it: anything, including a
nested CardGroup. It sits on the subtle surface under a hairline, and the row
and its content count as one row of the group. A row inside the content is just a
row.

- **On a row without a `value`:** the row is the disclosure. Its
  `isExpanded` is bindable (the initial state, a `bind:isExpanded`, or a
  value the host keeps driving), and `onExpandChange` reports
  `{ isExpanded }`.
- **On a choice:** the content follows the pick. It shows while the row is
  picked (checked, in a `multiple` list), so a picked row can reveal the
  field it needs. Passing `isExpanded` overrides this.

```svelte
<CardGroup bind:value={option} accessibilityLabel="Payment options">
  <CardGroupItem value="full" title="Pay in full" />
  <CardGroupItem value="part" title="Part payment">
    {#snippet content()}<TextInput … />{/snippet}
  </CardGroupItem>
  <CardGroupItem title="UPI">
    {#snippet content()}<AppGrid />{/snippet}
  </CardGroupItem>
</CardGroup>
```

The types refuse the mixes that mean nothing: a link with `content`, and an
`onExpandChange` on a choice, since a choice's content follows the pick and has
no toggle to report.

## Look

This is Blade DSL's Card Group, as `src/` draws it:

- **Surface:** Card's `primary` raised surface with 12px corners. Its rim is
  redrawn above the rows, whose fills would otherwise cover it.
- **Rows:** 16px padding, 8px between parts, body medium in medium weight,
  with a `surface.border.gray.subtle` hairline between them.
- **Hover:** `surface.background.gray.moderate`.
- **Focus:** a 4px `interactive.border.primary.faded` ring, inset because the
  group clips.
- **Disabled:** like a disabled ActionListItem: no fade; the title and
  description in the disabled text colour, the chevron in the disabled icon
  colour. Content you pass as a snippet keeps its own colours.
- **Sections:** each `CardGroupSection` is a card of its own, with its
  heading (body medium, subtle) 12px above it and sections 24px apart, like
  checkout's net-banking list.

CardGroup has this one look and no `classes` prop: every part is a class in
`CardGroupClasses`, and `resolveCardGroup()` returns them, for a list of an
app's own.

## Props

| Prop                                                             | Notes                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`                                                       | The `CardGroupItem`s and anything between them                                                                                                                                                                                                      |
| `items`, `itemText`, `isItemDisabled`                            | The options as data, in order (see Data rows). `itemText` enables typeahead; `isItemDisabled` is what the keyboard skips and the list refuses                                                                                                       |
| `sections`, `row`, `itemKey`, `isVirtualized`                    | Data rows the list lays out itself: `row` renders one option, `sections` (`{ key, title, items }`) titles them, `itemKey` keys them, and `isVirtualized` mounts only the rows in view (give the list a bounded height in `class`)                   |
| `value`                                                          | The picked option, or an array of them with `selectionType="multiple"`; bindable                                                                                                                                                                    |
| `selectionType`                                                  | `single` (default) or `multiple`: rows become checkboxes and the root a `group`; otherwise radios in a `radiogroup`. There are no rows that act and hold nothing: a list where a pick submits uses `onPick`                                         |
| `onChange`                                                       | Fires when a user pick changes the value, with `{ name, value }`, `value` shaped as `bind:value` (an array with `selectionType="multiple"`)                                                                                                           |
| `onPick`                                                         | Fires on every user pick — by pointer, or Enter or Space — with `{ name, value }` (the row's value), whether the list's value changed or not. "Pick = submit" goes here: a bank list that moves on still reports when the same bank is picked again |
| `compare`                                                        | Value equality. Default: the same value, or plain objects alike in every key (so values bound to `$state`, which holds proxies, still match). Pass it to match by an id                                                                             |
| `isDisabled`                                                     | The whole list; a `CardGroupItem`'s own `isDisabled` for one option                                                                                                                                                                                 |
| `isDeselectable`                                                 | Single choice: picking the pick clears it                                                                                                                                                                                                           |
| `name`, `isRequired`, `validationState`, `helpText`, `errorText` | The field contract, as RadioGroup                                                                                                                                                                                                                   |
| `testID`                                                         | Lands on the root; each item's control gets `${testID}-${index}`                                                                                                                                                                                    |

`CardGroupItem`:

| Prop                                          | Notes                                                                                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `value`                                       | The option: what the list's value holds when it is picked. Leave it out for a link, a trigger or plain content (see Rows)                                                                  |
| `href`, `target`, `rel`                       | A link row (see Rows)                                                                                                                                                                      |
| `accessibilityLabel`                          | Names a row with no value whose content does not                                                                                                                                           |
| `title`, `description`, `leading`, `trailing` | The usual content, laid out by the item                                                                                                                                                    |
| `children`                                    | Snippet `(state)` with `state = { index, isSelected, isDisabled }`: custom content in place of the layout                                                                                  |
| `isDisabled`                                  | Refuses picks; the keyboard skips it. A link or trigger is disabled too                                                                                                                    |
| `text`                                        | What typeahead matches; defaults to `title`, else the row's text                                                                                                                           |
| `onClick`                                     | The row was pressed — by pointer, or Enter or Space — after the pick, with `{ name, value, event }`, as React's ActionListItem: `name` is the row's value, `value` whether it was selected |
| `testID`                                      | Overrides the `${testID}-${index}` the list hands the control                                                                                                                              |

CardGroup has no search: an app filters its data and renders
`CardGroupItem`s. A long list is `isVirtualized` (see Data rows).

## Data rows

With `items`, the list holds its options as data: each `CardGroupItem`
finds its place among them by its `value`, wherever it sits, instead of by
document order. So the list may mount only some of them — a virtual window
— and put anything around and between them (section headings, a window's
markup), while staying one field: one value, one tab stop, one keyboard.
`items` is read as data from mount on.

`children` then gets `{ activeIndex, tabStop }`: the option the keyboard
moved to while it is driving (-1 otherwise), which a window scrolls into
view as it may not be mounted, and the option Tab enters at, where a window
opens. The tab stop is picked among the mounted rows.

```svelte
<CardGroup bind:value {items} itemText={(bank) => bank.name}>
  {#snippet children({ activeIndex, tabStop })}
    <MyWindow reveal={activeIndex} startAt={tabStop} rows={items}>
      {#snippet row(bank)}<CardGroupItem value={bank} title={bank.name} />{/snippet}
    </MyWindow>
  {/snippet}
</CardGroup>
```

With `row`, the list renders the rows itself (`sections` adds their
headings) and `children` comes after them. `isVirtualized` then mounts only
the rows in view, opening at the pick and following the keyboard:

```svelte
<CardGroup bind:value {items} itemKey={(bank) => bank.code} isVirtualized class="h-80">
  {#snippet row(bank)}<CardGroupItem value={bank} title={bank.name} />{/snippet}
</CardGroup>
```

Several CardGroups for one pick do not make one field: each has its own
value, tab stop and keyboard. Put the sections in one CardGroup instead.

## Sections

`CardGroupSection` groups options under a heading: a labelled
`role="group"`, drawn by the look's `section` parts (each section a card of
its own under its heading here, as in ActionList's `card` variant). The
keyboard runs across sections as one list.

```svelte
<CardGroup bind:value accessibilityLabel="Methods">
  <CardGroupSection title="Popular">
    <CardGroupItem value="upi" title="UPI" />
  </CardGroupSection>
  <CardGroupSection title="More">…</CardGroupSection>
</CardGroup>
```

## The row belongs to the list

Each row is a `<label>` around a native radio or checkbox, so semantics,
exclusivity and label clicks are the browser's. The item owns the click,
the pick and disabled looks; its `children` draw content and are told the
state instead of recomputing it. The keyboard is handled on each option's
control, so a button between items keeps its own Enter and Space.

The native input is always visually hidden (`sr-only`), never removed:
screen readers, the keyboard and the form still use it, and the row's
picked state (the primary ring) is what shows the pick. CardGroup has one
look of its own: divided rows on one raised surface.

## Looks

CardGroup's anatomy (the `<label>` and native input per row, the
`radiogroup` / `group` root, label and hint) and behaviour (value, form
field, keyboard, tab stop) don't depend on its look. CardGroup and
ActionList are the two looks over them, `resolveCardGroup()` and
`actionListClasses()`; neither takes `classes`.

## Keyboard and states

The list handles the keys, so a checkbox list is not one tab stop per row.
A single-choice CardGroup is a radio group: the arrows pick as they move. A
multiple one, and ActionList, only move; Enter or Space picks:

| Key                           | Does                                                                                                                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab / Shift+Tab               | Enters and leaves: the list is one tab stop — the picked row while it is mounted (the rows are one radio group, which the browser tabs into at its checked member only), else the active row, else the first enabled one in view |
| Arrow Up / Down               | Moves the active row, and picks it in a single-choice CardGroup. Disabled rows are skipped; it stops at the ends                                                                                                                 |
| Home / End, PageUp / PageDown | First / last enabled row, a page at a time                                                                                                                                                                                       |
| Enter, Space                  | Picks the active row exactly as a click would: selects (or clears, with `isDeselectable`), toggles in a multiple list. `onPick` and the row's `onClick` fire, `onChange` when the value changed                                  |
| a printable key               | Typeahead over each item's `text` (its `title`, else its text)                                                                                                                                                                   |
| Escape, everything else       | Not the list's: flows to the page (a modal closes)                                                                                                                                                                               |

Enter picks, so it does not submit an enclosing form while the list has focus.

Row states are separate looks, each in its own style part: **hover** and
**pressed** are CSS (`hover:`, `active:` on the unpicked look); **active** —
the row the keyboard is on — is a ring toggled from JS, shown only while the
keyboard is driving (a pointer press hides it until the next key, and it
leaves with focus); **picked** is the value; **disabled** dims and ignores
input. Active and picked are independent, except in a single-choice
CardGroup, where moving picks.

A `Menu` holds whatever the app puts in it, such as an ActionList (this
anatomy in Menu's look) whose `onPick` closes it.
