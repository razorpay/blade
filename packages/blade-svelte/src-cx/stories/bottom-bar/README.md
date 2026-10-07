# BottomBar

A bar for the bottom edge of a screen, from Blade DSL's Bottom Bar (Figma):
a container for bottom navigation or a screen's actions. It draws only the
surface and **does not position itself**. Fix it where the app needs it
through `class`.

```svelte
<BottomBar class="fixed inset-x-0 bottom-0 z-10">
  <nav class="flex h-16 flex-row items-center" aria-label="Main">…</nav>
</BottomBar>
```

| Prop | Notes |
| --- | --- |
| `children` | The bar's content: navigation items, actions |
| `class` | Positioning (`fixed`, `sticky`, `absolute`) and anything else; lands on the bar |
| `testID` | As everywhere |

## Look (Figma)

- `surface.background.gray.intense` with a 1px `surface.border.gray.muted`
  top border and the Bottom Nav shadow (8px up, 24px blur).
- 4px padding above and at the sides; the content is Figma's 64px slot,
  sized by what goes in it.
- **Bottom:** Figma ends the bar in an iPhone home-indicator strip. Here the
  bottom padding is the device's safe area (`env(safe-area-inset-bottom)`),
  never less than 4px. The safe area is only non-zero when the page declares
  `viewport-fit=cover` in its viewport meta tag.
