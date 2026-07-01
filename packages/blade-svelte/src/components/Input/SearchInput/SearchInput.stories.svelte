<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SearchInput from './SearchInput.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/SearchInput',
    component: SearchInput,
    tags: ['autodocs'],
    args: {
      label: 'Search',
      placeholder: 'Search payments, refunds, etc.',
      name: 'search',
      size: 'medium',
    },
    argTypes: {
      label: { control: { type: 'text' }, description: 'Label for the input.' },
      placeholder: { control: { type: 'text' }, description: 'Placeholder text.' },
      helpText: { control: { type: 'text' }, description: 'Help text rendered below the input.' },
      isLoading: { control: { type: 'boolean' }, description: 'Shows a loading spinner.' },
      showSearchIcon: { control: { type: 'boolean' }, description: 'Toggle the leading search icon.' },
      isDisabled: { control: { type: 'boolean' }, description: 'Disables the input.' },
      size: {
        control: { type: 'select' },
        options: ['medium', 'large'],
        description: 'Sets the size of the input.',
        table: { defaultValue: { summary: 'medium' } },
      },
      accessibilityLabel: {
        control: { type: 'text' },
        description: 'Accessibility label (used when label is absent).',
      },
    },
  });
</script>

<script lang="ts">
  import Link from '../../Link/Link.svelte';
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import { InfoIcon } from '../../Icons';

  const sizes = ['medium', 'large'] as const;
</script>

<!-- 1 -->
<Story name="Default">
  {#snippet template(args)}
    <SearchInput {...args} />
  {/snippet}
</Story>

<!-- 2 -->
<Story name="SearchInput with Help Text" args={{ helpText: 'Search across all your transactions' }}>
  {#snippet template(args)}
    <SearchInput {...args} />
  {/snippet}
</Story>

<!-- 3 -->
<Story name="SearchInput without label" args={{ label: undefined, accessibilityLabel: 'Search' }}>
  {#snippet template(args)}
    <SearchInput {...args} />
  {/snippet}
</Story>

<!-- 4 -->
<Story name="SearchInputSizes" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    {#each sizes as size (size)}
      <SearchInput {size} label={`Size ${size}`} placeholder="Search" />
    {/each}
  </div>
</Story>

<!-- 5 -->
<Story name="SearchInput with Label Suffix & Trailing" asChild>
  <SearchInput label="Search" placeholder="Search payments">
    {#snippet labelSuffix()}
      <Tooltip content="Search by payment ID, amount, or customer">
        <div style="display: flex; align-items: center;">
          <InfoIcon size="small" color="surface.icon.gray.muted" />
        </div>
      </Tooltip>
    {/snippet}
    {#snippet labelTrailing()}
      <Link size="small" onClick={() => {}}>Advanced</Link>
    {/snippet}
  </SearchInput>
</Story>

<!-- 6 -->
<Story name="Showcase - All Variants" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-6);">
    <SearchInput label="Default" placeholder="Search" />
    <SearchInput label="With help text" placeholder="Search" helpText="Help text" />
    <SearchInput label="Loading" placeholder="Search" isLoading />
    <SearchInput label="With value (clearable)" placeholder="Search" defaultValue="Payments" />
    <SearchInput label="Without search icon" placeholder="Search" showSearchIcon={false} />
    <SearchInput label="Disabled" placeholder="Search" isDisabled />
  </div>
</Story>
