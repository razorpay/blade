# ActionList

Blade's ActionList: Menu's row in Figma's _Action List (36px rows,
touching, 8px radius, the selected wash, a checkbox for multiple).

**ActionList is OptionList, designed.** `OptionList` is the headless list —
the value, the keyboard, the form field, the search, the sections; ActionList
is its look (`variant`) and its rows (`ActionListItem`).
Use it anywhere a list of choices or actions goes: on a page, in a sheet, in a
Modal menu, or as a long `VirtualOptionList` (below; PhoneNumberInput's country
picker is one).

One component works in two places:

- **On a page or in a sheet** it's a visible pick list: an `OptionList` in
  the action look, with native radios or checkboxes, `bind:value`, single or
  multiple, and form support.
- **Inside a Modal `variant="menu"`** its rows are the menu's items: every
  one acts and closes the menu (`selectionType` is `none` there), a press
  reporting through `onChange`. Anchored, the rows are `menuitem`s; as a
  sheet (the provider's `presentation`), plain buttons in a dialog.

There is no select dropdown: a field opening a floating list is not mobile
friendly, by decision. A pick list lives on the page or in a sheet.

```svelte
<!-- In a menu -->
<Modal variant="menu" accessibilityLabel="Payment method">
  {#snippet trigger()}<Button>Pay with</Button>{/snippet}
  {#snippet body()}
    <ActionList onChange={({ value }) => pay(value)}>
      <ActionListItem value="upi" title="UPI" leading={UpiIcon} />
      <ActionListItem value="cards" title="Cards" />
    </ActionList>
  {/snippet}
</Modal>

<!-- On a page -->
<ActionList bind:value label="Pay with">
  <ActionListItem value="upi" title="UPI" />
  <ActionListItem value="cards" title="Cards" />
</ActionList>
```

| `ActionList` prop (standalone) | Notes |
| --- | --- |
| `value`, `onChange` | Bindable: one value or null, or an array with `selectionType="multiple"` |
| `selectionType` | `single` (default), `multiple` (rows lead with a checkbox), or `none`: rows are buttons that act and hold nothing — each press reports through `onChange` with the row's value (a bank list that moves on). Inside a Modal menu it is always `none` |
| `variant` | `plain` (default): Menu's rows, in no box. `card`: rows divided by hairlines in a bordered box, 16px in; each `ActionListSection` its own box, its heading above, sections 24px apart |
| `isSearchable`, `searchPlaceholder` | The list's own search: a `SearchInput` above the rows (24px apart), named by its placeholder (default `Search`). Rows whose title doesn't hold what is typed (ignoring case and outer spaces) aren't drawn, and a section left with none steps aside |
| `query` | The caller's search, in place of `isSearchable` (the two are exclusive): the same match against a `SearchInput` placed wherever the design does, its value bound to `query` |
| `match` | `(item: { title, value }, query) => boolean`, in place of the title match — for the list's own search and for `query` alike |
| `empty` | `Snippet<[{ query }]>`, shown while a `query` leaves no row, in a status region that announces it |
| `isDeselectable`, `compare` | As OptionList |
| `name`, `isRequired`, `isDisabled`, `validationState` | A form field |
| `label`, `helpText`, `errorText`, `accessibilityLabel` | Names and the hint line |


| `ActionListItem` prop | Notes |
| --- | --- |
| `value`, `title` | What it holds, and what it shows (and typeahead and a search match) |
| `description`, `leading`, `titleSuffix`, `trailing` | The row's parts, as in Figma. `leading` is an icon (`IconSource`), drawn as a 16px glyph, or a snippet with an asset (a flag) or an avatar in a 20px box — 24px, centred, in `card` |
| `href`, `target`, `rel` | A link row: it navigates and holds no value. In a menu it closes the menu as it navigates |
| `intent="negative"` | A destructive choice: red, with a red wash |
| `onClick` | Runs with the pick, or the press (`none`, a menu) |
| `isDisabled`, `testID` | |

`ActionListSection`: a titled `role="group"`, with a hairline above every
section but the first (`card`: its own box, the heading above). A section
the search leaves empty steps aside whole.

```svelte
<ActionList variant="card" selectionType="none" isSearchable searchPlaceholder="Search for Banks" onChange={({ value }) => open(value)}>
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

## Long lists: `virtualizedItems` and `virtualizedSections`

A long list takes its rows as data, and only the rows in view are mounted.
A snippet is opaque, so the list cannot learn its rows by letting them mount
and register; `virtualizedItems` (a flat list) or `virtualizedSections`
(`{ key, title, items }`, under one window) replace `children` as the
source, and `children(item, state)` renders one `ActionListItem` per row.
`itemKey` identifies an item across filtering and re-orders (unique across
sections), `itemText` feeds typeahead and the search — required with
`isSearchable`, since the search matches it (and pass it with `query` too, or
nothing matches) — `isItemDisabled` what the keyboard skips. `variant`, `selectionType`, `isSearchable` /
`query`, `match`, `empty`, `bind:value` and the field props work as on the
composed list; give the list a bounded height with `class`.

```svelte
<ActionList
  variant="card"
  selectionType="none"
  isSearchable
  searchPlaceholder="Search for Banks"
  virtualizedSections={[
    { key: 'suggested', title: 'Suggested Banks', items: suggested },
    { key: 'all', title: 'All Banks', items: banks },
  ]}
  itemKey={(bank) => bank.code}
  itemText={(bank) => bank.name}
  onChange={({ value }) => open(value)}
  class="h-[28rem]"
>
  {#snippet children(bank)}
    <ActionListItem value={bank} title={bank.name} description={bank.note} />
  {/snippet}
  {#snippet empty({ query })}No banks match “{query}”{/snippet}
</ActionList>
```

Underneath it is `VirtualOptionList`, the headless form, exported for a
snowflake look of your own (the ActionList look itself is not exported). `ActionListSection`
takes no data of its own: a virtual section inside a composed list would
need its own window and scroll viewport, splitting one value, one radio
group and one arrow-key sequence into two.

PhoneNumberInput's country picker is one: a `SearchInput` over a
`VirtualOptionList` in the `plain` look, `ActionListItem` rows, the search
the list's `query` with `phoneCountryMatches` as its `match`.
