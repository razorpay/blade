<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IconButton from './IconButton.svelte';
  import { iconMap } from '../../Icons/iconMap';
  import { CloseIcon } from '../../Icons';
  import Text from '../../Typography/Text/Text.svelte';
  import Heading from '../../Typography/Heading/Heading.svelte';

  const { Story } = defineMeta({
    title: 'Components/IconButton',
    component: IconButton,
    tags: ['autodocs'],
    args: {
      size: 'medium',
      emphasis: 'intense',
      accessibilityLabel: 'Close',
      icon: CloseIcon,
    },
    argTypes: {
      icon: {
        name: 'icon',
        control: 'select',
        options: Object.keys(iconMap),
        mapping: iconMap,
        description: 'Icon component to be rendered',
      },
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
        description: 'Icon size',
      },
      emphasis: {
        control: 'select',
        options: ['subtle', 'intense'],
        description: 'Icon emphasis (contrast)',
      },
      accessibilityLabel: {
        control: 'text',
        description: 'Sets aria-label to describe the action',
      },
      isDisabled: {
        control: 'boolean',
        description: 'Disabled state for IconButton',
      },
      isHighlighted: {
        control: 'boolean',
        description: 'Highlights the icon with a faded background on hover/focus (web-only)',
      },
      onClick: { action: 'onClick' },
    },
  });
</script>

<script lang="ts">
  const sizes = ['small', 'medium', 'large'] as const;
  const highlightedSizes = ['small', 'medium'] as const;

  const sizeLabels: Record<string, string> = {
    small: '12px',
    medium: '16px',
    large: '20px',
  };

  const noop = (): void => {};
</script>

<!-- Playground - auto-renders IconButton driven by Storybook controls -->
<Story name="IconButton" />

<!-- Full matrix: emphasis x size x {default, disabled} + highlighted small/medium -->
<Story name="All Variants & Sizes" asChild>
  <div class="display-flex flex-col gap-spacing-7">
    <!-- Emphasis: Intense (plain background) -->
    <div
      class="display-flex flex-col gap-spacing-5"
      style="padding: var(--spacing-7); border-radius: var(--border-radius-medium);"
    >
      <Heading size="small" color="surface.text.gray.normal">Emphasis: Intense</Heading>

      <div class="display-flex flex-row gap-spacing-8 items-center">
        <div style="width: 100px;"></div>
        <div style="width: 48px;">
          <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Default</Text>
        </div>
        <div style="width: 48px;">
          <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Disabled</Text>
        </div>
      </div>

      {#each sizes as size (size)}
        <div class="display-flex flex-row gap-spacing-8 items-center">
          <div style="width: 100px;">
            <Text size="xsmall" color="surface.text.gray.muted">Size {sizeLabels[size]}</Text>
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="intense" accessibilityLabel="Close" onClick={noop} />
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="intense" accessibilityLabel="Close" onClick={noop} isDisabled />
          </div>
        </div>
      {/each}

      <div class="margin-top-spacing-3">
        <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Highlighted</Text>
      </div>
      {#each highlightedSizes as size (size)}
        <div class="display-flex flex-row gap-spacing-8 items-center">
          <div style="width: 100px;">
            <Text size="xsmall" color="surface.text.gray.muted">Size {sizeLabels[size]}</Text>
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="intense" accessibilityLabel="Close" onClick={noop} isHighlighted />
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="intense" accessibilityLabel="Close" onClick={noop} isHighlighted isDisabled />
          </div>
        </div>
      {/each}
    </div>

    <!-- Emphasis: Subtle (dark intense background) -->
    <div
      class="display-flex flex-col gap-spacing-5"
      style="padding: var(--spacing-7); border-radius: var(--border-radius-medium); background-color: var(--surface-background-primary-intense);"
    >
      <Heading size="small" color="surface.text.staticWhite.normal">Emphasis: Subtle</Heading>

      <div class="display-flex flex-row gap-spacing-8 items-center">
        <div style="width: 100px;"></div>
        <div style="width: 48px;">
          <Text size="xsmall" weight="semibold" color="surface.text.staticWhite.muted">Default</Text>
        </div>
        <div style="width: 48px;">
          <Text size="xsmall" weight="semibold" color="surface.text.staticWhite.muted">Disabled</Text>
        </div>
      </div>

      {#each sizes as size (size)}
        <div class="display-flex flex-row gap-spacing-8 items-center">
          <div style="width: 100px;">
            <Text size="xsmall" color="surface.text.staticWhite.muted">Size {sizeLabels[size]}</Text>
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="subtle" accessibilityLabel="Close" onClick={noop} />
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="subtle" accessibilityLabel="Close" onClick={noop} isDisabled />
          </div>
        </div>
      {/each}

      <div class="margin-top-spacing-3">
        <Text size="xsmall" weight="semibold" color="surface.text.staticWhite.muted">Highlighted</Text>
      </div>
      {#each highlightedSizes as size (size)}
        <div class="display-flex flex-row gap-spacing-8 items-center">
          <div style="width: 100px;">
            <Text size="xsmall" color="surface.text.staticWhite.muted">Size {sizeLabels[size]}</Text>
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="subtle" accessibilityLabel="Close" onClick={noop} isHighlighted />
          </div>
          <div class="display-flex items-center justify-center" style="width: 48px;">
            <IconButton icon={CloseIcon} {size} emphasis="subtle" accessibilityLabel="Close" onClick={noop} isHighlighted isDisabled />
          </div>
        </div>
      {/each}
    </div>
  </div>
</Story>
