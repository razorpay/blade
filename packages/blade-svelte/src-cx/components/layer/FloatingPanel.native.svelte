<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import type { FloatingClasses } from '../modal/styles';

  // Native cannot measure into a host: the panel renders inside the
  // trigger's wrapper, placed by static classes, with no flip and no
  // presence.
  interface Props {
    id: string;
    anchor: HTMLElement;
    placement: Placement;
    classes: FloatingClasses;
    role: 'dialog' | 'menu';
    accessibilityLabel?: string;
    labelledBy?: string;
    describedBy?: string;
    isFocusMoved: boolean;
    onOutside: () => void;
    onClosed?: () => void;
    testID?: string;
    class?: string;
    children: Snippet;
  }

  let {
    id,
    placement,
    classes,
    role,
    accessibilityLabel,
    labelledBy,
    describedBy,
    testID,
    class: className = '',
    children,
  }: Props = $props();
</script>

<div
  {id}
  {role}
  class={cx(classes.panel, classes.nativePlacement[placement], className)}
  aria-label={labelledBy ? undefined : accessibilityLabel}
  aria-labelledby={labelledBy}
  aria-describedby={describedBy}
  data-testid={testID}
>
  {@render children()}
</div>
