# EmptyState

Blade's EmptyState (`components/empty-state/EmptyState.svelte`): an `asset`
snippet capped per `size`, a `title` (a Heading whose level follows the size,
as in Blade; text or a snippet), a `description` (text, or a snippet with a Link in it), and actions in `children`. Which illustration
goes with which state is app data: pass it as `asset`, through `Image` when it
is a lazy asset.

`icon` puts a glyph before the title, or before the description when there
is no title (Figma's small empty state has a single line). The title sits
4px over the description.

## Why `icon` is a prop

Blade DSL's Empty State (Figma) leads the title with an icon sized to the
title and set apart by its own gap, so the component places it:

| Size | Icon | Icon → title |
| --- | --- | --- |
| small | 12px | 4px |
| medium | 16px | 8px |
| large | 20px | 12px |
| xlarge | 32px | 12px |


