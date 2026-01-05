<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Text from './Text.svelte';
  
  const { Story } = defineMeta({
    title: 'Components/Typography/Text',
    component: Text,
    tags: ['autodocs'],
    args: {
      children: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
      as: 'p',
      variant: 'body',
      size: 'medium',
      weight: 'regular',
      truncateAfterLines: 0,
    },
    argTypes: {
      children: {
        control: 'text',
        description: 'Text content',
      },
      as: {
        control: 'select',
        options: ['p', 'span', 'div', 'label', 'abbr', 'figcaption', 'cite', 'q', 'em', 's', 'samp', 'b', 'u', 'kbd', 'del', 'data', 'ins', 'mark', 'sub', 'sup', 'small', 'strong', 'time'],
        description: 'HTML element to render as',
        table: {
          defaultValue: { summary: 'p' },
        },
      },
      variant: {
        control: 'select',
        options: ['body', 'caption'],
        description: 'Text variant',
        table: {
          defaultValue: { summary: 'body' },
        },
      },
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large'],
        description: 'Size of the text',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      weight: {
        control: 'select',
        options: ['regular', 'medium', 'semibold'],
        description: 'Font weight',
        table: {
          defaultValue: { summary: 'regular' },
        },
      },
      color: {
        control: 'text',
        description: 'Color token for the text',
      },
      truncateAfterLines: {
        control: 'number',
        description: 'Number of lines after which to truncate (0 = no truncation)',
        table: {
          defaultValue: { summary: '0' },
        },
      },
      textAlign: {
        control: 'select',
        options: ['left', 'center', 'right', 'justify'],
        description: 'Text alignment',
      },
      textTransform: {
        control: 'select',
        options: ['none', 'uppercase', 'lowercase', 'capitalize'],
        description: 'Text transformation',
      },
      textDecorationLine: {
        control: 'select',
        options: ['none', 'underline', 'line-through'],
        description: 'Text decoration',
      },
    },
  });
</script>

<script>
  // Text is already imported in the module context
</script>

<!-- Playground story with all controls -->
<Story name="Playground" />

<Story name="Text" args={{ 
  children: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
  as: 'p',
  variant: 'body',
  size: 'medium',
  weight: 'regular',
  truncateAfterLines: 2 
}} />

<Story name="Text with Color" args={{
  children: 'Text with primary color applied.',
  color: 'surface.text.primary.normal',
  variant: 'body',
  size: 'medium'
}} />

<Story name="Text Sizes">
  <div class="display-flex flex-col gap-spacing-4 ">
    <Text variant="body" size="xsmall">XSmall text</Text>
    <Text variant="body" size="small">Small text</Text>
    <Text variant="body" size="medium">Medium text</Text>
    <Text variant="body" size="large">Large text</Text>
  </div>
</Story>

<Story name="Text Weights">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <Text variant="body" size="medium" weight="regular">Regular weight</Text>
    <Text variant="body" size="medium" weight="medium">Medium weight</Text>
    <Text variant="body" size="medium" weight="semibold">Semibold weight</Text>
  </div>
</Story>

<Story name="Nested Text (As Prop)">
  <Text as="p" variant="body" size="medium" weight="regular" color="surface.text.gray.normal">
    Power your <Text as="span" color="surface.text.primary.normal" size="medium" variant="body" weight="semibold">finance</Text>, grow your <Text as="span" size="medium" variant="body" weight="semibold">business</Text>
  </Text>
</Story>
