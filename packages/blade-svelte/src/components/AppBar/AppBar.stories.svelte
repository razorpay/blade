<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AppBar from './AppBar.svelte';

  const { Story } = defineMeta({
    title: 'Components/AppBar',
    component: AppBar,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['neutral', 'subtle'],
      },
      isSticky: {
        control: { type: 'boolean' },
      },
      title: {
        control: { type: 'text' },
        table: { disable: true },
      },
      trustBadgeVariant: {
        control: { type: 'select' },
        options: ['default', 'icon-only', 'none'],
        table: { disable: true },
      },
      leadingContent: {
        control: { type: 'select' },
        options: ['logo-only', 'logo-and-title', 'title-only'],
        table: { disable: true },
      },
      logoType: {
        control: { type: 'select' },
        options: ['optimizer', 'initials'],
        table: { disable: true },
      },
      showBackButton: {
        control: { type: 'boolean' },
        table: { disable: true },
      },
      showActions: {
        control: { type: 'boolean' },
        table: { disable: true },
      },
    },
    args: {
      variant: 'neutral',
      isSticky: true,
      title: 'Maven Shop',
      trustBadgeVariant: 'default',
      leadingContent: 'logo-and-title',
      logoType: 'initials',
      showBackButton: true,
      showActions: true,
    },
  } as Parameters<typeof defineMeta>[0] & { argTypes: Record<string, unknown> });
</script>

<script lang="ts">
  import AppBarLeading from './AppBarLeading.svelte';
  import AppBarActions from './AppBarActions.svelte';
  import IconButton from '../Button/IconButton/IconButton.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import { Avatar } from '../Avatar';
  import { BuildingIcon, UserIcon } from '../Icons';

  type TrustBadgeVariant = 'default' | 'icon-only';

  type AppBarPlaygroundArgs = {
    variant?: 'neutral' | 'subtle';
    isSticky?: boolean;
    title?: string;
    trustBadgeVariant?: TrustBadgeVariant | 'none';
    leadingContent?: 'logo-only' | 'logo-and-title' | 'title-only';
    logoType?: 'optimizer' | 'initials';
    showBackButton?: boolean;
    showActions?: boolean;
  };

  const noop = (): void => undefined;

  const trustBadgeRows: { label: string; trustBadgeVariant: TrustBadgeVariant | undefined }[] = [
    { label: 'Full trust badge', trustBadgeVariant: 'default' },
    { label: 'No trust badge', trustBadgeVariant: undefined },
    { label: 'Inline trust icon', trustBadgeVariant: 'icon-only' },
  ];

  const checkoutBackgroundStyle =
    'background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);';
  const playgroundNeutralStyle = `${checkoutBackgroundStyle} max-width: 375px; width: 100%;`;
  const playgroundSubtleStyle =
    'background-color: var(--surface-background-gray-subtle); max-width: 375px; width: 100%; min-height: 120px;';
  const variationsStackStyle =
    'display: flex; flex-direction: column; gap: var(--spacing-6); max-width: 375px; width: 100%;';
  const optimizerLogoUrl = 'https://cdn.razorpay.com/static/assets/optimizer_logo.svg';
  const optimizerLogoStyle = 'width: auto; height: auto; display: block;';
</script>

