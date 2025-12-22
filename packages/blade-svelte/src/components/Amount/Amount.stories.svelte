<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Amount from './Amount.svelte';
  
  const { Story } = defineMeta({
    title: 'Amount',
    component: Amount,
    tags: ['autodocs'],
    args: {
      value: 1234.56,
      currency: 'INR',
      type: 'body',
      size: 'medium',
      suffix: 'decimals',
      isStrikethrough: false,
      isAffixSubtle: true,
      currencyIndicator: 'currency-symbol',
    },
    argTypes: {
      value: {
        control: 'number',
        description: 'The numeric value to display',
      },
      currency: {
        control: 'select',
        options: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
        description: 'Currency code for the amount',
        table: {
          defaultValue: { summary: 'INR' },
        },
      },
      type: {
        control: 'select',
        options: ['body', 'heading', 'display'],
        description: 'Typography type for the amount',
        table: {
          defaultValue: { summary: 'body' },
        },
      },
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge', '3xlarge'],
        description: 'Size of the amount text',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      suffix: {
        control: 'select',
        options: ['decimals', 'none', 'humanize'],
        description: 'How to display the decimal/suffix portion',
        table: {
          defaultValue: { summary: 'decimals' },
        },
      },
      isStrikethrough: {
        control: 'boolean',
        description: 'Whether to show strikethrough styling',
        table: {
          defaultValue: { summary: 'false' },
        },
      },
      isAffixSubtle: {
        control: 'boolean',
        description: 'Whether the currency symbol should be subtle',
        table: {
          defaultValue: { summary: 'true' },
        },
      },
      currencyIndicator: {
        control: 'select',
        options: ['currency-symbol', 'currency-code'],
        description: 'How to display the currency indicator',
        table: {
          defaultValue: { summary: 'currency-symbol' },
        },
      },
      color: {
        control: 'text',
        description: 'Color token for the amount',
      },
    },
  });
</script>

<script>
  // Amount is already imported in the module context
</script>

<!-- Playground story with all controls -->
<Story name="Playground" />

<Story name="Basic Amount" args={{ value: 1234.56, currency: 'INR', type: 'body', size: 'medium' }} />

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

<Story name="Strikethrough Amount" args={{ value: 1000, currency: 'INR', isStrikethrough: true }} />

<Story name="Amount with Custom Color" args={{ value: 5000, currency: 'INR', color: 'feedback.text.negative.intense' }} />

<Story name="Amount with Currency Code" args={{ value: 1234.56, currency: 'INR', currencyIndicator: 'currency-code' }} />

<Story name="Amount without Affix Subtle" args={{ value: 1234.56, currency: 'INR', isAffixSubtle: false }} />
