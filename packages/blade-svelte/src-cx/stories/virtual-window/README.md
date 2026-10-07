# VirtualWindow

A scroll viewport that mounts only the rows in view, plus `overscan` rows
beyond each edge. Padding stands in for the rest, so the content's children
are exactly the rows. VirtualOptionList is built on it.

```svelte
<VirtualWindow {keys} class="h-80">
  {#snippet children({ start, end })}
    {#each rows.slice(start, end) as row (row.key)}<Row {row} />{/each}
  {/snippet}
</VirtualWindow>
```

| Prop | Notes |
| --- | --- |
| `keys` | One key per row, in order; measured heights are remembered by key |
| `children` | Renders rows `start` to `end - 1` and nothing else, as direct children |
| `class` | The viewport: give it a bounded height |
| `contentClass` | The element whose direct children are the rows |
| `overscan` | Rows kept mounted beyond each edge (default 3) |
| `reveal` | A row index that must be mounted (keyboard focus); scrolls to it. -1 for none |
| `startAt` | The row it opens scrolled to, read once. -1 for the top |
| `testID` | On the viewport |

Rows can differ in height. Until a row has been measured, its height is
estimated, so the scrollbar settles as you scroll.
