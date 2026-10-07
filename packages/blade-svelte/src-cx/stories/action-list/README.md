# ActionList

Blade's ActionList: rows that look the same as Menu's and Dropdown's
(36px, 2px apart, 8px radius, the selected wash, a checkbox for multiple).
One set of components works in two places:

- **Inside a Dropdown** its items are the Dropdown's options. The Dropdown
  holds the value, the listbox and the keyboard; `ActionList` is only their
  group there.
- **On its own** it's a visible pick list (in a BottomSheet, on a page): an
  `OptionList` in the action look, with native radios or checkboxes,
  `bind:value`, single or multiple, and form support.

```svelte
<!-- In a Dropdown -->
<Dropdown bind:value label="Payment method">
  <ActionList>
    <ActionListItem value="upi" title="UPI" icon={UpiIcon} />
    <ActionListItem value="cards" title="Cards" />
  </ActionList>
</Dropdown>

<!-- Standalone -->
<ActionList bind:value label="Pay with">
  <ActionListItem value="upi" title="UPI" />
  <ActionListItem value="cards" title="Cards" />
</ActionList>
```

| `ActionList` prop (standalone) | Notes |
| --- | --- |
| `value`, `onChange` | Bindable: one value or null, or an array with `isMultiple` |
| `isMultiple`, `isDeselectable`, `compare` | As OptionList |
| `name`, `isRequired`, `isDisabled`, `validationState` | A form field |
| `label`, `helpText`, `errorText`, `accessibilityLabel` | Names and the hint line |

Inside a Dropdown these are ignored: set them on the Dropdown.

| `ActionListItem` prop | Notes |
| --- | --- |
| `value`, `title` | What it holds, and what it shows (and typeahead and a search match) |
| `description`, `icon` or `leading`, `titleSuffix`, `trailing` | The row's parts, as in Figma |
| `href`, `target`, `rel` | A link row: it navigates and holds no value. In a Dropdown, Enter or a click follows it and closes the list, even with `isMultiple` |
| `intent="negative"` | A destructive choice: red, with a red wash. In a Dropdown, not with the select field (it draws neutral there), as in React |
| `onClick` | In a Dropdown: runs on the pick, before the value is held |
| `isDisabled`, `testID` | |

`ActionListSection`: a titled `role="group"`, with a hairline above every
section but the first. In a Dropdown its heading steps aside while a
search is typed.

PhoneNumberInput's country picker uses the same rows.
