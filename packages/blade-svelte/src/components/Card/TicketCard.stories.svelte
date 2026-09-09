<script module>
  // @ts-nocheck — story args typing
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TicketCard from './TicketCard.svelte';

  const disable = {
    table: { disable: true },
  };

  const { Story } = defineMeta({
    title: 'Components/Card/TicketCard',
    component: TicketCard,
    tags: ['autodocs'],
    argTypes: {
      children: disable,
      onClick: disable,
      onHover: disable,
      testID: disable,
      isSelected: {
        control: { type: 'boolean' },
      },
      isDisabled: {
        control: { type: 'boolean' },
      },
      width: {
        control: { type: 'text' },
      },
      borderRadius: {
        control: { type: 'select' },
        options: ['medium', 'large', 'xlarge'],
      },
      size: {
        control: { type: 'radio' },
        options: ['large', 'medium'],
      },
      href: {
        control: { type: 'text' },
      },
      accessibilityLabel: {
        control: { type: 'text' },
      },
    },
    args: {
      isSelected: false,
      isDisabled: false,
      width: '280px',
      borderRadius: 'medium',
      size: 'large',
    },
  });
</script>

<script lang="ts">
  import TicketCardBody from './TicketCardBody.svelte';
  import TicketCardFooter from './TicketCardFooter.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Amount from '../Amount/Amount.svelte';
</script>

<!-- Playground — Controls panel drives TicketCard surface props -->
<Story name="Playground">
  {#snippet template(args)}
    <div
      style="padding: var(--spacing-8); background-color: var(--surface-background-gray-subtle);"
    >
      <TicketCard
        isSelected={args.isSelected}
        isDisabled={args.isDisabled}
        width={args.width}
        borderRadius={args.borderRadius}
        size={args.size}
        href={args.href}
        accessibilityLabel={args.accessibilityLabel}
      >
        <TicketCardBody>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
            <Text weight="semibold">Razorpay Summit 2026</Text>
            <Text size="small" color="surface.text.gray.subtle">General Admission</Text>
          </div>
        </TicketCardBody>
        <TicketCardFooter>
          <div
            style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
          >
            <div style="display: flex; flex-direction: column;">
              <Text size="small" color="surface.text.gray.subtle">Seat</Text>
              <Text weight="semibold">A-24</Text>
            </div>
            <Amount value={4999} type="body" weight="semibold" />
          </div>
        </TicketCardFooter>
      </TicketCard>
    </div>
  {/snippet}
</Story>

<!-- States — default, selected, and disabled side by side -->
<Story name="States" asChild>
  <div
    style="display: flex; flex-direction: row; gap: var(--spacing-7); flex-wrap: wrap; padding: var(--spacing-8); background-color: var(--surface-background-gray-subtle);"
  >
    <TicketCard width="280px">
      <TicketCardBody>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
          <Text weight="semibold">Razorpay Summit 2026</Text>
          <Text size="small" color="surface.text.gray.subtle">Default</Text>
        </div>
      </TicketCardBody>
      <TicketCardFooter>
        <div
          style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
        >
          <div style="display: flex; flex-direction: column;">
            <Text size="small" color="surface.text.gray.subtle">Seat</Text>
            <Text weight="semibold">A-24</Text>
          </div>
          <Amount value={4999} type="body" weight="semibold" />
        </div>
      </TicketCardFooter>
    </TicketCard>

    <TicketCard width="280px" isSelected>
      <TicketCardBody>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
          <Text weight="semibold">Razorpay Summit 2026</Text>
          <Text size="small" color="surface.text.gray.subtle">Selected</Text>
        </div>
      </TicketCardBody>
      <TicketCardFooter>
        <div
          style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
        >
          <div style="display: flex; flex-direction: column;">
            <Text size="small" color="surface.text.gray.subtle">Seat</Text>
            <Text weight="semibold">A-24</Text>
          </div>
          <Amount value={4999} type="body" weight="semibold" />
        </div>
      </TicketCardFooter>
    </TicketCard>

    <TicketCard width="280px" isDisabled>
      <TicketCardBody>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
          <Text weight="semibold">Razorpay Summit 2026</Text>
          <Text size="small" color="surface.text.gray.subtle">Disabled</Text>
        </div>
      </TicketCardBody>
      <TicketCardFooter>
        <div
          style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
        >
          <div style="display: flex; flex-direction: column;">
            <Text size="small" color="surface.text.gray.subtle">Seat</Text>
            <Text weight="semibold">A-24</Text>
          </div>
          <Amount value={4999} type="body" weight="semibold" />
        </div>
      </TicketCardFooter>
    </TicketCard>
  </div>
</Story>
