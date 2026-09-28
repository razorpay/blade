<script lang="ts">
  import {
    Button,
    Card,
    Heading,
    Text,
    type CardStyleProps,
  } from '../../index';

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
    accessibilityLabel="Order summary"
  >
    {#snippet header()}
      <Heading as="h3" size="small">Order summary</Heading>
      <Text size="small" color="muted">2 items</Text>
    {/snippet}
    <Text size="small" color="muted">
      The header and footer are hairlines with 12px either side; what goes in them is yours.
    </Text>
    {#snippet footer()}
      <span class="flex items-center justify-end gap-3">
        <Button variant="secondary" size="small">Secondary</Button>
        <Button size="small">Primary</Button>
      </span>
    {/snippet}
  </Card>
</div>
