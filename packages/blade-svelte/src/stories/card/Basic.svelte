<script lang="ts">
  import { Badge, Text } from '../../index';
  import { Card, type CardStyleProps } from '../../components/card';
  import { CardBody, CardFooter, CardHeader } from '../../components/card-children';

  interface Props {
    args: CardStyleProps;
  }

  let { args }: Props = $props();
</script>

{#snippet badge()}<Badge color="positive">New</Badge>{/snippet}

<!-- Composed as Blade React's: CardHeader, CardBody, CardFooter. The
     header's title names the card. -->
<div class="max-w-96">
  <Card variant={args.variant} padding={args.padding}>
    <CardHeader title="Order summary" subtitle="2 items" trailing={badge} />
    <CardBody>
      <Text size="small" color="muted">
        The header and the footer sit on hairlines with 12px either side.
      </Text>
    </CardBody>
    <CardFooter
      title="₹2,000"
      subtitle="Incl. taxes"
      actions={{ primary: { text: 'Pay' }, secondary: { text: 'Later' } }}
    />
  </Card>
</div>
