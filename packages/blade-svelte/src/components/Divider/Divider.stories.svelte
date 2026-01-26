<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Divider from './Divider.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Button from '../Button/Button.svelte';

  const { Story } = defineMeta({
    title: 'Components/Divider',
    component: Divider,
    tags: ['autodocs'],
    argTypes: {
      orientation: {
        control: 'select',
        options: ['horizontal', 'vertical'],
        description: 'Sets the orientation of divider',
        table: {
          defaultValue: { summary: 'horizontal' },
        },
      },
      dividerStyle: {
        control: 'select',
        options: ['solid', 'dashed'],
        description: 'Sets the style of divider',
        table: {
          defaultValue: { summary: 'solid' },
        },
      },
      variant: {
        control: 'select',
        options: ['normal', 'subtle', 'muted'],
        description: 'Sets the variant of divider',
        table: {
          defaultValue: { summary: 'muted' },
        },
      },
      thickness: {
        control: 'select',
        options: ['thinner', 'thin', 'thick', 'thicker'],
        description: 'Sets the thickness of divider',
        table: {
          defaultValue: { summary: 'thin' },
        },
      },
      height: {
        control: 'text',
        description: 'Sets the height of divider (use with vertical orientation)',
      },
      width: {
        control: 'text',
        description: 'Sets the width of divider (use with horizontal orientation)',
      },
    },
  });
</script>

<Story name="Default">
  {#snippet content(args)}
    <div style="border: 1px solid var(--surface-border-gray-muted); border-radius: var(--border-radius-medium); padding: var(--spacing-5);">
      <div style="display: flex; flex-direction: {args.orientation === 'vertical' ? 'row' : 'column'};">
        <Heading style="margin: var(--spacing-4);">Payment Links</Heading>
        <Divider {...args} />
        <div style="margin: var(--spacing-4);">
          <Text>Share payment link via:</Text>
          <ul style="margin-left: var(--spacing-5); margin-top: var(--spacing-2);">
            <li><Text>Email</Text></li>
            <li><Text>SMS</Text></li>
            <li><Text>Messenger</Text></li>
          </ul>
        </div>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Horizontal">
  <div style="border: 1px solid var(--surface-border-gray-muted); border-radius: var(--border-radius-medium); padding: var(--spacing-5);">
    <Heading style="margin-bottom: var(--spacing-2);">Payment Links</Heading>
    <Divider />
    <Text style="margin-top: var(--spacing-3);">
      Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
      Accepting payments from customers is now just a link away.
    </Text>
  </div>
</Story>
