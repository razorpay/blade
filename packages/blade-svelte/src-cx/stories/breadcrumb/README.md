# Breadcrumb

The user's location as a trail of links, from Blade DSL's Breadcrumb
(Figma). A `<nav>` (named "Breadcrumb" by default) around an ordered list;
the current page is text, marked `aria-current="page"`.

```svelte
<Breadcrumb>
  <BreadcrumbItem href="/" icon={HomeIcon} accessibilityLabel="Home" />
  <BreadcrumbItem href="/payments">Payments</BreadcrumbItem>
  <BreadcrumbItem href="/payments/123" isCurrentPage>Payment 123</BreadcrumbItem>
</Breadcrumb>
```

| Breadcrumb prop | Notes |
| --- | --- |
| `size` | `small` 12/17, `medium` 14/20 (default), `large` 16/24 (subtle only) |
| `color` | `primary` (default, as React), `neutral`, `white` (over a dark or brand surface) |
| `emphasis` | `subtle` (default): links between slashes. `intense`: Figma's pills between chevrons, the current page in a tinted pill (Figma draws it at one size) |
| `showLastSeparator` | A separator after the last item too |
| `accessibilityLabel` | Names the nav; default "Breadcrumb" |

| BreadcrumbItem prop | Notes |
| --- | --- |
| `href`, `onClick` | The link; `onClick` for a router (`event.preventDefault()` to stay put) |
| `isCurrentPage` | The page you're on: plain text (or the selected pill) |
| `children` | The label; omit for an icon-only item |
| `icon` | Before the label |
| `accessibilityLabel` | Names an icon-only item |

## Look (Figma)

**Subtle:** Links (Body Medium; a 12/16/16px glyph) 4px apart with a slash
in `surface.text.gray.muted` (`staticWhite.muted` on white). A neutral or
white trail's links take Blade's 0.56 opacity; primary's are full. The
current page is Body Medium `surface.text.gray.normal` (`staticWhite.normal`).

**Intense:** 28px pills, 12px in, 16px radius, Body Small 12/18, 24px apart
with a 16px chevron; `interactive.text.gray.subtle` at rest with the gray
wash under the pointer; the current page Semibold on
`interactive.background.primary.faded` (white: `staticBlack.faded` with
white text). `neutral` intense uses a gray selected pill.
