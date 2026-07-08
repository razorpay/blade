<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SearchInput from './SearchInput.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/SearchInput',
    component: SearchInput,
    tags: ['autodocs'],
    args: {
      label: 'Search here',
      placeholder: 'Search payment products, settings, and more',
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
  import Text from '../../Typography/Text/Text.svelte';
  import { InfoIcon } from '../../Icons';
</script>

<!-- 1 -->
<Story name="Default">
  {#snippet template(args)}
    <SearchInput {...args} />
  {/snippet}
</Story>

<!-- 2 -->
<Story name="SearchInput with Help Text" args={{ helpText: 'Please enter an item to search' }}>
  {#snippet template(args)}
    <SearchInput {...args} />
  {/snippet}
</Story>

<!-- 3 -->
<Story
  name="SearchInput without label"
  args={{
    defaultValue: 'Transactions',
    label: undefined,
    accessibilityLabel: 'Search payment products, settings, and more.',
  }}
>
  {#snippet template(args)}
    <SearchInput {...args} />
  {/snippet}
</Story>

<!-- 4 -->
<Story name="SearchInputSizes" asChild>
  <div style="display: flex; flex-direction: column;">
    <Text size="large" marginBottom="spacing.4">Medium Size:</Text>
    <SearchInput
      size="medium"
      label="Search here"
      placeholder="Search payment products, settings, and more"
    />
    <Text size="large" marginTop="spacing.4" marginBottom="spacing.4">Large Size:</Text>
    <SearchInput
      size="large"
      label="Search here"
      placeholder="Search payment products, settings, and more"
    />
  </div>
</Story>

<!-- 5 -->
<Story name="SearchInput with Label Suffix & Trailing" asChild>
  <SearchInput label="Search here" placeholder="Search here">
    {#snippet labelSuffix()}
      <Tooltip content="Search for payment products, settings, and more" placement="right">
        <div style="display: flex; align-items: center;">
          <InfoIcon size="small" color="surface.icon.gray.muted" />
        </div>
      </Tooltip>
    {/snippet}
    {#snippet labelTrailing()}
      <Link size="small" onClick={() => {}}>Learn more</Link>
    {/snippet}
  </SearchInput>
</Story>

<!-- 6 -->
<Story name="Showcase - All Variants" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-8);">
    <!-- Basic Variants -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Basic Variants
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <SearchInput
          label="Default"
          placeholder="Search payment products, settings, and more"
          name="default"
        />
        <SearchInput label="With Value" defaultValue="Transactions" name="withValue" />
        <SearchInput
          label="With Help Text"
          placeholder="Search payment products, settings, and more"
          helpText="This is a helpful message"
          name="withHelpText"
        />
        <SearchInput
          label="Disabled"
          placeholder="Search payment products, settings, and more"
          isDisabled
          name="disabled"
        />
      </div>
    </div>

    <!-- Sizes -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Sizes
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <SearchInput label="Medium Size" placeholder="Medium size search input" size="medium" name="sizeMedium" />
        <SearchInput label="Large Size" placeholder="Large size search input" size="large" name="sizeLarge" />
      </div>
    </div>

    <!-- Label Positions -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Label Positions
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <SearchInput label="Label Top" placeholder="Label on top" labelPosition="top" name="labelTop" />
        <SearchInput label="Label Left" placeholder="Label on left" labelPosition="left" name="labelLeft" />
      </div>
    </div>

    <!-- Without Label -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Without Label
      </Text>
      <SearchInput
        placeholder="Search payment products, settings, and more"
        accessibilityLabel="Search payment products, settings, and more"
        defaultValue="Transactions"
        name="withoutLabel"
      />
    </div>

    <!-- With Trailing Dropdown: OMITTED — depends on Dropdown/InputDropdownButton (not migrated). -->

    <!-- Loading State -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Loading State
      </Text>
      <SearchInput
        label="Loading"
        placeholder="Search payment products, settings, and more"
        isLoading
        name="loading"
      />
    </div>

    <!-- With Clear Button -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Clear Button
      </Text>
      <SearchInput label="With Clear Button" defaultValue="Clear me" name="clearButton" />
    </div>

    <!-- With Label Suffix & Trailing -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="surface.text.gray.subtle">
        With Label Suffix & Trailing
      </Text>
      <SearchInput
        label="Search"
        placeholder="Search payment products, settings, and more"
        name="labelSuffixTrailing"
      >
        {#snippet labelSuffix()}
          <Tooltip content="Search for payment products, settings, and more" placement="right">
            <div style="display: flex; align-items: center;">
              <InfoIcon size="small" color="surface.icon.gray.muted" />
            </div>
          </Tooltip>
        {/snippet}
        {#snippet labelTrailing()}
          <Link size="small" onClick={() => {}}>Learn more</Link>
        {/snippet}
      </SearchInput>
    </div>
  </div>
</Story>
