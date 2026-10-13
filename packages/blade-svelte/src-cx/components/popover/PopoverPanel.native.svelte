<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
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
    role?: 'dialog' | 'menu';
    accessibilityLabel?: string;
    /** The id of the element that names the panel (its title). */
    labelledBy?: string;
    isFocusMoved: boolean;
    testID?: string;
    onDismiss: (source: 'escape' | 'outside') => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    /** For a hover-opened panel: the pointer over the panel keeps it open. */
    onPointerEnter?: () => void;
    onPointerLeave?: () => void;
    matchesAnchorWidth?: boolean;
    focusOwner?: Attachment<HTMLElement>;
    activeDescendant?: string;
    children: Snippet;
  }

  let {
    id,
    placement,
    classes,
    role,
    accessibilityLabel,
    labelledBy,
    testID,
    children,
  }: Props = $props();
</script>

<div
  {id}
  {role}
  class={cx(classes.panel, classes.nativePlacement[placement])}
  aria-label={labelledBy ? undefined : accessibilityLabel}
  aria-labelledby={labelledBy}
  data-testid={testID}
>
  {@render children()}
</div>
