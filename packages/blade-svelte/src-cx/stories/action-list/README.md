# ActionList

Blade's ActionList: Menu's and Dropdown's row in Dropdown's list (Figma's
_Action List: 36px rows, touching, 8px radius, the selected wash, a
checkbox for multiple).

**ActionList is OptionList, designed.** `OptionList` is the headless list —
the value, the keyboard, the form field, the search, the sections; ActionList
is its look (`actionListClasses(variant)`) and its rows (`ActionListItem`).
Use it anywhere a list of choices or actions goes: on a page, in a sheet, in a
Dropdown, or as a long `VirtualOptionList` (below; PhoneNumberInput's country
picker is one).

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
  {#snippet content()}
    <ActionList>
      <ActionListItem value="upi" title="UPI" leading={UpiIcon} />
      <ActionListItem value="cards" title="Cards" />
    </ActionList>
  {/snippet}
</Dropdown>

<!-- Standalone -->
<ActionList bind:value label="Pay with">
  <ActionListItem value="upi" title="UPI" />
  <ActionListItem value="cards" title="Cards" />
</ActionList>
```

| `ActionList` prop (standalone) | Notes |
| --- | --- |
| `value`, `onChange` | Bindable: one value or null, or an array with `selectionType="multiple"` |
| `selectionType` | `single` (default), `multiple` (rows lead with a checkbox), or `none`: rows are buttons that act and hold nothing — each press reports through `onChange` with the row's value (a bank list that moves on) |
| `variant` | `plain` (default): Dropdown's rows, in no box. `card`: rows divided by hairlines in a bordered box, 16px in; each `ActionListSection` its own box, its heading above, sections 24px apart |
| `query` | The search: rows whose title doesn't hold it (ignoring case and outer spaces) aren't drawn, and a section left with none steps aside. Bind a `SearchInput`'s value to it — place the field wherever the design does |
| `filter` | `(item: { title, value }, query) => boolean`, in place of the title match |
| `empty` | `Snippet<[{ query }]>`, shown while a `query` leaves no row, in a status region that announces it |
| `isDeselectable`, `compare` | As OptionList |
| `name`, `isRequired`, `isDisabled`, `validationState` | A form field |
| `label`, `helpText`, `errorText`, `accessibilityLabel` | Names and the hint line |

Inside a Dropdown these are ignored: set them on the Dropdown.

| `ActionListItem` prop | Notes |
| --- | --- |
| `value`, `title` | What it holds, and what it shows (and typeahead and a search match) |
| `description`, `leading`, `titleSuffix`, `trailing` | The row's parts, as in Figma. `leading` is an icon (`IconSource`), drawn as a 16px glyph, or a snippet with an asset (a flag) or an avatar in a 20px box — 24px, centred, in `card` |
| `href`, `target`, `rel` | A link row: it navigates and holds no value. In a Dropdown, Enter or a click follows it and closes the list, even with `selectionType="multiple"` |
| `intent="negative"` | A destructive choice: red, with a red wash. In a Dropdown, not with the select field (it draws neutral there), as in React |
| `onClick` | In a Dropdown: runs on the pick, before the value is held. Standalone: with the pick, or the press (`none`) |
| `isDisabled`, `testID` | |

`ActionListSection`: a titled `role="group"`, with a hairline above every
section but the first (`card`: its own box, the heading above). In a
Dropdown its heading steps aside while a search is typed; standalone, a
section the `query` leaves empty steps aside whole.

```svelte
<SearchInput bind:value={query} placeholder="Search for Banks" />
<ActionList variant="card" selectionType="none" {query} onChange={({ value }) => open(value)}>
  <ActionListSection title="Suggested Banks">
    <ActionListItem value="sbi" title="State Bank of India">
      {#snippet leading()}<img src={sbiLogo} alt="" />{/snippet}
      {#snippet trailing()}<Icon source={ChevronRightIcon} />{/snippet}
    </ActionListItem>
  </ActionListSection>
  <ActionListSection title="All Banks">…</ActionListSection>
  {#snippet empty({ query })}<Text color="muted">No banks match “{query}”</Text>{/snippet}
</ActionList>
```

## Long lists: VirtualOptionList in ActionList's look

ActionList is OptionList in ActionList's look: the search, the sections,
`selectionType="none"` and the empty state are OptionList's. So a long list
is a `VirtualOptionList` (only the rows in view are mounted) given the look
with `actionListClasses(variant)`, its rows `ActionListItem`s. The rows are
data, so sections are data too, and the search filters the data.

```svelte
<VirtualOptionList
  classes={actionListClasses('card')}
  selectionType="none"
  {query}
  sections={[
    { key: 'suggested', title: 'Suggested Banks', options: suggested },
    { key: 'all', title: 'All Banks', options: banks },
  ]}
  optionKey={(bank) => bank.code}
  optionText={(bank) => bank.name}
  onChange={({ value }) => open(value)}
  class="h-[28rem]"
>
  {#snippet children(bank)}
    <ActionListItem value={bank} title={bank.name} description={bank.note} />
  {/snippet}
  {#snippet empty({ query })}No banks match “{query}”{/snippet}
</VirtualOptionList>
```

`actionListClasses(variant)` follows the list's state: a `card` list is one
box, or one per section. `resolveActionList({ variant, hasSections })` is
the same as a plain class map. The look also carries the row parts
ActionListItem draws (a card's 24px logo box), so an ActionListItem inside
any OptionList matches it.

PhoneNumberInput's country picker is one: a `SearchInput` over a
`VirtualOptionList` in the `plain` look, `ActionListItem` rows, the search
the list's `query` with `phoneCountryMatches` as its `filter`.
