<script lang="ts">
  import { LayerHost, Tooltip } from '../../index';
  import type { Placement } from '../../runes';

  interface Props {
    args: { placement?: Placement };
  }

  let { args }: Props = $props();

  const corners = [
    'left-2 top-2',
    'right-2 top-2',
    'bottom-2 left-2',
    'bottom-2 right-2',
  ];
</script>

<div
  data-testid="frame"
  class="relative h-64 max-w-96 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  {#each corners as corner, i (corner)}
    <div class="absolute {corner}">
      <Tooltip content="Stays inside the frame" placement={args.placement} testID={`tip-${i}`}>
        <button data-testid={`trigger-${i}`} class="rounded-xsmall border-thin border-solid border-surface-gray-muted px-2 py-1 text-25 leading-50">
          Info
        </button>
      </Tooltip>
    </div>
  {/each}
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
