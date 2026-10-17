<script lang="ts">
  import type { NavScreenControl } from '../../runes/nav-stack/nav';

  interface Props {
    title: string;
    isGuarded?: boolean;
    screen: NavScreenControl<string>;
  }

  let { title, isGuarded = false, screen }: Props = $props();

  // svelte-ignore state_referenced_locally
  if (isGuarded) {
    screen.onBack(() => true);
  }
</script>

<h2 data-testid="title">{title}</h2>
<button type="button" data-testid="done" onclick={() => screen.pop('done')}>
  Done
</button>
