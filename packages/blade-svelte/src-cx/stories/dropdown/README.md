# Dropdown

Pick a value from a floating list. By default it's a select field (label,
the picked rows' titles or a placeholder, a chevron, and the hint line);
pass a `trigger` snippet to open it from anything else, such as a Button.

**Dropdown or Menu?** If the click saves a choice, use Dropdown: the row
stays selected (a city, a status filter). If the click does something
(Edit, Delete, go to a page), use Menu: its items work like buttons. The
two share one core and one look; only what a pick means differs.

```svelte
<Dropdown bind:value label="Payment method" placeholder="Select a method">
  <ActionList>
    <ActionListItem value="upi" title="UPI" icon={UpiIcon} />
    <ActionListItem value="netbanking" title="Netbanking" icon={BankIcon} />
  </ActionList>
</Dropdown>
```

| Prop | Notes |
| --- | --- |
| `value` | Bindable: one value or null, or an array with `isMultiple`. `onChange({ name, value })` on every user pick |
| `isMultiple` | Rows lead with a checkbox, and a pick keeps the list open (as in Blade) |
| `isDeselectable` | Single choice: picking the pick clears it |
| `compare` | Value equality. Default: the same value, or plain objects alike in every key (so values bound to `$state`, which holds proxies, still match). Pass it to match by an id |
| `trigger({ isOpen, selected })` | Your own trigger; without it, the select field |
| `header`, `footer({ close })` | A `DropdownHeader` and a `DropdownFooter` |
| `isLoading`, `emptyText` | A loading row in place of the rows; the text when a search hides every row |
| `label`, `placeholder`, `helpText`, `errorText`, `successText`, `validationState`, `size` | The select field |
| `name`, `isRequired`, `isDisabled` | As every form field: inside a Form it registers, validates and submits under `name` |
| `isOpen`, `onOpenChange`, `placement`, `accessibilityLabel`, `testID` | As Menu |

Parts:
- **`ActionList`** + **`ActionListItem`** / **`ActionListSection`**: the rows, as in React (see ActionList). An item has `value`, `title` (also what the field shows, typeahead and search match), `description`, `icon` or `leading`, `titleSuffix`, `trailing`, `href` (a link row: follows the link, closes, holds nothing), `intent="negative"` (custom triggers only), `onClick`, `isDisabled`. A section's heading steps aside while a search is typed.
- **`DropdownHeader`**: `title`, `subtitle`, `trailing`, and `hasSearch` with `searchPlaceholder`.
- **`DropdownFooter`**: Figma's padded row for a secondary and a primary Button, or any content.

## Keyboard and focus

Focus stays on one element while the list is open: the listbox, or the
search field when there is one. It names the active row through
`aria-activedescendant`, so a search keeps its caret.

- Arrows, Enter or Space on the trigger open it, landing on the pick (else the first row).
- Arrows move, wrapping and skipping disabled rows; Home/End jump; a typed letter finds a row (in a search, letters type instead).
- Enter, Space or a click pick: a single pick closes the list and returns focus to the trigger; with `isMultiple` it stays open.
- Escape and Tab close it; so does a press outside, or the footer's `close`.

Roles: the trigger is a combobox (`aria-haspopup="listbox"`), the list a
`listbox` (`aria-multiselectable` with `isMultiple`), rows `option`s with
`aria-selected`.

## Look

The same as Menu (`shared/popup-list`): the popup surface with a 12px
radius, 8px round the rows and 2px between them, 36px rows. A dropdown
adds the held pick (the darker gray wash, single) or a checkbox
(multiple), a header (16px in, 12px under) and a footer (16px in).

Not yet: AutoComplete, tree view, country selector, virtualised options.
