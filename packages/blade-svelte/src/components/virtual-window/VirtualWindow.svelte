<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createVirtual } from '../../runes/virtual/virtual.svelte';
  import { resolveVirtualWindow } from './styles';

  interface Props {
    /** One key per row, in order. Measured heights are remembered by key. */
    keys: readonly string[];
    /** Rows kept mounted beyond each edge of the viewport. @default 3 */
    overscan?: number;
    /**
     * A row that must be mounted (the keyboard moved to it): when it is
     * outside the mounted slice the viewport scrolls to where it is
     * predicted to be. -1 for none.
     * @default -1
     */
    reveal?: number;
    /**
     * The row the window opens scrolled to, read once at mount (a list
     * opens at its pick). -1 for the top.
     * @default -1
     */
    startAt?: number;
    /** The scroll viewport; give it a bounded height. */
    class?: string;
    /** The element whose direct children are the rows. */
    contentClass?: string;
    /** On the viewport. */
    testID?: string;
    /**
     * Renders rows `start` to `end - 1` — and nothing else — as direct
     * children: child i is measured as row `start + i`.
     */
    children: Snippet<[{ start: number; end: number }]>;
  }

  let {
    keys,
    overscan = 3,
    reveal = -1,
    startAt = -1,
    class: className = '',
    contentClass = '',
    testID,
    children,
  }: Props = $props();

  // Padding stands in for the unmounted rows — not spacer elements, so the
  // content's children are exactly the rows.
  const virtual = createVirtual({
    keys: () => keys,
    overscan: () => overscan,
    reveal: () => reveal,
    startAt: () => startAt,
  });
  const range = $derived(virtual.range);
  const classes = resolveVirtualWindow();
</script>

<svelte:window onresize={virtual.measure} />

<div
  class={cx(classes.viewport, className)}
  data-testid={testID}
  onscroll={virtual.update}
  {@attach virtual.viewport}
>
  <!-- The padding is a measured length: no class can carry it. -->
  <div
    class={contentClass}
    style:padding-top="{range.padTop}px"
    style:padding-bottom="{range.padBottom}px"
    {@attach virtual.content}
  >
    {@render children({ start: range.start, end: range.end })}
  </div>
</div>
