<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Chip from '../../components/chip/Chip.svelte';
  import ChipGroup from '../../components/chip/ChipGroup.svelte';
  import Form from '../../components/form/Form.svelte';

  interface Props {
    selectionType?: 'single' | 'multiple';
    value?: string | readonly string[] | null;
    onChange?: (change: { name: string | undefined; values: string[] }) => void;
    isDisabled?: boolean;
    color?: 'primary' | 'positive' | 'negative';
    inForm?: boolean;
    onSubmit?: (data: FormData) => void;
    necessityIndicator?: 'required' | 'optional' | 'none';
    helpText?: string;
  }

  let {
    selectionType = 'single',
    value: initialValue,
    onChange,
    isDisabled,
    color,
    inForm = false,
    onSubmit,
    necessityIndicator,
    helpText,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let value = $state(initialValue);
  const bound = $derived(
    Array.isArray(value) ? value.join(',') : ((value as string | null | undefined) ?? 'none')
  );
</script>

{#snippet group()}
  <ChipGroup
    label="Business type"
    name="type"
    {selectionType}
    bind:value
    {onChange}
    {isDisabled}
    {color}
    {necessityIndicator}
    {helpText}
    testID="group"
  >
    <Chip value="proprietorship" testID="chip-0">Proprietorship</Chip>
    <span>Or</span>
    <Chip value="public" testID="chip-1">Public</Chip>
    <Chip value="closed" isDisabled testID="chip-2">Closed</Chip>
    <Chip value="npo" color="negative" testID="chip-3">Non-profit</Chip>
  </ChipGroup>
{/snippet}

{#if inForm}
  <Form name="business" {onSubmit} formatConstraintError={(code) => `msg:${code}`}>
    {@render group()}
    <Button type="submit" testID="continue">Continue</Button>
  </Form>
{:else}
  {@render group()}
{/if}
<p data-testid="bound">{bound}</p>
