<script lang="ts">
  import Card from '../../components/card/Card.svelte';
  import { CardBody, CardFooter, CardHeader } from '../../components/card-children';

  interface Props {
    title?: string;
    subtitle?: string;
    onClick?: () => void;
    accessibilityLabel?: string;
    withSlots?: boolean;
    withActions?: boolean;
    onPrimary?: () => void;
    titleSnippet?: boolean;
    withAnalytics?: boolean;
  }

  let {
    title = 'Order summary',
    subtitle = '2 items',
    onClick,
    accessibilityLabel,
    withSlots = false,
    withActions = false,
    onPrimary,
    titleSnippet = false,
    withAnalytics = false,
  }: Props = $props();

  const tracked = (key: string, value: string): Record<`data-analytics-${string}`, string> =>
    withAnalytics ? { [`data-analytics-${key}`]: value } : {};
</script>

{#snippet richTitle()}<span data-testid="t">HDFC</span>{/snippet}
{#snippet suffix()}<span data-testid="suffix">2</span>{/snippet}
{#snippet trailing()}<span data-testid="trailing">₹2,000</span>{/snippet}
{#snippet prefix()}<span data-testid="prefix">◎</span>{/snippet}

<Card {onClick} {accessibilityLabel} {...tracked('card', 'summary')} testID="card">
  <CardHeader
    title={titleSnippet ? richTitle : title}
    {subtitle}
    prefix={withSlots ? prefix : undefined}
    suffix={withSlots ? suffix : undefined}
    trailing={withSlots ? trailing : undefined}
    {...tracked('part', 'header')}
    testID="head"
  />
  <CardBody testID="body" {...tracked('part', 'body')}>HDFC Bank</CardBody>
  {#if withActions}
    <CardFooter
      title="Total"
      subtitle="Incl. taxes"
      actions={{ primary: { text: 'Pay', onClick: onPrimary }, secondary: { text: 'Later' } }}
      testID="foot"
    />
  {:else}
    <CardFooter testID="foot" {...tracked('part', 'footer')}><span>Total</span></CardFooter>
  {/if}
</Card>
