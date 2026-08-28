<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Box from './Box.svelte';

  const { Story } = defineMeta({
    title: 'Components/Box',
    component: Box,
    tags: ['autodocs'],
    argTypes: {
      as: {
        control: 'select',
        options: ['div', 'section', 'footer', 'header', 'main', 'aside', 'nav', 'span', 'label'],
        description: 'Element/tag Box renders as',
      },
      className: {
        control: 'text',
        description: 'Additional class names forwarded as-is to the underlying DOM element',
      },
      testID: {
        control: 'text',
        description: 'Test ID for the Box element',
      },
    },
    args: {
      as: 'div',
    },
  });
</script>

<script lang="ts">
  const tags = ['div', 'section', 'span'] as const;
</script>

<!-- Playground story - auto-renders Box with args -->
<Story name="Playground">
  {#snippet template(args)}
    <Box {...args}>Box content</Box>
  {/snippet}
</Story>

<!-- Polymorphic `as` -->
<Story name="Polymorphic as" asChild>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    {#each tags as tag (tag)}
      <Box as={tag} className="padding-spacing-3" style="border: 1px solid #eee;">
        Rendered as &lt;{tag}&gt;
      </Box>
    {/each}
  </div>
</Story>

<!-- className passthrough (e.g. Tailwind utility classes) -->
<Story name="className passthrough" asChild>
  <Box as="section" className="m-2 py-2 flex flex-row" style="border: 1px dashed #ccc;">
    Box with consumer-supplied className
  </Box>
</Story>
