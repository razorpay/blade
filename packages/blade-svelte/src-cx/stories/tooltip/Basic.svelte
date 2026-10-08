<script lang="ts">
  import { Button, Tooltip } from '../../index';
  import type { Placement } from '../../runes';
  import { stamp } from '../helpers';

  interface Props {
    args: { placement?: Placement; title?: string; content?: string; isDisabled?: boolean };
  }

  let { args }: Props = $props();

  let log = $state<string[]>([]);
</script>

<div class="grid [justify-items:start] gap-4 p-16">
  <Tooltip
    title={args.title || undefined}
    content={args.content ?? ''}
    placement={args.placement}
    isDisabled={args.isDisabled}
    testID="tip"
    onOpenChange={({ isOpen }) => {
      log = [`${stamp()} onOpenChange ${isOpen}`, ...log].slice(0, 8);
    }}
  >
    <Button variant="secondary" type="button" testID="trigger">Convenience fee</Button>
  </Tooltip>
  <ul class="font-mono grid gap-1 text-25 leading-50 text-surface-gray-subtle">
    {#each log as line (line)}
      <li>{line}</li>
    {:else}
      <li>Hover, focus or tap the button.</li>
    {/each}
  </ul>
</div>
