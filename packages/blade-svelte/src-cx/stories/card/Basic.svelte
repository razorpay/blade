<script lang="ts">
  import {
    Badge,
    Button,
    Text,
  } from '../../index';
  import { Card, type CardStyleProps } from '../../components/card';

  interface Props {
    args: CardStyleProps;
  }

  let { args }: Props = $props();
</script>

<div class="max-w-96">
  <Card
    variant={args.variant}
    padding={args.padding}
    color={args.color}
    title="Order summary"
    subtitle="2 items"
  >
    {#snippet header({ title, subtitle })}
      <div>
        {@render title()}
        {@render subtitle()}
      </div>
      <Badge color="positive">New</Badge>
    {/snippet}
    <Text size="small" color="muted">
      title and subtitle are drawn by the card and handed to header to place; the header and
      footer are hairlines with 12px either side.
    </Text>
    {#snippet footer()}
      <span class="flex items-center justify-end gap-3">
        <Button variant="secondary" size="small">Secondary</Button>
        <Button size="small">Primary</Button>
      </span>
    {/snippet}
  </Card>
</div>
