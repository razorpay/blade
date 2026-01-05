<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Link from './Link.svelte';
  
  const { Story } = defineMeta({
    title: 'Components/Link',
    component: Link,
    tags: ['autodocs'],
    args: {
      children: 'Learn more',
      variant: 'anchor',
      color: 'primary',
      size: 'medium',
      isDisabled: false,
      iconPosition: 'left',
      href: 'https://github.com/razorpay/blade',
      target: '_blank',
      rel: 'noreferrer noopener',
    },
    argTypes: {
      children: {
        control: 'text',
        description: 'Link text content',
      },
      variant: {
        control: 'select',
        options: ['anchor', 'button'],
        description: 'Link variant - anchor for navigation, button for actions',
        table: {
          defaultValue: { summary: 'anchor' },
        },
      },
      color: {
        control: 'select',
        options: ['primary', 'white', 'neutral', 'negative', 'positive'],
        description: 'Color theme of the link',
        table: {
          defaultValue: { summary: 'primary' },
        },
      },
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large'],
        description: 'Size of the link',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      isDisabled: {
        control: 'boolean',
        description: 'Whether the link is disabled',
        table: {
          defaultValue: { summary: 'false' },
        },
      },
      iconPosition: {
        control: 'select',
        options: ['left', 'right'],
        description: 'Position of the icon relative to the link text',
        table: {
          defaultValue: { summary: 'left' },
        },
      },
      href: {
        control: 'text',
        description: 'URL for anchor links',
      },
      target: {
        control: 'select',
        options: ['_self', '_blank', '_parent', '_top'],
        description: 'Target for anchor links',
      },
      rel: {
        control: 'text',
        description: 'Rel attribute for anchor links',
      },
      onClick: {
        action: 'clicked',
        description: 'Function called when the link is clicked (for button variant)',
      },
    },
  });
</script>

<script>
  // Link is already imported in the module context
</script>

<!-- Playground story with all controls -->
<Story name="Playground" />

<Story name="Anchor Link" args={{ children: 'Learn more', variant: 'anchor', href: 'https://github.com/razorpay/blade', target: '_blank' }} />

<Story name="Button Link" args={{ children: 'Click me', variant: 'button' }} />

<Story name="Link Colors" asChild>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <Link variant="anchor" color="primary">Primary</Link>
    <Link variant="anchor" color="neutral">Neutral</Link>
    <Link variant="anchor" color="positive">Positive</Link>
    <Link variant="anchor" color="negative">Negative</Link>
  </div>
</Story>

<Story name="Link Sizes" asChild>
  <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
    <Link variant="anchor" size="xsmall">XSmall</Link>
    <Link variant="anchor" size="small">Small</Link>
    <Link variant="anchor" size="medium">Medium</Link>
    <Link variant="anchor" size="large">Large</Link>
  </div>
</Story>

<Story name="Disabled Link" args={{ children: 'Disabled Link', variant: 'button', isDisabled: true }} />
