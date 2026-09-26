<script lang="ts">
  import Accordion from '../../components/accordion/Accordion.svelte';
  import AccordionItem from '../../components/accordion/AccordionItem.svelte';
  import Form from '../../components/form/Form.svelte';
  import type {
    AccordionStyleProps,
    AccordionValue,
  } from '../../components/accordion';

  interface Method {
    name: string;
    title: string;
    subtitle?: string;
    inline?: boolean;
    down?: boolean;
  }

  interface Props extends AccordionStyleProps {
    value?: AccordionValue | null;
    showNumberPrefix?: boolean;
    isRequired?: boolean;
    withTrailing?: boolean;
    withLeading?: boolean;
    /** Which body snippets to pass. */
    body?: 'content' | 'children' | 'both';
    onChange?: (value: unknown) => void;
    onClick?: (method: Method, event: MouseEvent) => boolean | void;
    onSubmit?: (data: Record<string, unknown>) => void;
  }

  let {
    value = $bindable(null),
    isRequired,
    withTrailing = false,
    withLeading = false,
    body = 'content',
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

<Form onSubmit={(data) => onSubmit?.(data)}>
  <Accordion
    bind:value
    {isRequired}
    {variant}
    {size}
    {showNumberPrefix}
    {onChange}
    name="instrument"
    label="Payment methods"
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
      {#snippet inBox()}
        <div data-testid={`content-${method.name}`}>{method.title} options</div>
      {/snippet}
      {#snippet custom()}
        <div data-testid={`custom-${method.name}`}>{method.title} custom</div>
      {/snippet}
      <AccordionItem
        value={method.name}
        title={method.title}
        subtitle={method.subtitle}
        isDisabled={method.down}
        leading={withLeading ? glyph : undefined}
        trailing={withTrailing ? status : undefined}
        content={method.inline && body !== 'children' ? inBox : undefined}
        children={method.inline && body !== 'content' ? custom : undefined}
        onClick={onClick ? (event) => onClick(method, event) : undefined}
      />
    {/each}
  </Accordion>
  <button type="submit" data-testid="submit">Pay</button>
</Form>
