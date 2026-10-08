<script lang="ts">
  import Chip from '../../components/chip/Chip.svelte';
  import ChipGroup from '../../components/chip/ChipGroup.svelte';
  import Radio from '../../components/radio/Radio.svelte';
  import RadioGroup from '../../components/radio/RadioGroup.svelte';
  import Checkbox from '../../components/checkbox/Checkbox.svelte';
  import Switch from '../../components/switch/Switch.svelte';
</script>

<ChipGroup label="Tip" testID="chips">
  {#snippet labelRow({ label })}
    {@render label()}<span data-testid="chips-extra">optional</span>
  {/snippet}
  {#snippet helpText()}Tips go to <a href="#staff" data-testid="chips-link">the staff</a>{/snippet}
  <Chip value="10" testID="chip-10">
    {#snippet leading({ isChecked })}<span data-testid="chip-leading" data-checked={isChecked}></span>{/snippet}
    {#snippet children({ isChecked })}₹10{#if isChecked}<span data-testid="chip-picked"> ✓</span>{/if}{/snippet}
  </Chip>
</ChipGroup>

<RadioGroup label="Plan" testID="plans">
  {#snippet labelRow({ label })}
    {@render label()}<span data-testid="plans-extra">compare</span>
  {/snippet}
  <Radio value="monthly" testID="radio-monthly">
    {#snippet children({ isChecked })}Monthly<span data-testid="radio-state" data-checked={isChecked}></span>{/snippet}
  </Radio>
  <Radio value="yearly" isDisabled>
    {#snippet children({ isDisabled })}Yearly<span data-testid="radio-yearly" data-disabled={isDisabled}></span>{/snippet}
    {#snippet helpText()}Save <a href="#y" data-testid="radio-help-link">20%</a>{/snippet}
  </Radio>
</RadioGroup>

<Checkbox testID="terms">
  {#snippet children({ isChecked })}I agree{#if isChecked}<span data-testid="terms-checked"></span>{/if}{/snippet}
  {#snippet helpText()}Read the <a href="#terms" data-testid="terms-link">terms</a>{/snippet}
</Checkbox>

<Switch testID="notify">
  {#snippet children({ isChecked })}Notify {isChecked ? 'on' : 'off'}{/snippet}
</Switch>
