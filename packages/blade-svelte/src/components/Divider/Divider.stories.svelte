<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Divider from './Divider.svelte';

  const { Story } = defineMeta({
    title: 'Components/Divider',
    component: Divider,
    tags: ['autodocs'],
    argTypes: {
      orientation: {
        control: 'select',
        options: ['horizontal', 'vertical'],
        description: 'Sets the orientation of divider',
      },
      dividerStyle: {
        control: 'select',
        options: ['solid', 'dashed'],
        description: 'Sets the style of divider',
      },
      variant: {
        control: 'select',
        options: ['normal', 'subtle', 'muted'],
        description: 'Sets the variant of divider',
      },
      thickness: {
        control: 'select',
        options: ['thinner', 'thin', 'thick', 'thicker'],
        description: 'Sets the thickness of divider',
      },
      marginX: {
        control: 'text',
        description: 'Horizontal margin (useful for vertical dividers)',
      },
      marginY: {
        control: 'text',
        description: 'Vertical margin (useful for horizontal dividers)',
      },
      testID: {
        control: 'text',
        description: 'Test ID for the divider element',
      },
    },
    args: {
      orientation: 'horizontal',
      dividerStyle: 'solid',
      variant: 'muted',
      thickness: 'thin',
    },
  });
</script>

<script lang="ts">
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Button from '../Button/Button.svelte';

  const variants = ['normal', 'subtle', 'muted'] as const;
  const thicknesses = ['thinner', 'thin', 'thick', 'thicker'] as const;
</script>

<!-- Playground story - auto-renders Divider with args -->
<Story name="Playground" />
<!-- Horizontal Divider -->
<Story name="Horizontal" asChild>
  <div style="border: 1px solid #eee; border-radius: 8px; padding: 16px;" class="padding-spacing-5">
    <Heading size="medium">Payment Links</Heading>
    <Divider marginTop='spacing.4' />
    <div class="margin-top-spacing-3">
      <Text size="medium">
        Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
        Accepting payments from customers is now just a link away.
      </Text>
    </div>
  </div>
</Story>

<!-- Vertical Divider -->
<Story name="Vertical" asChild>
  <div
    style="border: 1px solid #eee; border-radius: 8px; height: 60px; padding: 16px"
    class="padding-spacing-5 display-flex items-center justify-center"
  >
    <div class="display-flex" style="flex: 1;">
      <Button variant="secondary" isFullWidth>Sign up</Button>
    </div>
    <Divider orientation="vertical" marginX="spacing.4" />
    <div class="display-flex" style="flex: 1;">
      <Button variant="primary" isFullWidth>Login</Button>
    </div>
  </div>
</Story>

<!-- Divider with Text Columns -->
<Story name="With Text Columns" asChild>
  <div style="border: 1px solid #eee; border-radius: 8px; padding: 16px;" class="padding-spacing-5">
    <div class="margin-bottom-spacing-5">
      <Heading size="medium">Explore multiple payment options</Heading>
    </div>
    <Divider marginBottom="spacing.5" />
    <div class="display-flex margin-top-spacing-5" style="gap: 24px;">
      <div style="width: 30%;">
        <Text size="medium">
          Accept payments with a custom-branded online store using Payment Pages. Accept
          international and domestic payments with automated payment receipts.
        </Text>
      </div>
      <Divider orientation="vertical" marginX="spacing.6" />
      <div style="width: 30%;">
        <Text size="medium">
          Create payment links which can be shared via an email, SMS, messenger, chatbot etc. and
          get paid immediately. Accepting payments from customers is now just a link away.
        </Text>
      </div>
      <Divider orientation="vertical" marginX="spacing.6" />
      <div style="width: 30%;">
        <Text size="medium">
          Accept one time and subscription payments on your website in less than 5 minutes.
          Thousands of NGOs, SMEs, and freelancers are collecting payments.
        </Text>
      </div>
    </div>
  </div>
</Story>

<!-- All Variants -->
<Story name="Variants" asChild>
  <div class="display-flex flex-direction-column padding-spacing-5" style="gap: 24px;">
    {#each variants as variant}
      <div>
        <Text size="small" weight="semibold" marginBottom="spacing.2">{variant}</Text>
        <Divider {variant} />
      </div>
    {/each}
  </div>
</Story>

<!-- All Thicknesses -->
<Story name="Thickness" asChild>
  <div class="display-flex flex-direction-column padding-spacing-5" style="gap: 24px;">
    {#each thicknesses as thickness}
      <div>
        <Text size="small" weight="semibold" marginBottom="spacing.2">{thickness}</Text>
        <Divider {thickness} />
      </div>
    {/each}
  </div>
</Story>

<!-- Dashed Style -->
<Story name="Dashed" asChild>
  <div class="padding-spacing-5">
    <Text size="medium" marginBottom="spacing.3">Dashed Horizontal</Text>
    <Divider dividerStyle="dashed" />
    <div class="display-flex margin-top-spacing-7" style="gap: 16px; height: 100px;">
      <Text size="medium">Dashed Vertical</Text>
      <Divider orientation="vertical" dividerStyle="dashed" />
      <Text size="medium">Example content</Text>
    </div>
  </div>
</Story>
