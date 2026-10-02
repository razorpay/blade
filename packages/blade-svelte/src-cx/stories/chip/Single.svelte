<script lang="ts">
  import { Chip, ChipGroup, Text, type ChipGroupStyleProps } from '../../index';

  interface Props {
    args: ChipGroupStyleProps & {
      label?: string;
      helpText?: string;
      isDisabled?: boolean;
      necessityIndicator?: 'required' | 'optional' | 'none';
      validationState?: 'none' | 'error';
      errorText?: string;
    };
  }

  let { args }: Props = $props();

  // Blade's story values.
  const TYPES = ['Proprietorship', 'Public', 'Small Business'];
  let value = $state<string | readonly string[] | null>(null);
</script>

<div class="flex flex-col gap-3">
  <ChipGroup
    label={args.label}
    accessibilityLabel="Choose one business type from the options below"
    bind:value
    size={args.size}
    color={args.color}
    isDisabled={args.isDisabled}
    necessityIndicator={args.necessityIndicator}
    helpText={args.helpText || undefined}
    validationState={args.validationState}
    errorText={args.errorText || undefined}
  >
    {#each TYPES as type (type)}
      <Chip value={type}>{type}</Chip>
    {/each}
  </ChipGroup>
  <Text size="small" color="muted">value: {JSON.stringify(value)}</Text>
</div>
