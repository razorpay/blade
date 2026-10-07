# Icon

An icon is **an SVG file**, imported like any asset. Blade's set is `@razorpay/blade-svelte/icons`, named as in Blade React; the app's own icons are SVGs in its icon folders. Icons are single-colour: they paint with the text colour. A logo, a flag or anything else with its own colours is an `Image`.

```svelte
<script lang="ts">
  import { Alert, Icon } from '@razorpay/blade-svelte/cx';
  import { ChevronDownIcon, WalletIcon } from '@razorpay/blade-svelte/icons';
  import RocketIcon from '../icons/rocket.svg';
</script>

<Icon source={ChevronDownIcon} size="large" color="muted" />
<Icon source={RocketIcon} color="primary" />
<Alert color="notice" icon={WalletIcon} description="…" />
```

## With and without the font plugin

**Without a plugin**, an icon import is the SVG's URL. `Icon` draws it as a CSS mask over the text colour: tinted and sized like any icon, one small request (or an inlined data URI) per icon.
- Webpack needs an asset rule for SVGs, e.g. `{ test: /\.svg$/, type: 'asset' }`.
- Vite handles SVGs out of the box.

**With `bladeIconFontPlugin`**, the same imports become glyphs of a `blade-icons` font that holds exactly the icons the build loads, from Blade's set and from the app's folders. No inline styles, one cached file.

```ts
// vite.config.ts
import { bladeIconFontPlugin } from '@razorpay/blade-svelte/vite';

export default defineConfig({
  plugins: [bladeIconFontPlugin({ extra: ['./src/icons'] }), svelte()],
});
```

```js
// webpack.config.mjs
import { bladeIconFontPlugin } from '@razorpay/blade-svelte/webpack';

export default {
  plugins: [bladeIconFontPlugin({ extra: ['./src/icons'] })],
};
```

- **`extra`:** the app's icon folders. Any plain import of an SVG in them becomes a glyph.
  - Files are named in kebab-case (`rocket-launch.svg`), single colour, filled shapes only (no strokes, transforms or opacity). The build says which rule a file breaks.
  - SVGs elsewhere, and `?url`/`?raw` imports, stay as they are.
- **What goes in the font:** only icons something imports. Named imports from `@razorpay/blade-svelte/icons` are rewritten to the icon's own file, so one icon loads one module. A namespace or dynamic import of the barrel takes the whole set (about 40KB of woff2); prefer named imports.
- **Builds:** the font is emitted as a hashed asset. It's registered from JS (`FontFace`) when the first icon module runs, so there's no CSS to import.
- **Dev:** the font is rebuilt as pages bring in new icons, and swapped in without a reload. A glyph can be blank for a moment the first time it appears.

There is one chevron. Rotate it for the other directions (`-rotate-90` points right); the card group turns it in place so the change animates.

| Prop | Notes |
| --- | --- |
| `source` | An icon import (`IconSource`): a glyph with the font plugin, the SVG's URL without |
| `size` | Style axis: `small` 12px, `medium` 16px (default), `large` 20px, `xlarge` 24px |
| `color` | Style axis, the Text colours. Default `inherit`: the glyph follows its host |
| `accessibilityLabel` | Names the icon (`role="img"`). Without it the icon is `aria-hidden`, which is right inside anything that already has a name |
| `class`, `testID` | As everywhere |

Components that take an icon (`Alert.icon`, `IconButton.icon`, `Link.icon`, …) take a token and size it themselves. Free-form slots (TextInput's `leading`/`trailing`) stay snippets: put an `<Icon>` inside.

## The glyph set

`src-cx/icons/` is generated from Blade React's icons by `scripts/icon-svgs/extract-blade.mjs`, which `yarn generate-icons` runs. It writes:
- one `currentColor` SVG per glyph;
- the barrel (`glyphs.js`, one `export { default as InfoIcon } from './svg/info.svg'` per icon, typed by `glyphs.d.ts`) and the names (`names.ts`);
- `codepoints.json`, the lockfile. A glyph's codepoint never changes, and a removed glyph's code is never reused.

Blade's stroke-drawn icons (Bluetooth, Scissors) are left out until they're outlined, because a font can only fill shapes.

If an app has no font plugin, these SVGs are what it draws, through the mask.
