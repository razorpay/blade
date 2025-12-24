<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Code from './Code.svelte';
  
  const { Story } = defineMeta({
    title: 'Typography/Code',
    component: Code,
    tags: ['autodocs'],
    args: {
      children: 'SENTRY_AUTH_TOKEN',
      size: 'medium',
      weight: 'regular',
      isHighlighted: true,
    },
    argTypes: {
      children: {
        control: 'text',
        description: 'Code text content',
      },
      size: {
        control: 'select',
        options: ['small', 'medium'],
        description: 'Size of the code text',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      weight: {
        control: 'select',
        options: ['regular', 'bold'],
        description: 'Font weight',
        table: {
          defaultValue: { summary: 'regular' },
        },
      },
      isHighlighted: {
        control: 'boolean',
        description: 'Whether the code has a highlighted background',
        table: {
          defaultValue: { summary: 'true' },
        },
      },
      color: {
        control: 'text',
        description: 'Color token for the code',
      },
    },
  });
</script>

<script>
  import Text from '../Text/Text.svelte';
</script>

<!-- Playground story with all controls -->
<Story name="Playground" />

<Story name="Code Highlighted" args={{ children: 'SENTRY_AUTH_TOKEN', isHighlighted: true, size: 'medium', weight: 'regular' }} />

<Story name="Code Non Highlighted" args={{ children: 'SENTRY_AUTH_TOKEN', isHighlighted: false, size: 'medium' }} />

<Story name="Code with Bold Color" args={{ children: 'SENTRY_AUTH_TOKEN', isHighlighted: false, size: 'medium', weight: 'bold', color: 'interactive.text.positive.subtle' }} />

<Story name="Code in Text Context">
  <Text as="p" size="medium">
    Lorem ipsum normal text <Code isHighlighted size="medium" weight="regular">SENTRY_AUTH_TOKEN</Code> component
  </Text>
</Story>

<Story name="Code Sizes">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <Text as="p" size="small">
      Small size: <Code size="small" isHighlighted>npm install @razorpay/blade</Code>
    </Text>
    <Text as="p" size="medium">
      Medium size: <Code size="medium" isHighlighted>npm install @razorpay/blade</Code>
    </Text>
  </div>
</Story>