{#snippet optimizerLogo()}
  <img src={optimizerLogoUrl} alt="Razorpay Optimizer" style={optimizerLogoStyle} />
{/snippet}

{#snippet merchantLogo()}
  <Avatar name="Mavenshop" variant="square" size="large" />
{/snippet}

{#snippet storeLogo()}
  <Avatar icon={BuildingIcon} variant="square" size="large" />
{/snippet}

{#snippet titleInitialsLogo()}
  <Avatar name="Maven Shop" variant="square" size="large" />
{/snippet}

{#snippet defaultAppBarActions()}
  <IconButton icon={UserIcon} emphasis="moderate" accessibilityLabel="Profile" onClick={noop} />
{/snippet}

<!-- Playground — args-driven preview for docs + controls -->
<Story name="Playground">
  {#snippet template(args)}
    {@const playgroundArgs = args as AppBarPlaygroundArgs}
    {@const trustBadgeVariant =
      playgroundArgs.trustBadgeVariant === 'none' || playgroundArgs.trustBadgeVariant === undefined
        ? undefined
        : playgroundArgs.trustBadgeVariant}
    {@const backgroundStyle =
      playgroundArgs.variant === 'neutral' ? playgroundNeutralStyle : playgroundSubtleStyle}
    <div style={backgroundStyle}>
      <AppBar
        variant={playgroundArgs.variant}
        isSticky={playgroundArgs.isSticky}
        showBackButton={playgroundArgs.showBackButton}
        onBackButtonClick={noop}
      >
        {#if playgroundArgs.leadingContent === 'logo-only'}
          <AppBarLeading {trustBadgeVariant}>
            {#snippet logo()}
              {#if playgroundArgs.logoType === 'optimizer'}
                {@render optimizerLogo()}
              {:else}
                {@render titleInitialsLogo()}
              {/if}
            {/snippet}
          </AppBarLeading>
        {:else if playgroundArgs.leadingContent === 'logo-and-title'}
          <AppBarLeading title={playgroundArgs.title} {trustBadgeVariant}>
            {#snippet logo()}
              {#if playgroundArgs.logoType === 'optimizer'}
                {@render optimizerLogo()}
              {:else}
                {@render titleInitialsLogo()}
              {/if}
            {/snippet}
          </AppBarLeading>
        {:else}
          <AppBarLeading title={playgroundArgs.title} {trustBadgeVariant} />
        {/if}
        {#if playgroundArgs.showActions}
          <AppBarActions>
            {@render defaultAppBarActions()}
          </AppBarActions>
        {/if}
      </AppBar>
    </div>
  {/snippet}
</Story>

<!-- Story: Figma leading-content matrix — logo, logo+title, title-only × trust badge variants -->
<Story name="Variations" asChild parameters={{ docs: { disable: true } }}>
  <div style="{checkoutBackgroundStyle} {variationsStackStyle}">
    {#each trustBadgeRows as row (row.label)}
      <AppBar showBackButton onBackButtonClick={noop}>
        <AppBarLeading trustBadgeVariant={row.trustBadgeVariant}>
          {#snippet logo()}
            {@render optimizerLogo()}
          {/snippet}
        </AppBarLeading>
        <AppBarActions>
          {@render defaultAppBarActions()}
        </AppBarActions>
      </AppBar>

      <AppBar showBackButton onBackButtonClick={noop}>
        <AppBarLeading title="Maven Shop" trustBadgeVariant={row.trustBadgeVariant}>
          {#snippet logo()}
            {@render titleInitialsLogo()}
          {/snippet}
        </AppBarLeading>
        <AppBarActions>
          {@render defaultAppBarActions()}
        </AppBarActions>
      </AppBar>

      <AppBar showBackButton onBackButtonClick={noop}>
        <AppBarLeading title="Maven Shop" trustBadgeVariant={row.trustBadgeVariant} />
        <AppBarActions>
          {@render defaultAppBarActions()}
        </AppBarActions>
      </AppBar>
    {/each}
  </div>
</Story>

<!-- Story 1: Default — back button + title -->
<Story name="Default" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <AppBar showBackButton onBackButtonClick={noop}>
      <AppBarLeading title="Order details" />
    </AppBar>
  </div>
</Story>

<!-- Story 2: With Logo — logo + full trust badge -->
<Story name="With Logo" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <AppBar showBackButton onBackButtonClick={noop}>
      <AppBarLeading trustBadgeVariant="default">
        {#snippet logo()}
          {@render optimizerLogo()}
        {/snippet}
      </AppBarLeading>
    </AppBar>
  </div>
</Story>

<!-- Story 3: With Actions — logo + title + full trust badge + trailing icon buttons -->
<Story name="With Actions" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <AppBar showBackButton onBackButtonClick={noop}>
      <AppBarLeading title="Maven Shop" trustBadgeVariant="default">
        {#snippet logo()}
          {@render titleInitialsLogo()}
        {/snippet}
      </AppBarLeading>
      <AppBarActions>
        {@render defaultAppBarActions()}
      </AppBarActions>
    </AppBar>
  </div>
</Story>

<!-- Story 4: Logo And Title — logo + title, no trust badge -->
<Story name="Logo And Title" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <AppBar showBackButton onBackButtonClick={noop}>
      <AppBarLeading title="Maven Shop">
        {#snippet logo()}
          {@render storeLogo()}
        {/snippet}
      </AppBarLeading>
      <AppBarActions>
        {@render defaultAppBarActions()}
      </AppBarActions>
    </AppBar>
  </div>
</Story>

<!-- Story 5: Title With Icon Badge — inline shield beside title -->
<Story name="Title With Icon Badge" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <AppBar showBackButton onBackButtonClick={noop}>
      <AppBarLeading title="Maven Shop" trustBadgeVariant="icon-only" />
    </AppBar>
  </div>
</Story>

<!-- Story 6: Subtle Variant — adaptive gray surface on a light background -->
<Story name="Subtle Variant" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); min-height: 200px;">
    <AppBar variant="subtle" showBackButton onBackButtonClick={noop}>
      <AppBarLeading title="Settings" />
      <AppBarActions>
        {@render defaultAppBarActions()}
      </AppBarActions>
    </AppBar>
    <div style="padding: var(--spacing-6);">
      <Text>The subtle variant adapts to a light/embedded page background.</Text>
    </div>
  </div>
</Story>

<!-- Story 7: Merchant Checkout — back button, merchant name, trust badge, profile action -->
<Story name="Merchant Checkout" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <AppBar showBackButton onBackButtonClick={noop} accessibilityLabel="Mavenshop checkout">
      <AppBarLeading title="Mavenshop" trustBadgeVariant="default" />
      <AppBarActions>
        {@render defaultAppBarActions()}
      </AppBarActions>
    </AppBar>
  </div>
</Story>

<!-- Story 8: Sticky On Scroll — sticky AppBar over a tall scroll container. -->
<Story name="Sticky On Scroll" asChild>
  <div style="height: 320px; overflow-y: auto; background-color: #3669ff;">
    <AppBar isSticky showBackButton onBackButtonClick={noop}>
      <AppBarLeading title="Maven Shop" trustBadgeVariant="default">
        {#snippet logo()}
          {@render merchantLogo()}
        {/snippet}
      </AppBarLeading>
      <AppBarActions>
        {@render defaultAppBarActions()}
      </AppBarActions>
    </AppBar>
    <div style="padding: var(--spacing-6); display: flex; flex-direction: column; gap: var(--spacing-5);">
      {#each Array.from({ length: 20 }) as _item, index (index)}
        <Text color="surface.text.staticWhite.normal">Scroll content row {index + 1}</Text>
      {/each}
    </div>
  </div>
</Story>
