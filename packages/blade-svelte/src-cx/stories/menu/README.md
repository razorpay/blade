# Menu

`packages/blade/components/menu/Menu.svelte` over `createMenu`; the
floating half is the Popover's panel (`role="menu"`).

| Prop | Notes |
| --- | --- |
| `items`, `itemKey`, `itemLabel` | The label is what shows and what typeahead matches |
| `itemIcon`, `isItemDisabled` | Per item |
| `item(item)` | Replaces an item's icon and label |
| `onSelect` | A choice is an act: it reports and the menu closes |
| `onOpenChange`, `placement` | Default `bottom-end` |
| `children` | The trigger — a Button or IconButton; the menu stamps `aria-haspopup` / `aria-expanded` on it |
| `accessibilityLabel` | Names the menu |

On the trigger, arrows, Enter and Space open it; inside, arrows rove (wrapping,
skipping disabled items), Home/End jump, a typed letter finds a match, Escape
and Tab close. Closing hands focus back to the trigger. It is not modal and
pushes no layer; it answers Escape in capture so a modal beneath does not.
