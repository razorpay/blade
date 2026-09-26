<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import {
    SegmentedControl,
    SegmentedControlItem,
    type SegmentedControlStyleProps,
  } from '../../components/segmented-control';

  interface Props {
    inForm?: boolean;
    value?: string;
    name?: string;
    onChange?: (value: string) => void;
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

  const GLYPH =
    '<svg viewBox="0 0 16 16" data-glyph="wallet"><path d="M0 0h16v16H0z" fill="currentColor"/></svg>';
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
        leading={GLYPH}
        accessibilityLabel="Wallet"
        testID="wallet"
      />
    {:else}
      <SegmentedControlItem value="wallet" leading={GLYPH} testID="wallet">
        Wallet
      </SegmentedControlItem>
    {/if}
  </SegmentedControl>
{/snippet}

{#if inForm}
  <Form name="pay" {onSubmit} formatConstraintError={(code) => `msg:${code}`}>
    {@render control(true)}
    <Button testID="continue">Continue</Button>
  </Form>
{:else}
  {@render control(false)}
{/if}
<p data-testid="bound">{value ?? 'none'}</p>
