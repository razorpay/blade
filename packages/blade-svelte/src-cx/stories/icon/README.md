# Icon

An icon is **data**, not a component and not a snippet: a string holding SVG
markup (what `import lock from './lock.svg?raw'` yields) or a URL. The host
renders it through `Icon`, which is what lets a host pick the size and lets
native draw it — native has no inline `<svg>`, so `Icon.native.svelte` sends
the same string as an image.

```svelte
<script>
  import { Icon, icons } from '../../index';
</script>

<Icon source={icons.chevronDown} size="large" color="muted" />
<Icon source={icons.chevronDown} class="-rotate-90" />
<Alert color="notice" icon={icons.warning}>…</Alert>
```

There is one chevron. Rotate it for the other directions (`-rotate-90`
points right); the accordion turns it in place so the change animates.

| Prop | Notes |
| --- | --- |
| `source` | SVG markup or a URL. Markup is inlined so it paints with the text colour; a URL loads as an image |
| `size` | Style axis: `small` 12px, `medium` 16px (default), `large` 20px, `xlarge` 24px |
| `color` | Style axis, the Text colours. Default `inherit`: the glyph follows its host |
| `accessibilityLabel` | Names the icon (`role="img"`). Without it the icon is `aria-hidden` — right inside anything that already has a name |
| `class`, `testID` | As everywhere |

Components that take an icon (`Alert.icon`, later `Link` and `IconButton`)
take the data and size it themselves. Free-form slots (`TextInput`
`leading`/`trailing`) stay snippets: put an `<Icon>` inside.

## Glyph rules

Files live in `components/icons/` and are exported by name from
`icons.ts`: `currentColor` only, a `viewBox` and no root `width`/`height`,
SVGO'd, under 1KB — the test suite checks all four. Most are copies of
`app/v2/modules/common/icons`; `bank` and `phone` come from Blade. An app can
pass its own `?raw` import as `source` without adding to the set.
