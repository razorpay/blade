<script lang="ts">
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';
  import Form from '../../components/form/Form.svelte';
  import type {
    CardGroupStyleProps,
    CardGroupValue,
  } from '../../components/card-group';

  interface Method {
    name: string;
    title: string;
    subtitle?: string;
    inline?: boolean;
    down?: boolean;
  }

  interface Props extends CardGroupStyleProps {
    value?: CardGroupValue | null;
    showNumberPrefix?: boolean;
    isRequired?: boolean;
    withTrailing?: boolean;
    withLeading?: boolean;
    /** Which body snippets to pass. */
    bodyKind?: 'body' | 'children' | 'both';
    /** A labelArea and a snippet help line. */
    withExtras?: boolean;
    onChange?: (change: { name: string | undefined; value: unknown }) => void;
    onClick?: (method: Method, event: MouseEvent) => boolean | void;
    onSubmit?: (data: Record<string, unknown>) => void;
  }

  let {
    value = $bindable(null),
    isRequired,
    withTrailing = false,
    withLeading = false,
    bodyKind = 'body',
    withExtras = false,
    variant,
    size,
    showNumberPrefix,
    onChange,
    onClick,
    onSubmit,
  }: Props = $props();

  const methods: Method[] = [
    { name: 'upi', title: 'UPI', subtitle: 'Any UPI app', inline: true },
    { name: 'card', title: 'Cards' },
    { name: 'wallet', title: 'Wallets', inline: true },
    { name: 'emi', title: 'EMI', inline: true, down: true },
  ];
</script>

{#snippet labelExtras({ label }: { label: import('svelte').Snippet })}
  {@render label()}
  <span data-testid="label-extra">Secure</span>
{/snippet}

{#snippet richHelp()}
  Need help? <a href="#help" data-testid="help-link">Ask us</a>
{/snippet}

<Form onSubmit={(data) => onSubmit?.(data)}>
  <CardGroup
    bind:value
    {isRequired}
    {variant}
    {size}
    {showNumberPrefix}
    {onChange}
    name="instrument"
    label="Payment methods"
    labelArea={withExtras ? labelExtras : undefined}
    helpText={withExtras ? richHelp : undefined}
    testID="methods"
    class="mt-2"
  >
    {#each methods as method (method.name)}
      {#snippet status()}
        <span data-testid={`status-${method.name}`}>!</span>
      {/snippet}
      {#snippet glyph()}
        <span data-testid={`leading-${method.name}`}>*</span>
      {/snippet}
      {#snippet inBox({ collapse }: { collapse: () => void })}
        <div data-testid={`content-${method.name}`}>{method.title} options</div>
        <button type="button" data-testid={`collapse-${method.name}`} onclick={collapse}>Use</button>
      {/snippet}
      {#snippet custom()}
        <div data-testid={`custom-${method.name}`}>{method.title} custom</div>
      {/snippet}
      <CardGroupItem
        value={method.name}
        title={method.title}
        subtitle={method.subtitle}
        isDisabled={method.down}
        leading={withLeading ? glyph : undefined}
        trailing={withTrailing ? status : undefined}
        body={method.inline && bodyKind !== 'children' ? inBox : undefined}
        children={method.inline && bodyKind !== 'body' ? custom : undefined}
        onClick={onClick ? (event) => onClick(method, event) : undefined}
      />
    {/each}
  </CardGroup>
  <button type="submit" data-testid="submit">Pay</button>
</Form>
