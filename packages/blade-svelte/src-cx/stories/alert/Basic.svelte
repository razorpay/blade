<script lang="ts">
  import { Alert, Button, type AlertStyleProps } from '../../index';

  interface Props {
    args: AlertStyleProps & {
      title?: string;
      description?: string;
      isDismissible?: boolean;
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(true);
</script>

<div class="flex flex-col items-start gap-3">
  <Alert
    bind:isOpen
    color={args.color}
    emphasis={args.emphasis}
    title={args.title || undefined}
    description={args.description ?? ''}
    isDismissible={args.isDismissible}
  />
  {#if !isOpen}
    <Button type="button" size="small" onClick={() => (isOpen = true)}>
      Show it again
    </Button>
  {/if}
</div>
