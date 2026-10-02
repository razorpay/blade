<script lang="ts">
  import { Button, Icon, icons, LayerHost, Popover, Text } from '../../index';

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
  >
    {#snippet trigger()}
      <Button variant="secondary" size="small" type="button">Why a fee?</Button>
    {/snippet}
    {#snippet titleLeading()}<Icon source={icons.info} size="medium" />{/snippet}
    {#snippet children()}
      <Text size="small">
        Your bank charges 2% for this card. It goes to the bank, not to the
        merchant.
      </Text>
    {/snippet}
    {#snippet footer()}
      <div class="flex justify-end">
        <Button size="small" type="button">Pay with UPI instead</Button>
      </div>
    {/snippet}
  </Popover>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
