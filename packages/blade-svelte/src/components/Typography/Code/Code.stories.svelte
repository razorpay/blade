<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  
  const { Story } = defineMeta({
    title: 'Typography/Code',
  });
</script>

<script>
  import Code from './Code.svelte';
  import Text from '../Text/Text.svelte';
</script>

<Story name="Code Highlighted">
  <Text as="p" size="medium">
    Lorem ipsum normal text <Code isHighlighted size="medium" weight="regular">SENTRY_AUTH_TOKEN</Code> component
  </Text>
</Story>

<Story name="Code with Bold Color">
  <Text as="p" size="medium">
    Lorem ipsum normal text <Code isHighlighted={false} size="medium" weight="bold" color="interactive.text.positive.subtle">SENTRY_AUTH_TOKEN</Code> component
  </Text>
</Story>

<Story name="Code Non Highlighted">
  <Text as="p" size="medium">
    Lorem ipsum normal text <Code size="medium">SENTRY_AUTH_TOKEN</Code> component
  </Text>
</Story>