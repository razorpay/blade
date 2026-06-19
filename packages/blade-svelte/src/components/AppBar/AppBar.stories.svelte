<script module>
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
    },
    args: {
      variant: 'neutral',
      isSticky: true,
    },
  });
</script>

<script lang="ts">
  import AppBarLeading from './AppBarLeading.svelte';
  import AppBarActions from './AppBarActions.svelte';
  import Button from '../Button/Button.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import { CreditCardIcon, BuildingIcon, CloseIcon, SearchIcon, UserIcon } from '../Icons';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = (): void => {};
</script>

{#snippet merchantLogo()}
  <CreditCardIcon size="large" color="surface.icon.staticWhite.normal" />
{/snippet}

{#snippet storeThumbnail()}
  <div
    style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:var(--border-radius-medium);background-color:var(--interactive-background-static-white-faded);"
  >
    <BuildingIcon size="medium" color="surface.icon.staticWhite.normal" />
  </div>
{/snippet}

{#snippet promoIllustration()}
  <div
    style="display:flex;align-items:center;justify-content:center;padding:var(--spacing-2) var(--spacing-4);border-radius:var(--border-radius-medium);background-color:var(--interactive-background-static-white-faded);"
  >
    <Text size="xsmall" weight="semibold" color="surface.text.staticWhite.normal">20% OFF</Text>
  </div>
{/snippet}

<!-- Story 1: Default — back button + title -->
<Story name="Default" asChild>
  <AppBar backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
    <AppBarLeading title="Order details" />
  </AppBar>
</Story>

<!-- Story 2: With Logo — logo + RTB badge -->
<Story name="With Logo" asChild>
  <AppBar backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
    <AppBarLeading isTrustedBusiness>
      {#snippet logo()}
        {@render merchantLogo()}
      {/snippet}
    </AppBarLeading>
  </AppBar>
</Story>

<!-- Story 3: With Actions — logo + RTB + three trailing icon buttons -->
<Story name="With Actions" asChild>
  <AppBar backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
    <AppBarLeading isTrustedBusiness>
      {#snippet logo()}
        {@render merchantLogo()}
      {/snippet}
    </AppBarLeading>
    <AppBarActions>
      <Button
        icon={SearchIcon}
        variant="tertiary"
        color="white"
        accessibilityLabel="Search"
        onClick={noop}
      />
      <Button
        icon={UserIcon}
        variant="tertiary"
        color="white"
        accessibilityLabel="Profile"
        onClick={noop}
      />
      <Button
        icon={CloseIcon}
        variant="tertiary"
        color="white"
        accessibilityLabel="Close"
        onClick={noop}
      />
    </AppBarActions>
  </AppBar>
</Story>

<!-- Story 4: Text With Thumbnail — prefix thumbnail + title + subtitle -->
<Story name="Text With Thumbnail" asChild>
  <AppBar backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
    <AppBarLeading title="Body Text" subtitle="Online store">
      {#snippet prefix()}
        {@render storeThumbnail()}
      {/snippet}
    </AppBarLeading>
    <AppBarActions>
      <Button
        icon={CloseIcon}
        variant="tertiary"
        color="white"
        accessibilityLabel="Close"
        onClick={noop}
      />
    </AppBarActions>
  </AppBar>
</Story>

<!-- Story 5: Trailing Illustration — illustration node in AppBarActions -->
<Story name="Trailing Illustration" asChild>
  <AppBar backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
    <AppBarLeading isTrustedBusiness>
      {#snippet logo()}
        {@render merchantLogo()}
      {/snippet}
    </AppBarLeading>
    <AppBarActions>
      {@render promoIllustration()}
    </AppBarActions>
  </AppBar>
</Story>

<!-- Story 6: Subtle Variant — adaptive gray surface on a light background -->
<Story name="Subtle Variant" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); min-height: 200px;">
    <AppBar variant="subtle" backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading title="Settings" />
      <AppBarActions>
        <Button
          icon={UserIcon}
          variant="tertiary"
          accessibilityLabel="Profile"
          onClick={noop}
        />
      </AppBarActions>
    </AppBar>
    <div style="padding: var(--spacing-6);">
      <Text>The subtle variant adapts to a light/embedded page background.</Text>
    </div>
  </div>
</Story>

<!-- Story 7: Sticky On Scroll — sticky AppBar over a tall scroll container -->
<Story name="Sticky On Scroll" asChild>
  <div style="height: 320px; overflow-y: auto; background-color: var(--surface-background-gray-subtle);">
    <AppBar isSticky backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading isTrustedBusiness>
        {#snippet logo()}
          {@render merchantLogo()}
        {/snippet}
      </AppBarLeading>
      <AppBarActions>
        <Button
          icon={SearchIcon}
          variant="tertiary"
          color="white"
          accessibilityLabel="Search"
          onClick={noop}
        />
      </AppBarActions>
    </AppBar>
    <div style="padding: var(--spacing-6); display: flex; flex-direction: column; gap: var(--spacing-5);">
      {#each Array.from({ length: 20 }) as _item, index (index)}
        <Text>Scroll content row {index + 1}</Text>
      {/each}
    </div>
  </div>
</Story>
