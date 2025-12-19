<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  
  const { Story } = defineMeta({
    title: 'Amount',
  });
</script>

<script>
  import Amount from './Amount.svelte';
</script>

<Story name="Basic Amount">
  <Amount value={1234.56} currency="INR" type="body" size="medium" />
</Story>

<Story name="Amount Types">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div>
      <strong>Body:</strong> <Amount value={123456.78} type="body" size="medium" currency="INR" />
    </div>
    <div>
      <strong>Heading:</strong> <Amount value={123456.78} type="heading" size="large" currency="INR" />
    </div>
    <div>
      <strong>Display:</strong> <Amount value={123456.78} type="display" size="xlarge" currency="INR" />
    </div>
  </div>
</Story>

<Story name="Amount Sizes">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <Amount value={1234.56} type="body" size="xsmall" currency="INR" />
    <Amount value={1234.56} type="body" size="small" currency="INR" />
    <Amount value={1234.56} type="body" size="medium" currency="INR" />
    <Amount value={1234.56} type="body" size="large" currency="INR" />
  </div>
</Story>

<Story name="Different Currencies">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <Amount value={1234.56} currency="INR" type="body" size="medium" />
    <Amount value={1234.56} currency="USD" type="body" size="medium" />
    <Amount value={1234.56} currency="EUR" type="body" size="medium" />
    <Amount value={1234.56} currency="GBP" type="body" size="medium" />
  </div>
</Story>

<Story name="Amount with Suffix">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <div>
      <strong>Decimals:</strong> <Amount value={1234567.89} suffix="decimals" currency="INR" type="body" size="medium" />
    </div>
    <div>
      <strong>None:</strong> <Amount value={1234567.89} suffix="none" currency="INR" type="body" size="medium" />
    </div>
    <div>
      <strong>Humanize:</strong> <Amount value={1234567.89} suffix="humanize" currency="INR" type="body" size="medium" />
    </div>
  </div>
</Story>

<Story name="Strikethrough Amount">
  <Amount value={1000} currency="INR" type="body" size="medium" isStrikethrough={true} />
</Story>

<Story name="Amount with Custom Color">
  <Amount value={5000} currency="INR" type="body" size="medium" color="feedback.text.negative.intense" />
</Story>

<Story name="Amount with Currency Code">
  <Amount value={1234.56} currency="INR" currencyIndicator="currency-code" type="body" size="medium" />
</Story>

<Story name="Amount without Affix Subtle">
  <Amount value={1234.56} currency="INR" isAffixSubtle={false} type="body" size="medium" />
</Story>
