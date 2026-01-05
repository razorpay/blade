<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Heading from './Heading.svelte';
  
  const { Story } = defineMeta({
    title: 'Components/Typography/Heading',
    component: Heading,
    tags: ['autodocs'],
    args: {
      children: 'Get Started With Payment Gateway',
      as: 'h2',
      size: 'large',
      weight: 'semibold',
    },
    argTypes: {
      children: {
        control: 'text',
        description: 'Heading text content',
      },
      as: {
        control: 'select',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'],
        description: 'HTML element to render as',
        table: {
          defaultValue: { summary: 'h2' },
        },
      },
      size: {
        control: 'select',
        options: ['small', 'medium', 'large', 'xlarge', '2xlarge'],
        description: 'Size of the heading',
        table: {
          defaultValue: { summary: 'large' },
        },
      },
      weight: {
        control: 'select',
        options: ['regular', 'semibold'],
        description: 'Font weight',
        table: {
          defaultValue: { summary: 'semibold' },
        },
      },
      color: {
        control: 'text',
        description: 'Color token for the heading',
      },
      textAlign: {
        control: 'select',
        options: ['left', 'center', 'right'],
        description: 'Text alignment',
      },
    },
  });
</script>

<script>
  // Heading is already imported in the module context
</script>

<!-- Playground story with all controls -->
<Story name="Playground" />

<Story name="Heading" args={{ children: 'Get Started With Payment Gateway', weight: 'semibold' }} />

<Story name="Heading with Color" args={{ children: 'Get Started With Payment Gateway', weight: 'semibold', color: 'surface.text.primary.normal' }} />

<Story name="Heading Sizes">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Heading size="small" weight="semibold">Small Heading</Heading>
    <Heading size="medium" weight="semibold">Medium Heading</Heading>
    <Heading size="large" weight="semibold">Large Heading</Heading>
    <Heading size="xlarge" weight="semibold">XLarge Heading</Heading>
    <Heading size="2xlarge" weight="semibold">2XLarge Heading</Heading>
  </div>
</Story>

<Story name="Heading as H1" args={{ children: 'Heading as H1 tag', as: 'h1', size: 'xlarge', weight: 'semibold', color: 'surface.text.primary.normal' }} />

<Story name="With Mixed Color">
  <Heading weight="semibold">
    Supercharge your business with the all‑powerful <Heading as="span" color="surface.text.primary.normal">Payment Gateway</Heading>. Start accepting <Heading as="span" color="feedback.text.information.intense">payments</Heading> at just 2%
  </Heading>
</Story>
