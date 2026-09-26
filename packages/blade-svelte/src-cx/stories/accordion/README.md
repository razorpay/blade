# Accordion

`Accordion` holds `AccordionItem`s. Each item is a header button
(`aria-expanded`) over a region. Blade's behaviour: one item open at a
time, and pressing the open one closes it. The open item is `bind:value`:
the item's `value`, or its index when it has none.

```svelte
<Accordion bind:value variant="filled" showNumberPrefix>
  <AccordionItem value="refund" title="When do refunds arrive?" subtitle="Refunds">
    {#snippet content()}<Text color="subtle">Within five to seven days.</Text>{/snippet}
  </AccordionItem>
  <AccordionItem value="card" title="Cards" onClick={() => goto('/card')} />
</Accordion>
```

Built for the mobile home method list
(`app/v2/modules/home/components/InstrumentList.svelte`), which is three
things at once:

1. **A required choice.** The open item is the value: `bind:value`, and with
   `name` + `isRequired` a Form requires and submits it.
2. **Expand or go.** An item with no `content` or `children` never expands:
   a press only reports through `onClick`, and it draws a chevron pointing right.
3. **A press the host may refuse.** `onClick(event)` fires before anything
   changes; `return false` vetoes the expand (an address gate, a method
   facing issues that opens a downtime sheet instead).

## Accordion

| Prop | Notes |
| --- | --- |
| `value` (bindable) | The open item's `value` (its index when unset), `null` for none. The initial value is the default-open item |
| `onChange` | The new value, after a press changed it |
| `variant` | `transparent` (default: a divider after every item) or `filled` (one raised surface, dividers between items) |
| `size` | `large` (default) or `medium`: title type, line box and number prefix; `state.size` for snippets |
| `showNumberPrefix` | Numbers the items `1.`, `2.`, … in place of their `leading` |
| `isDisabled` | Every header is inert |
| `scrollOnExpand` | Default `true`: the panel scrolls into view (`block: 'nearest'`) once it has opened |
| `name`, `isRequired`, `validationState`, `helpText`, `errorText`, `label`, `accessibilityLabel` | The field line, as on OptionList |

## AccordionItem

| Prop | Notes |
| --- | --- |
| `value` | The item's identity in the Accordion's `value`; its index by default |
| `title`, `subtitle` | A string in Blade's type (semibold title at the accordion's size, small muted subtitle), or a snippet that sizes its own |
| `leading` snippet | Ahead of the title, capped at 32px (24px at medium). The number prefix wins over it |
| `trailing` snippet | Replaces the chevron (a status glyph, a loading placeholder); owns its look |
| `header` snippet | Replaces leading, title and subtitle. Inside a `<button>`: phrasing content only, nothing interactive — use `Text as="span"` |
| `content` snippet | The body in Blade's body box (12px above, 16px in and below). Mounted only while open, so lazy content loads on expand. Wins over `children` |
| `children` snippet | A custom body at full width, no padding or background of the accordion's own |
| `isDisabled` | The header is inert |
| `onClick` | Every header click (a keyboard press included); `return false` to veto. Without a body, the press is all the item does |
| `testID` | Overrides the `${testID}-${index}` the Accordion hands the header |

Every snippet receives `state`: `{ index, isExpanded, isDisabled, isActionable, size }`.
`isActionable` is true for an item without a body.

Keyboard: headers are in the Tab order; Up, Down, Home and End move between
enabled headers; Enter and Space press.

The panel slides over the component's duration (none with reduced motion, and
none on native, which mounts it as is). Separate Accordions are independent;
to make them exclusive, bind each `value` and clear the others in `onChange`.

API parity with Blade React: see `src-cx/API-PARITY.md`.
