# ActionList

Blade's ActionList: Menu's row in Figma's _Action List (36px rows,
touching, 8px radius, the selected wash, a checkbox for multiple).

**ActionList is a look.** CardGroup's anatomy holds the behaviour: the
value, `onPick`, the form field, the keyboard, sections and virtualization.
ActionList is it in Menu's look (`variant`, `inset`), with its rows
(`ActionListItem`) and sections (`ActionListSection`). Its keys are a
listbox's, as React's: the arrows move and pick nothing, Enter and Space
pick. The look is exported as `actionListClasses()`, for an app's own rows.

There is no select dropdown: a field opening a floating list is not mobile
friendly, by decision. A pick list lives on the page or in a sheet. ActionList
is not coupled to Menu. A `Menu` holds whatever the app puts in it, and an
ActionList inside closes it from `onPick`:

```svelte
<!-- On a page -->
<ActionList bind:value label="Pay with">
  <ActionListItem value="upi" title="UPI" />
  <ActionListItem value="cards" title="Cards" />
</ActionList>

<!-- In a menu: the pick closes it -->
<Menu accessibilityLabel="Payment method">
  {#snippet children()}<Button>Pay with</Button>{/snippet}
  {#snippet body({ close })}
    <ActionList onPick={({ value }) => { pay(value); close(); }}>
      <ActionListItem value="upi" title="UPI" leading={UpiIcon} />
      <ActionListItem value="cards" title="Cards" />
    </ActionList>
  {/snippet}
</Menu>
```

| `ActionList` prop | Notes |
| --- | --- |
| `variant` | `plain` (default): Menu's rows, in no box. `card`: rows divided by hairlines in a bordered box, 16px in. Each `ActionListSection` is its own box with its heading above, and sections are 24px apart |
| `inset` | `none` (default), `medium` (16px), `large` (20px) or `overlay` (the overlay's `--overlay-gutter`: 20px on a modal or a drawer, 16px on a sheet, a popover or a menu, none outside one): a gutter inside the box that scrolls the rows. On a Modal with `padding="none"`, the list keeps the body's padding while its scrollbar meets the panel's edge |
| everything else | CardGroup's: `bind:value`, `selectionType` (`single` or `multiple`), `onChange` (`{ name, value }`, an array with `multiple`), `onPick`, `isDeselectable`, `compare`, the data rows (`items`, `sections`, `row`, `itemKey`, `isVirtualized`), the form props and the names |

| `ActionListItem` prop | Notes |
| --- | --- |
| `value`, `title` | What it holds, and what it shows (and what typeahead matches) |
| `description`, `leading`, `titleSuffix`, `trailing` | The row's parts, as in Figma. `leading` is an icon (`IconSource`), drawn as a 16px glyph, or a snippet with an asset (a flag) or an avatar, in a 20px box (24px and centred in `card`) |
| `href`, `target`, `rel` | A link row: it navigates and holds no value (CardGroupItem's link row, with no chevron) |
| `intent="negative"` | A destructive choice: red, with a red wash |
| `onClick` | The row was pressed, by pointer or by Enter or Space, after the pick, with `{ name, value, event }`: `name` is the row's value, `value` whether it was selected |
| `isDisabled`, `testID` | `testID` defaults to the list's `${testID}-${index}` |

`ActionListSection` is a titled `role="group"`, with a hairline above every
section but the first. In `card`, each section is its own box with the
heading above it.

A list where a pick submits (a bank list that moves on) uses `onPick`, which
reports every pick, including picking the same row again. There is no
`selectionType="none"`.
