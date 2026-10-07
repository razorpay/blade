# Menu

**Menu or Dropdown?** If the click does something (Edit, Delete, go to a
page), use Menu: its items work like buttons. If the click saves a choice,
use Dropdown: the row stays selected. Both run on one core
(`runes/popup-list`) and share one look (`shared/popup-list`).

`components/menu/Menu.svelte` over `createMenu`; the floating half is the
Popover's panel (`role="menu"`). Its items are the `MenuItem`s inside it,
read in document order — anything between them (a heading, a divider) is
left alone and outside the keyboard.

```svelte
<Menu accessibilityLabel="Address actions" onSelect={(action) => run(action)}>
  {#snippet trigger()}
    <IconButton icon={MoreHorizontalIcon} accessibilityLabel="Address actions" />
  {/snippet}
  <MenuItem value="edit" title="Edit address" icon={UserIcon} />
  <MenuItem value="copy" title="Copy address" icon={CopyIcon} />
  <hr />
  <MenuItem value="remove" title="Remove" icon={CloseIcon} />
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
| `icon` | A 16px glyph before the title |
| `leading` | In place of `icon`: an asset or an avatar in a 20px box |
| `titleSuffix` | Beside the title: a Badge |
| `trailing` | After the title: a glyph (a check, a chevron) or shortcut text |
| `isDisabled` | Per item |
| `value` | Reported to the Menu's `onSelect` |
| `onClick` | The item's own act, before `onSelect` |
| `description` | Under the title, muted |
| `intent` | `negative` for a destructive action: red, with a red wash while active |
| `children` | Custom content in place of the whole row |

### Why `icon`, `leading`, `titleSuffix` and `trailing` are props

Blade DSL's _Menu Item (Figma) is one 36px row, 8px in, whose parts sit 8px
apart: the leading item (a 16px glyph on the 20px title line, or a 20px
asset or avatar), the title (Body/Medium 14/20) with its suffix, and the
trailing item (a 16px glyph or Caption/Small shortcut text). The item owns
that row and its boxes, so each part is a prop. Rows sit 2px apart, 8px
inside the menu.

On the trigger, arrows, Enter and Space open it; inside, arrows move the
active item (wrapping, skipping disabled items), Home/End jump, a typed
letter finds a match, Escape and Tab close. Focus stays on the menu, which
names the active item through `aria-activedescendant`; the item under the
pointer or the keys is highlighted (with the focus ring from the keys).
Closing hands focus back to the trigger. It is not modal: it
joins the layers as a floating layer, so Escape closes only the topmost
overlay — the menu, not a modal beneath it.
