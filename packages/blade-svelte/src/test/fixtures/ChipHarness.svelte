<script lang="ts">
  import Chip from '../../components/chip/Chip.svelte';
  import ChipGroup from '../../components/chip/ChipGroup.svelte';

  interface Props {
    selectionType?: 'single' | 'multiple';
    value?: string | readonly string[] | null;
    onChange?: (change: { name: string | undefined; value: string | null | string[] }) => void;
    isDisabled?: boolean;
    color?: 'primary' | 'positive' | 'negative';
    necessityIndicator?: 'required' | 'optional' | 'none';
    helpText?: string;
  }

  let {
    selectionType = 'single',
    value: initialValue,
    onChange,
    isDisabled,
    color,
    necessityIndicator,
    helpText,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let value = $state(initialValue);
  const bound = $derived(
    Array.isArray(value) ? value.join(',') : ((value as string | null | undefined) ?? 'none')
  );
</script>

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
<p data-testid="bound">{bound}</p>
