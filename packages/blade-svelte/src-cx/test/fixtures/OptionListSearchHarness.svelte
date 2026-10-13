<script lang="ts">
  import OptionList from '../../components/option-list/OptionList.svelte';
  import OptionItem from '../../components/option-list/OptionItem.svelte';
  import OptionListSection from '../../components/option-list/OptionListSection.svelte';
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';

  interface Props {
    query?: string;
    selectionType?: 'single' | 'multiple' | 'none';
    onChange?: (change: { name?: string; value: unknown }) => void;
  }

  let { query = '', selectionType = 'single', onChange }: Props = $props();
</script>

<OptionList {query} {selectionType} {onChange} accessibilityLabel="Methods" testID="methods">
  <OptionListSection title="Popular" testID="popular">
    <OptionItem value="upi" title="UPI" testID="upi" />
    <OptionItem value="card" title="Cards" testID="card" />
  </OptionListSection>
  <OptionListSection title="More" testID="more">
    <OptionItem value="emi" title="EMI" testID="emi" />
    <OptionItem value="wallet" title="Wallets" text="Paytm PhonePe" testID="wallet" />
  </OptionListSection>
  {#snippet empty({ query: typed })}Nothing for {typed}{/snippet}
</OptionList>

<ActionList {query} accessibilityLabel="Links" testID="links">
  <ActionListItem value="help" title="Help centre" href="/help" testID="help" />
  <ActionListItem value="terms" title="Terms" href="/terms" testID="terms" />
</ActionList>
