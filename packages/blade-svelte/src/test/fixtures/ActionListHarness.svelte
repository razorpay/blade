<script lang="ts">
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';
  import ActionListSection from '../../components/action-list/ActionListSection.svelte';

  interface Props {
    isMultiple?: boolean;
  }

  let { isMultiple = false }: Props = $props();
  let value = $state<string | readonly string[] | null>(null);
</script>

<ActionList
  bind:value
  selectionType={isMultiple ? 'multiple' : 'single'}
  name="plan"
  label="Plan"
  testID="list"
>
  <ActionListSection title="Plans" testID="plans">
    <ActionListItem value="basic" title="Basic" description="For new businesses" testID="basic" />
    <ActionListItem value="pro" title="Pro" testID="pro" />
    <ActionListItem value="legacy" title="Legacy" isDisabled testID="legacy" />
  </ActionListSection>
  <ActionListSection title="More" testID="more">
    <ActionListItem value="compare" title="Compare plans" href="/plans" testID="compare" />
    <ActionListItem value="cancel" title="Cancel subscription" intent="negative" testID="cancel" />
  </ActionListSection>
</ActionList>
<span data-testid="bound">{JSON.stringify(value)}</span>
