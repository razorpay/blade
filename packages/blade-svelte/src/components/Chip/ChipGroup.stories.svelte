<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ChipGroup from './ChipGroup.svelte';
  import Chip from './Chip.svelte';

  const { Story } = defineMeta({
    title: 'Components/Chip/ChipGroup',
    component: ChipGroup,
    tags: ['autodocs'],
    args: {
      isDisabled: false,
      accessibilityLabel: 'Choose one business type from the options below',
    },
    argTypes: {
      label: {
        description: 'Label for the `ChipGroup`.',
        control: { type: 'text' },
        table: { category: 'ChipGroup Props', type: { summary: 'string' } },
      },
      accessibilityLabel: {
        description: 'Accessibility label for the `ChipGroup`.',
        control: { type: 'text' },
        table: { category: 'ChipGroup Props', type: { summary: 'string' } },
      },
      labelPosition: {
        description: 'Sets the position of the label',
        options: ['top', 'left'],
        control: { type: 'select' },
        table: { category: 'ChipGroup Props', type: { summary: '"top" | "left"' } },
      },
      helpText: {
        description: 'Help text for the `ChipGroup`.',
        control: { type: 'text' },
        table: { category: 'ChipGroup Props', type: { summary: 'string' } },
      },
      errorText: {
        description: 'Error text for the `ChipGroup`.',
        control: { type: 'text' },
        table: { category: 'ChipGroup Props', type: { summary: 'string' } },
      },
      validationState: {
        description: 'Sets the validation state of the ChipGroup.',
        options: ['error', 'none'],
        control: { type: 'select' },
        table: { category: 'ChipGroup Props', type: { summary: '"error" | "none"' } },
      },
      necessityIndicator: {
        description: 'Renders a necessity indicator after ChipGroup label.',
        options: ['required', 'optional', 'none'],
        control: { type: 'select' },
        table: {
          category: 'ChipGroup Props',
          type: { summary: '"required" | "optional" | "none"' },
        },
      },
      isDisabled: {
        description:
          'Disables or enables `ChipGroup`, it will propagate down to all the children `Chip` components.',
        control: { type: 'boolean' },
        table: { category: 'ChipGroup Props', type: { summary: 'boolean' } },
      },
      isRequired: {
        description: 'Sets the required state of the ChipGroup component.',
        control: { type: 'boolean' },
        table: { category: 'ChipGroup Props', type: { summary: 'boolean' } },
      },
      name: {
        description: 'Specifies the name attribute for the `ChipGroup` component.',
        control: { type: 'text' },
        table: { category: 'ChipGroup Props', type: { summary: 'string' } },
      },
      onChange: {
        description: 'The callback invoked on any state change within the `ChipGroup`.',
        table: {
          category: 'ChipGroup Props',
          type: { summary: '({ name, values }: { name: string; values: string[] }) => void' },
        },
      },
      selectionType: {
        description: `Defines the selection behavior within the ChipGroup component.`,
        options: ['single', 'multiple'],
        control: { type: 'select' },
        table: { category: 'ChipGroup Props', type: { summary: '"single" | "multiple"' } },
      },
      value: {
        description: 'Value of the Chip group. Acts as a controlled component.',
        table: { category: 'ChipGroup Props', type: { summary: 'string | string[]' } },
      },
      defaultValue: {
        description: 'Sets the initial value of the Chip group.',
        table: { category: 'ChipGroup Props', type: { summary: 'string | string[]' } },
      },
      size: {
        description: 'Specifies the size of the rendered Chips within the ChipGroup.',
        options: ['xsmall', 'small', 'medium', 'large'],
        control: { type: 'radio' },
        table: { category: 'ChipGroup Props', type: { summary: '"xsmall" | "small" | "medium" | "large"' } },
      },
      color: {
        description: `Sets the ChipGroup's visual color, it will propagate down to all the Chips.`,
        options: ['primary', 'positive', 'negative'],
        control: { type: 'select' },
        table: { category: 'ChipGroup Props', type: { summary: '"primary" | "positive" | "negative"' } },
      },
    },
  });
</script>

<script>
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  const multiChipValues = [
    'Automated Payment Links',
    'Wallet on My App',
    'Offer discounts, Pay Later & EMI options',
  ];
  const sizes = ['xsmall', 'small', 'medium', 'large'];
  const giftCards = [
    { value: '100', label: '₹100' },
    { value: '500', label: '₹500' },
    { value: '1000', label: '₹1000' },
    { value: '2000', label: '₹2000' },
    { value: '5000', label: '₹5000' },
    { value: '10000', label: '₹10000' },
    { value: '20000', label: '₹20000' },
    { value: '50000', label: '₹50000' },
    { value: '100000', label: '₹100000' },
    { value: '200000', label: '₹200000' },
  ];

  // State for controlled stories
  let controlledSingleValue = $state('Proprietorship');
  let controlledMultiValues = $state(['Automated Payment Links']);

  // State for chip ref story
  let chipRefValue = $state('');
</script>

