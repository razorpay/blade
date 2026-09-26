<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import type { PopoverClasses } from './styles';

  // Native cannot measure into a host: the panel renders inside the root,
  // placed by static classes, with no flip and no presence.
  interface Props {
    id: string;
    anchor: HTMLElement;
    placement: Placement;
    classes: PopoverClasses;
    role: 'dialog' | 'menu';
    accessibilityLabel?: string;
    isFocusMoved: boolean;
    testID?: string;
    onDismiss: (source: 'escape' | 'outside') => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    children: Snippet;
  }

  let {
    id,
    placement,
    classes,
    role,
    accessibilityLabel,
    testID,
    children,
  }: Props = $props();
</script>

<div
  {id}
  {role}
  class={cx(classes.panel, classes.nativePlacement[placement])}
  aria-label={accessibilityLabel}
  data-testid={testID}
>
  {@render children()}
</div>
