<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import {
    SegmentedControl,
    SegmentedControlItem,
    type SegmentedControlStyleProps,
  } from '../../components/segmented-control';
  import { WalletIcon } from '../../icons';

  interface Props {
    inForm?: boolean;
    value?: string;
    name?: string;
    onChange?: (change: { name: string | undefined; value: string }) => void;
    onSubmit?: (data: FormData) => void;
    isDisabled?: boolean;
    disabledValue?: string;
    helpText?: string;
    errorText?: string;
    size?: SegmentedControlStyleProps['size'];
    color?: SegmentedControlStyleProps['color'];
    iconOnly?: boolean;
  }

  let {
    inForm = false,
    value = $bindable(),
    name,
    onChange,
    onSubmit,
    isDisabled,
    disabledValue,
    helpText,
    errorText,
    size,
    color,
    iconOnly = false,
  }: Props = $props();

  const GLYPH = WalletIcon;
</script>

{#snippet control(required: boolean)}
  <SegmentedControl
    label="Pay via"
    bind:value
    {name}
    {onChange}
    {isDisabled}
    isRequired={required}
    {helpText}
    {errorText}
    {size}
    {color}
    testID="group"
    class="mt-2"
  >
    <SegmentedControlItem
      value="upi"
      isDisabled={disabledValue === 'upi'}
      testID="upi"
    >
      UPI
    </SegmentedControlItem>
    <SegmentedControlItem
      value="card"
      isDisabled={disabledValue === 'card'}
      testID="card"
    >
      Card
    </SegmentedControlItem>
    {#if iconOnly}
      <SegmentedControlItem
        value="wallet"
        icon={GLYPH}
        accessibilityLabel="Wallet"
        testID="wallet"
      />
    {:else}
      <SegmentedControlItem value="wallet" icon={GLYPH} testID="wallet">
        Wallet
      </SegmentedControlItem>
    {/if}
  </SegmentedControl>
{/snippet}

{#if inForm}
  <Form name="pay" {onSubmit} formatConstraintError={(code) => `msg:${code}`}>
    {@render control(true)}
    <Button type="submit" testID="continue">Continue</Button>
  </Form>
{:else}
  {@render control(false)}
{/if}
<p data-testid="bound">{value ?? 'none'}</p>
