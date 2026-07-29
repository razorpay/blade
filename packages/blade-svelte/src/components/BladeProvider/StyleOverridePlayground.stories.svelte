<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StyleOverridePlayground from './StyleOverridePlayground.svelte';

  const { Story } = defineMeta({
    title: 'Guides/Theming/Style Override',
    component: StyleOverridePlayground,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Interactive catalog of typed `styleOverride` slots for playground components (Button, IconButton, Text, Heading, Amount, AnnouncementBanner, Card, AppBarLeading, Divider, Avatar). Edit per-slot classnames, copy the resolved prop, and preview CSS-variable utilities. Slot names follow checkout configurability spec (`surface`, `title`, `icon`, …).',
        },
      },
      layout: 'fullscreen',
    },
  });
</script>

<Story
  name="Playground"
  parameters={{ controls: { disable: true }, docs: { canvas: { sourceState: 'none' } } }}
>
  <StyleOverridePlayground />
</Story>
