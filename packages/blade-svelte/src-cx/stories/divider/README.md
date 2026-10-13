# Divider

Style-only: no behaviour model behind it
(`components/divider/Divider.svelte`). It renders an `<hr>`, so it is a
separator to assistive tech; a vertical one sets `aria-orientation`.

| Prop | Notes |
| --- | --- |
| `orientation` | Style axis: `horizontal`, `vertical` (stretches in a flex row) |
| `line` | Style axis: `solid`, `dashed` |
| `class`, `testID` | Spacing around the line goes in `class` (`my-3`) |
