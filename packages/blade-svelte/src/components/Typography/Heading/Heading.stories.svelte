<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  
  const { Story } = defineMeta({
    title: 'Typography/Heading',
  });
</script>

<script>
  import Heading from './Heading.svelte';
</script>

<Story name="Heading">
  <Heading weight="semibold">
    Get Started With Payment Gateway
  </Heading>
</Story>

<Story name="Heading with Color">
  <Heading weight="semibold" color="surface.text.primary.normal">
    Get Started With Payment Gateway
  </Heading>
</Story>

<Story name="With Mixed Color">
  <Heading weight="semibold">
    Supercharge your business with the all‑powerful <Heading as="span" color="surface.text.primary.normal">Payment Gateway</Heading>. Start accepting <Heading as="span" color="feedback.text.information.intense">payments</Heading> at just 2%
  </Heading>
</Story>

<Story name="Heading as H1">
  <Heading as="h1" size="xlarge" weight="semibold" color="surface.text.primary.normal">
    Heading as H1 tag
  </Heading>
</Story>