<script lang="ts">
  import { ActionList, Dropdown, ActionListItem, LayerHost, type DropdownStyleProps } from '../../index';
  import { BankIcon, UpiIcon, WalletIcon } from '../../icons';

  interface Props {
    args: DropdownStyleProps & { isDisabled?: boolean; isDeselectable?: boolean };
  }

  let { args }: Props = $props();

  let value = $state<string | readonly string[] | null>(null);
</script>

<div class="relative h-80 max-w-sm p-2">
  <Dropdown
    bind:value
    label="Payment method"
    placeholder="Select a method"
    helpText="You can change it later"
    size={args.size}
    isDisabled={args.isDisabled}
    isDeselectable={args.isDeselectable}
    testID="dropdown"
  >
    {#snippet content()}
      <ActionList>
        <ActionListItem value="upi" title="UPI" leading={UpiIcon} />
        <ActionListItem value="netbanking" title="Netbanking" leading={BankIcon} />
        <ActionListItem value="wallet" title="Wallet" description="Paytm, PhonePe, Amazon Pay" leading={WalletIcon} />
        <ActionListItem value="emi" title="EMI" isDisabled />
      </ActionList>
    {/snippet}
  </Dropdown>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
