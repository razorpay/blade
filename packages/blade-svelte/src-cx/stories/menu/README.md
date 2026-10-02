# Menu

`components/menu/Menu.svelte` over `createMenu`; the floating half is the
Popover's panel (`role="menu"`). Its items are the `MenuItem`s inside it,
read in document order — anything between them (a heading, a divider) is
left alone and outside the keyboard.

```svelte
<Menu accessibilityLabel="Address actions" onSelect={(action) => run(action)}>
  {#snippet trigger()}
    <IconButton icon={icons.more} accessibilityLabel="Address actions" />
  {/snippet}
  <MenuItem value="edit" title="Edit address" icon={icons.user} />
  <MenuItem value="copy" title="Copy address" icon={icons.copy} />
  <hr />
  <MenuItem value="remove" title="Remove" icon={icons.close} />
</Menu>
```

| Prop | Notes |
| --- | --- |
| `trigger({ isOpen })` | Snippet: a Button or IconButton; the wrapper opens the menu, and stamps `aria-haspopup` / `aria-expanded` on it |
| `children` | The `MenuItem`s and anything between them; they mount while the menu is open |
| `onSelect` | A `MenuItem` with a `value` was chosen: it reports the value and the menu closes |
| `isOpen` | Bindable, or host-driven; `onOpenChange({ isOpen })` |
| `placement` | Default `bottom-start`, as React |
| `accessibilityLabel` | Names the menu |

`MenuItem`:

| Prop | Notes |
| --- | --- |
| `title` | What shows, and what typeahead matches |
| `icon`, `isDisabled` | Per item |
| `value` | Reported to the Menu's `onSelect` |
| `onClick` | The item's own act, before `onSelect` |
| `children` | Custom content in place of the icon and title |

On the trigger, arrows, Enter and Space open it; inside, arrows rove (wrapping,
skipping disabled items), Home/End jump, a typed letter finds a match, Escape
and Tab close. Closing hands focus back to the trigger. It is not modal: it
joins the layers as a floating layer, so Escape closes only the topmost
overlay — the menu, not a modal beneath it.
