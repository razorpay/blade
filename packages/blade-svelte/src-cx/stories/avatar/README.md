# Avatar and AvatarGroup

From Blade DSL's Avatar and Avatar Group (Figma). An Avatar shows a person
or an entity: their image, else their initials (from `name`), else a glyph
(`UserIcon` by default). A circle is a person; a square is a business or
entity.

```svelte
<Avatar name="Nitin Kumar" src={photo} />
<Avatar name="Razorpay" variant="square" color="primary" />

<AvatarGroup size="small" maxCount={3} accessibilityLabel="Reviewers">
  <Avatar name="Asha Rao" />
  <Avatar name="Dev Mehta" />
  …
</AvatarGroup>
```

| Avatar prop | Notes |
| --- | --- |
| `name` | Initials come from it (two letters of one name, else the first and last initials); it also names the avatar |
| `src`, `alt`, `srcSet`, `crossOrigin`, `referrerPolicy` | The image. Until it loads, or if it fails, the initials or glyph show. `alt` defaults to `name`; give it for a glyph-only avatar |
| `icon` | The glyph when there's no name or image |
| `size` | `xsmall` 20px, `small` 28, `medium` 36 (default), `large` 48, `xlarge` 56. Inside a group the group's size wins |
| `variant` | `circle` (default) or `square` |
| `color` | The tint behind initials or the glyph: `neutral` (default), `primary`, `positive`, `negative`, `notice`, `information` |
| `isSelected` | A 2px primary border |
| `onClick`, `href` (`target`, `rel`) | A button or a link, with the hover tint and the focus ring |
| `topAddon` | A snippet at the top right: an indicator dot, 6–10px by size |
| `bottomAddon` | A snippet at the bottom right: a trusted badge (an image) or a glyph, 8–20px by size |

| AvatarGroup prop | Notes |
| --- | --- |
| `size` | Every avatar's size |
| `density` | How far each avatar overlaps the one before: `compact` (half an avatar, default), `normal` (16px; 14px at xsmall), `comfortable` (8px) |
| `maxCount` | How many show; the rest fold into a "+N" avatar |
| `accessibilityLabel` | Names the group |

### Why `topAddon` and `bottomAddon` are snippets

They're Figma's Indicator and trusted badge, each in a box sized and
placed per avatar size; a trusted badge is a multi-coloured image, not a
tintable glyph, so the slot takes any content and sizes it.

## Look (Figma)

The face sits on a white disc or tile (the tint is translucent), with a
1px `surface.border.gray.subtle` rim (React draws none). The tint is
`interactive.background.{color}.faded` (`…fadedHighlighted` under the
pointer) and the initials or glyph `interactive.text.{color}.normal`.
Initials are Body Semibold (10/13 at xsmall and small, 12/17 medium,
14/20 large) and Heading 20/26 at xlarge (React uses 18/24). A square's
radius is 4, 4, 8, 8 or 12px by size. "+N" is `surface.background.gray.subtle`
with `interactive.text.neutral.muted`.