<!-- Story 1: Single Selection -->
<Story name="Single Selection">
  {#snippet children(args)}
    <div>
      <ChipGroup
        {...args}
        selectionType="single"
        label="Select Business type:"
      >
        {#snippet children()}
          {#each chipValues as chipValue}
            <Chip value={chipValue}>{chipValue}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 2: Multi Selection -->
<Story name="Multi Selection">
  {#snippet children(args)}
    <div>
      <ChipGroup
        {...args}
        selectionType="multiple"
        label="What other capabilities are you looking for?"
        accessibilityLabel="Select other capabilities you are looking for from the options below"
      >
        {#snippet children()}
          {#each multiChipValues as chipValue}
            <Chip value={chipValue}>{chipValue}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 3: Uncontrolled Single Selection with Default Value -->
<Story name="Uncontrolled Single Selection with Default Value">
  {#snippet children(args)}
    <div>
      <ChipGroup
        {...args}
        defaultValue="Proprietorship"
        selectionType="single"
        label="Select Business type:"
      >
        {#snippet children()}
          {#each chipValues as chipValue}
            <Chip value={chipValue}>{chipValue}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 4: Uncontrolled Multiple Selection with Default Value -->
<Story name="Uncontrolled Multiple Selection with Default Value">
  {#snippet children(args)}
    <div>
      <ChipGroup
        {...args}
        defaultValue={['Automated Payment Links']}
        selectionType="multiple"
        label="What other capabilities are you looking for?"
        accessibilityLabel="Select other capabilities you are looking for from the options below"
      >
        {#snippet children()}
          {#each multiChipValues as chipValue}
            <Chip value={chipValue}>{chipValue}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 5: Controlled Single Selection -->
<Story name="Controlled Single Selection">
  {#snippet children(args)}
    <div style="display: flex; gap: 20px; flex-direction: column; min-height: 200px;">
      <div>
        <label for="controlled-single-select" style="font-family: var(--font-family-text); font-size: 14px; margin-right: 8px;">
          Business Type:
        </label>
        <select
          id="controlled-single-select"
          value={controlledSingleValue}
          onchange={(e) => { controlledSingleValue = e.target.value; }}
          style="padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc;"
        >
          {#each chipValues as chipValue}
            <option value={chipValue}>{chipValue}</option>
          {/each}
        </select>
      </div>

      <ChipGroup
        {...args}
        selectionType="single"
        value={controlledSingleValue}
        onChange={({ values }) => { controlledSingleValue = values[0] || ''; }}
        accessibilityLabel="Choose one business type from the options below"
      >
        {#snippet children()}
          {#each chipValues as chipValue}
            <Chip value={chipValue}>{chipValue}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 6: Controlled Multiple Selection -->
<Story name="Controlled Multiple Selection">
  {#snippet children(args)}
    <div style="display: flex; gap: 20px; flex-direction: column; min-height: 200px;">
      <div>
        <label for="controlled-multi-select" style="font-family: var(--font-family-text); font-size: 14px; margin-right: 8px;">
          Capabilities:
        </label>
        <select
          id="controlled-multi-select"
          multiple
          onchange={(e) => {
            const select = e.target;
            controlledMultiValues = Array.from(select.selectedOptions, (opt) => opt.value);
          }}
          style="padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc; min-height: 80px;"
        >
          {#each multiChipValues as chipValue}
            <option value={chipValue} selected={controlledMultiValues.includes(chipValue)}>{chipValue}</option>
          {/each}
        </select>
      </div>

      <ChipGroup
        {...args}
        selectionType="multiple"
        value={controlledMultiValues}
        onChange={({ values }) => { controlledMultiValues = values; }}
        accessibilityLabel="Select other capabilities you are looking for from the options below"
      >
        {#snippet children()}
          {#each multiChipValues as chipValue}
            <Chip value={chipValue}>{chipValue}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 7: Disabled -->
<Story name="Disabled">
  {#snippet children(args)}
    <div>
      <ChipGroup
        {...args}
        isDisabled={true}
        selectionType="single"
        label="Select Business type:"
      >
        {#snippet children()}
          {#each chipValues as chipValue}
            <Chip value={chipValue}>{chipValue}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 8: With Icon -->
<Story name="With Icon">
  {#snippet children(args)}
    <div>
      <ChipGroup
        {...args}
        defaultValue="payment-links"
        selectionType="single"
        label="What other capabilities are you looking for?"
        accessibilityLabel="Choose one business type from the options below"
      >
        {#snippet children()}
          <Chip value="payment-links" icon={true}>
            Automated Payment Links
          </Chip>
          <Chip value="wallet" icon={true}>
            Wallet on My App
          </Chip>
          <Chip value="offers" icon={true}>
            Offer discounts, Pay Later & EMI options
          </Chip>
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 9: With Color -->
<Story name="With Color">
  {#snippet children(args)}
    <div style="display: flex; flex-direction: column;">
      <span style="font-family: var(--font-family-text); font-size: 16px; font-weight: 600; margin-bottom: 12px;">
        Is the result helpful?
      </span>

      <ChipGroup
        {...args}
        defaultValue="yes"
        selectionType="single"
        accessibilityLabel="Is the result helpful? Please select either yes or no"
      >
        {#snippet children()}
          <Chip color="positive" value="yes" icon={true}>
            Yes
          </Chip>
          <Chip color="negative" value="no" icon={true}>
            No
          </Chip>
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 10: Icon Only -->
<Story name="Icon Only">
  {#snippet children(args)}
    <div style="display: flex; flex-direction: column;">
      <span style="font-family: var(--font-family-text); font-size: 16px; font-weight: 600; margin-bottom: 12px;">
        Is the result helpful?
      </span>

      <ChipGroup
        {...args}
        defaultValue="yes"
        selectionType="single"
        accessibilityLabel="Is the result helpful? Please select either yes or no"
      >
        {#snippet children()}
          <Chip color="positive" value="yes" icon={true} />
          <Chip color="negative" value="no" icon={true} />
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>

<!-- Story 11: Text Transformation (Uppercase) -->
<Story name="Text Transformation (Uppercase)">
  {#snippet children(args)}
    <div>
      <ChipGroup
        {...args}
        defaultValue="Proprietorship"
        label="Select Business Type:"
        selectionType="single"
        accessibilityLabel="Choose one business type from the options below"
      >
        {#snippet children()}
          {#each chipValues as chipValue}
            <Chip value={chipValue}>{chipValue.toUpperCase()}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>
      <p style="font-family: var(--font-family-text); font-size: 14px; margin-top: 12px;">
        The text within the Chip can be transformed to uppercase by passing
        <code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">value.toUpperCase()</code>
        as the children.
      </p>
    </div>
  {/snippet}
</Story>

<!-- Story 12: All Sizes -->
<Story name="All Sizes">
  {#snippet children(args)}
    <div>
      {#each sizes as chipSize}
        <div style="margin-bottom: 24px;">
          <h3 style="font-family: var(--font-family-text); font-size: 14px; font-weight: 600; margin-bottom: 12px;">
            {chipSize}
          </h3>
          <ChipGroup
            {...args}
            defaultValue="payment-links"
            label="What other capabilities are you looking for?"
            size={chipSize}
            selectionType="single"
            accessibilityLabel="Select other capabilities you are looking for from the options below"
          >
            {#snippet children()}
              <Chip value="payment-links" icon={true}>
                Automated Payment Links
              </Chip>
              <Chip value="wallet" icon={true}>
                Wallet on My App
              </Chip>
              <Chip value="offers" icon={true}>
                Offer discounts, Pay Later & EMI options
              </Chip>
            {/snippet}
          </ChipGroup>
        </div>
      {/each}
    </div>
  {/snippet}
</Story>

<!-- Story 13: Chip Ref -->
<Story name="Chip Ref">
  {#snippet children(args)}
    <div style="display: flex; gap: 12px; flex-direction: column;">
      <ChipGroup
        {...args}
        selectionType="single"
        value={chipRefValue}
        onChange={({ values }) => { chipRefValue = values[0] || ''; }}
        accessibilityLabel="Select one business type from the options below"
      >
        {#snippet children()}
          <Chip value="Proprietorship">
            Proprietorship
          </Chip>
          <Chip value="Public">Public</Chip>
          <Chip value="Small Business">Small Business</Chip>
        {/snippet}
      </ChipGroup>
      <div style="display: flex; flex-direction: row; gap: 12px; max-width: 400px;">
        <button
          style="flex: 1; padding: 8px 16px; background: var(--interactive-background-primary-default); color: white; border: none; border-radius: 4px; cursor: pointer;"
          onclick={() => {
            chipRefValue = 'Proprietorship';
          }}
        >
          Select Proprietorship
        </button>
        <button
          style="flex: 1; padding: 8px 16px; background: transparent; color: var(--interactive-text-primary-normal); border: 1px solid var(--interactive-border-primary-default); border-radius: 4px; cursor: pointer;"
          onclick={() => {
            chipRefValue = '';
          }}
        >
          Reset Selection
        </button>
      </div>
    </div>
  {/snippet}
</Story>

<!-- Story 14: ChipGroup with Custom layout -->
<Story name="ChipGroup with Custom layout">
  {#snippet children(args)}
    <div style="display: flex; gap: 12px; flex-direction: column;">
      <ChipGroup
        selectionType="single"
        label="Select a gift card with value (with default layout)"
      >
        {#snippet children()}
          {#each giftCards as card}
            <Chip value={card.value}>{card.label}</Chip>
          {/each}
        {/snippet}
      </ChipGroup>

      <ChipGroup
        selectionType="single"
        label="Select a gift card with value (with custom layout)"
      >
        {#snippet children()}
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, minmax(0, 30px)); gap: 8px;">
            {#each giftCards as card}
              <Chip value={card.value} width="100%">{card.label}</Chip>
            {/each}
          </div>
        {/snippet}
      </ChipGroup>
    </div>
  {/snippet}
</Story>
