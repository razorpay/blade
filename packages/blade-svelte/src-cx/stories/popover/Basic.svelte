<script lang="ts">
  import { Button, Icon, icons, LayerHost, Popover, Text, Tooltip } from '../../index';

  interface Props {
    args: {
      placement?:
        | 'top'
        | 'top-start'
        | 'bottom-start'
        | 'bottom'
        | 'bottom-end'
        | 'right'
        | 'left';
      openInteraction?: 'click' | 'hover';
      title?: string;
      withTooltip?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<div class="relative flex h-96 w-[36rem] items-center justify-center p-2">
  <Popover
    placement={args.placement}
    openInteraction={args.openInteraction}
    title={args.title || undefined}
    accessibilityLabel="Convenience fee"
    testID="popover"
  >
    {#snippet trigger()}
      <Button variant="secondary" size="small" type="button" testID="trigger">Why a fee?</Button>
    {/snippet}
    {#snippet titleLeading()}<Icon source={icons.info} size="medium" />{/snippet}
    {#snippet children()}
      <Text size="small">
        Your bank charges 2% for this card. It goes to the bank, not to the
        merchant.
      </Text>
      {#if args.withTooltip}
        <!-- A tooltip inside the popover: Escape closes only the top one. -->
        <Tooltip content="Set by your bank" testID="tip">
          {#snippet trigger()}
            <button type="button" data-testid="tip-trigger" class="mt-2 text-75 underline">Who sets it?</button>
          {/snippet}
        </Tooltip>
      {/if}
    {/snippet}
    {#snippet footer()}
      <div class="flex justify-end">
        <Button size="small" type="button">Pay with UPI instead</Button>
      </div>
    {/snippet}
  </Popover>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
