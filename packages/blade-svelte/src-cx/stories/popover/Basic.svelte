<script lang="ts">
  import { Button, LayerHost, Popover, Text } from '../../index';

  interface Props {
    args: {
      placement?:
        | 'bottom-start'
        | 'bottom'
        | 'bottom-end'
        | 'top'
        | 'right'
        | 'left';
    };
  }

  let { args }: Props = $props();
</script>

<div class="relative flex h-64 w-80 items-start p-2">
  <Popover placement={args.placement} accessibilityLabel="Convenience fee">
    <Button variant="secondary" size="small" type="button">Why a fee?</Button>
    {#snippet content({ close })}
      <div class="flex flex-col items-start gap-3">
        <Text size="small">
          Your bank charges 2% for this card. It goes to the bank, not to the
          merchant.
        </Text>
        <Button size="xsmall" type="button" onClick={close}>Got it</Button>
      </div>
    {/snippet}
  </Popover>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
