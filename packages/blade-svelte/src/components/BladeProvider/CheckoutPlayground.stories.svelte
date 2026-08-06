<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckoutPlayground from './CheckoutPlayground.svelte';

  const { Story } = defineMeta({
    title: 'Guides/Theming/Checkout Playground',
    component: CheckoutPlayground,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Split-panel checkout demo: left side configures `createTheme` global tokens and checkout-critical `styleOverride` slots (Button, AppBarLeading, Card); right side renders a scrollable mobile checkout in a phone frame with live accordion interaction.',
        },
      },
      layout: 'fullscreen',
    },
  });
</script>

<Story
  name="Playground"
  parameters={{
    controls: { disable: true },
    skipBladeProviderDecorator: true,
    docs: { canvas: { sourceState: 'none' } },
  }}
>
  <CheckoutPlayground />
</Story>
