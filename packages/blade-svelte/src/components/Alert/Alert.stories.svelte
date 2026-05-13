<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Alert from './Alert.svelte';

  const { Story } = defineMeta({
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
      onDismiss: { action: 'Dismissed' },
      color: {
        control: 'select',
        options: ['information', 'negative', 'neutral', 'notice', 'positive'],
      },
      emphasis: {
        control: 'select',
        options: ['subtle', 'intense'],
      },
    },
    args: {
      title: 'International Payments Only',
      description:
        'Currently you can only accept payments in international currencies using PayPal. You cannot accept payments in INR (₹) using PayPal.',
      isFullWidth: false,
      isDismissible: true,
      emphasis: 'subtle',
      color: 'information',
      actions: {
        primary: {
          text: 'Primary Action',
          onClick: () => {
            console.log('Primary action clicked');
          },
        },
        secondary: {
          text: 'Link',
          onClick: () => {
            console.log('Secondary action clicked');
          },
          href: 'https://razorpay.com',
          target: '_blank',
        },
      },
    },
  });
</script>

<script lang="ts">
  import Text from '../Typography/Text/Text.svelte';
</script>

<!-- Story 1: Default -->
<Story name="Default" />

<!-- Story 2: High Emphasis -->
<Story
  name="High Emphasis"
  args={{
    emphasis: 'intense',
    color: 'notice',
  }}
/>

<!-- Story 3: Without Actions -->
<Story
  name="Without Actions"
  args={{
    actions: undefined,
  }}
/>

<!-- Story 4: Non Dismissable -->
<Story
  name="Non Dismissable"
  args={{
    isDismissible: false,
  }}
/>

<!-- Story 5: Description Only -->
<Story
  name="Description Only"
  args={{
    description:
      "The payment was made 6 months ago, therefore you can't issue refund to this merchant.",
    color: 'notice',
    actions: undefined,
    title: undefined,
  }}
/>

<!-- Story 6: Primary Action Only -->
<Story
  name="Primary Action Only"
  args={{
    description:
      'There was some internal error while fetching the merchants list, this might also be due to the poor internet connection.',
    color: 'negative',
    actions: {
      primary: {
        text: 'Try Refetching',
        onClick: () => {
          console.log('Refetch');
        },
      },
    },
    title: 'Unable to fetch merchants',
  }}
/>

<!-- Story 7: Full Width -->
<Story name="Full Width" asChild>
  <div style="height: 200px; position: relative;">
    <div style="position: absolute; width: 100%;">
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        color="notice"
        actions={undefined}
        title={undefined}
        isFullWidth={true}
      />
    </div>
  </div>
</Story>

<!-- Story 8: Full Width With Actions -->
<Story name="Full Width With Actions" asChild>
  <div style="height: 200px; position: relative;">
    <div style="position: absolute; width: 100%;">
      <Alert
        title="International Payments Only"
        description="Currently you can only accept payments in international currencies using PayPal."
        color="negative"
        isFullWidth={true}
        actions={{
          primary: {
            text: 'Primary Action',
            onClick: () => {
              console.log('Primary action clicked');
            },
          },
          secondary: {
            text: 'Link',
            onClick: () => {
              console.log('Secondary action clicked');
            },
            href: 'https://razorpay.com',
            target: '_blank',
          },
        }}
      />
    </div>
  </div>
</Story>

<!-- Story 9: Full Width One Action -->
<Story name="Full Width One Action" asChild>
  <div style="height: 200px; position: relative;">
    <div style="position: absolute; width: 100%;">
      <Alert
        color="information"
        emphasis="subtle"
        isDismissible={false}
        isFullWidth={true}
        actions={{
          primary: {
            text: 'Switch',
            onClick: () => {
              console.log('Clicked');
            },
          },
        }}
      >
        {#snippet description()}
          <Text color="surface.text.gray.subtle" weight="semibold">
            This is a demo description
          </Text>
        {/snippet}
      </Alert>
    </div>
  </div>
</Story>
