<script lang="ts">
  import { BladeProvider, Button, Text, Tooltip } from '../../index';
    import { Popover } from '../../components/popover';
  import { InfoIcon } from '../../icons';

  interface Props {
    args: {
      placement?: 'top' | 'top-start' | 'bottom-start' | 'bottom' | 'bottom-end' | 'right' | 'left';
      title?: string;
      withTooltip?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<div class="relative flex h-96 w-[36rem] items-center justify-center p-2">
<BladeProvider>
  <Popover
    placement={args.placement}
    title={args.title || undefined}
    leading={InfoIcon}
    accessibilityLabel="Convenience fee"
    testID="popover"
  >
    {#snippet children()}
      <Button variant="secondary" size="small" type="button" testID="trigger">Why a fee?</Button>
    {/snippet}
    {#snippet body()}
      <Text size="small">
        Your bank charges 2% for this card. It goes to the bank, not to the
        merchant.
      </Text>
      {#if args.withTooltip}
        <!-- A tooltip inside the popover: Escape closes only the top one. -->
        <Tooltip content="Set by your bank" testID="tip">
          <button type="button" data-testid="tip-trigger" class="mt-2 text-75 underline">Who sets it?</button>
        </Tooltip>
      {/if}
    {/snippet}
    {#snippet footer()}
      <div class="flex justify-end">
        <Button size="small" type="button">Pay with UPI instead</Button>
      </div>
    {/snippet}
  </Popover>
</BladeProvider>
</div>
