<script lang="ts">
  import { ActionList, ActionListItem, Text } from '../../index';
  import { BankIcon, UpiIcon, WalletIcon } from '../../icons';

  interface Props {
    args: { isDeselectable?: boolean; isDisabled?: boolean };
  }

  let { args }: Props = $props();
  let value = $state<string | readonly string[] | null>('upi');
</script>

<div class="grid max-w-80 gap-3">
  <ActionList
    bind:value
    label="Pay with"
    isDeselectable={args.isDeselectable}
    isDisabled={args.isDisabled}
  >
    <ActionListItem value="upi" title="UPI" description="Any UPI app" icon={UpiIcon} />
    <ActionListItem value="netbanking" title="Netbanking" icon={BankIcon} />
    <ActionListItem value="wallet" title="Wallet" icon={WalletIcon} />
  </ActionList>
  <Text size="small" color="muted">value: {JSON.stringify(value)}</Text>
</div>
