<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ChipGroup from './ChipGroup.svelte';

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
        table: { category: 'ChipGroup Props', type: { summary: '"required" | "optional" | "none"' } },
      },
      isDisabled: {
        description: 'Disables or enables `ChipGroup`.',
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
        table: { category: 'ChipGroup Props', type: { summary: '({ name, values }) => void' } },
      },
      selectionType: {
        description: 'Defines the selection behavior within the ChipGroup component.',
        options: ['single', 'multiple'],
        control: { type: 'select' },
        table: { category: 'ChipGroup Props', type: { summary: '"single" | "multiple"' } },
      },
      value: {
        description: 'Value of the Chip group. Acts as a controlled component.',
        table: { category: 'ChipGroup Props', type: { summary: 'string' } },
      },
      defaultValue: {
        description: 'Sets the initial value of the Chip group',
        table: { category: 'ChipGroup Props', type: { summary: 'string | string[]' } },
      },
      size: {
        description: 'Specifies the size of the rendered Chips within the ChipGroup',
        options: ['xsmall', 'small', 'medium', 'large'],
        control: { type: 'radio' },
        table: { category: 'ChipGroup Props', type: { summary: '"xsmall" | "small" | "medium" | "large"' } },
      },
      color: {
        description: "Sets the ChipGroup's visual color",
        options: ['primary', 'positive', 'negative'],
        control: { type: 'select' },
        table: { category: 'ChipGroup Props', type: { summary: '"primary" | "positive" | "negative"' } },
      },
    },
  });
</script>

<script lang="ts">
  import Chip from './Chip.svelte';
  import Button from '../Button/Button.svelte';
  import { CheckIcon } from '../Icons/CheckIcon';
  import { CloseIcon } from '../Icons/CloseIcon';
  import { CreditCardIcon } from '../Icons/CreditCardIcon';
  import { SearchIcon } from '../Icons/SearchIcon';
  import { PlusIcon } from '../Icons/PlusIcon';

  const singleChipValues = ['Proprietorship', 'Public', 'Small Business'];
  const multiChipValues = [
    'Automated Payment Links',
    'Wallet on My App',
    'Offer discounts, Pay Later & EMI options',
  ];
  const sizes = ['xsmall', 'small', 'medium', 'large'] as const;

  let controlledSingleValue = $state('Proprietorship');
  let controlledMultiValues = $state(['Automated Payment Links']);
  let chipRefValue = $state('');
</script>

<!-- Story 1: Single Selection -->
<Story name="Single Selection" asChild>
  <div>
    <ChipGroup selectionType="single" label="Select Business type:" accessibilityLabel="Choose one business type from the options below">
      {#each singleChipValues as chipValue}
        <Chip value={chipValue}>{chipValue}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 2: Multi Selection -->
<Story name="Multi Selection" asChild>
  <div>
    <ChipGroup
      selectionType="multiple"
      label="What other capabilities are you looking for?"
      accessibilityLabel="Select other capabilities you are looking for from the options below"
    >
      {#each multiChipValues as chipValue}
        <Chip value={chipValue}>{chipValue}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 3: Uncontrolled Single Selection with Default Value -->
<Story name="Uncontrolled Single Selection with Default Value" asChild>
  <div>
    <ChipGroup
      defaultValue="Proprietorship"
      selectionType="single"
      label="Select Business type:"
      accessibilityLabel="Choose one business type from the options below"
    >
      {#each singleChipValues as chipValue}
        <Chip value={chipValue}>{chipValue}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 4: Uncontrolled Multiple Selection with Default Value -->
<Story name="Uncontrolled Multiple Selection with Default Value" asChild>
  <div>
    <ChipGroup
      defaultValue={['Automated Payment Links']}
      selectionType="multiple"
      label="What other capabilities are you looking for?"
      accessibilityLabel="Select other capabilities you are looking for from the options below"
    >
      {#each multiChipValues as chipValue}
        <Chip value={chipValue}>{chipValue}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 5: Controlled Single Selection (native <select> replaces Dropdown) -->
<Story name="Controlled Single Selection" asChild>
  <div style="display:flex;flex-direction:column;gap:20px;min-height:200px">
    <select
      value={controlledSingleValue}
      onchange={(e) => { controlledSingleValue = e.currentTarget.value; }}
      style="max-width:200px;padding:4px 8px"
    >
      {#each singleChipValues as chipValue}
        <option value={chipValue}>{chipValue}</option>
      {/each}
    </select>
    <ChipGroup
      selectionType="single"
      value={controlledSingleValue}
      onChange={({ values }) => { controlledSingleValue = values[0] || ''; }}
      accessibilityLabel="Choose one business type from the options below"
    >
      {#each singleChipValues as chipValue}
        <Chip value={chipValue}>{chipValue}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 6: Controlled Multiple Selection (native <select multiple> replaces Dropdown) -->
<Story name="Controlled Multiple Selection" asChild>
  <div style="display:flex;flex-direction:column;gap:20px;min-height:200px">
    <select
      multiple
      onchange={(e) => {
        const selected = Array.from(e.currentTarget.selectedOptions, (o) => o.value);
        controlledMultiValues = selected;
      }}
      style="max-width:300px;padding:4px 8px;min-height:80px"
    >
      {#each multiChipValues as chipValue}
        <option value={chipValue} selected={controlledMultiValues.includes(chipValue)}>{chipValue}</option>
      {/each}
    </select>
    <ChipGroup
      selectionType="multiple"
      value={controlledMultiValues}
      onChange={({ values }) => { controlledMultiValues = values; }}
      accessibilityLabel="Select other capabilities you are looking for from the options below"
    >
      {#each multiChipValues as chipValue}
        <Chip value={chipValue}>{chipValue}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 7: Disabled -->
<Story name="Disabled" asChild>
  <div>
    <ChipGroup isDisabled={true} selectionType="single" label="Select Business type:" accessibilityLabel="Choose one business type from the options below">
      {#each singleChipValues as chipValue}
        <Chip value={chipValue}>{chipValue}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 8: With Icon (using available migrated icons as stand-ins) -->
<Story name="With Icon" asChild>
  <div>
    <ChipGroup
      defaultValue="payment-links"
      selectionType="single"
      label="What other capabilities are you looking for?"
      accessibilityLabel="Choose one business type from the options below"
    >
      <Chip value="payment-links" icon={CreditCardIcon}>
        Automated Payment Links
      </Chip>
      <Chip value="wallet" icon={SearchIcon}>
        Wallet on My App
      </Chip>
      <Chip value="offers" icon={PlusIcon}>
        Offer discounts, Pay Later & EMI options
      </Chip>
    </ChipGroup>
  </div>
</Story>

<!-- Story 9: With Color -->
<Story name="With Color" asChild>
  <div style="display:flex;flex-direction:column">
    <span style="font-size:16px;font-weight:600;margin-bottom:8px">Is the result helpful?</span>
    <ChipGroup
      defaultValue="yes"
      selectionType="single"
      accessibilityLabel="Is the result helpful? Please select either yes or no"
    >
      <Chip color="positive" value="yes" icon={CheckIcon}>Yes</Chip>
      <Chip color="negative" value="no" icon={CloseIcon}>No</Chip>
    </ChipGroup>
  </div>
</Story>

<!-- Story 10: Icon Only -->
<Story name="Icon Only" asChild>
  <div style="display:flex;flex-direction:column">
    <span style="font-size:16px;font-weight:600;margin-bottom:8px">Is the result helpful?</span>
    <ChipGroup
      defaultValue="yes"
      selectionType="single"
      accessibilityLabel="Is the result helpful? Please select either yes or no"
    >
      <Chip color="positive" value="yes" icon={CheckIcon} />
      <Chip color="negative" value="no" icon={CloseIcon} />
    </ChipGroup>
  </div>
</Story>

<!-- Story 11: Text Transformation (Uppercase) -->
<Story name="Text Transformation (Uppercase)" asChild>
  <div>
    <ChipGroup
      defaultValue="Proprietorship"
      label="Select Business Type:"
      selectionType="single"
      accessibilityLabel="Choose one business type from the options below"
    >
      {#each singleChipValues as chipValue}
        <Chip value={chipValue}>{chipValue.toUpperCase()}</Chip>
      {/each}
    </ChipGroup>
  </div>
</Story>

<!-- Story 12: All Sizes -->
<Story name="All Sizes" asChild>
  <div>
    {#each sizes as chipSize}
      <div style="margin-bottom:16px">
        <h4 style="margin-bottom:8px">{chipSize}</h4>
        <ChipGroup
          defaultValue="payment-links"
          label="What other capabilities are you looking for?"
          size={chipSize}
          selectionType="single"
          accessibilityLabel="Select other capabilities you are looking for from the options below"
        >
          <Chip value="payment-links" icon={CreditCardIcon}>
            Automated Payment Links
          </Chip>
          <Chip value="wallet" icon={SearchIcon}>
            Wallet on My App
          </Chip>
          <Chip value="offers" icon={PlusIcon}>
            Offer discounts, Pay Later & EMI options
          </Chip>
        </ChipGroup>
      </div>
    {/each}
  </div>
</Story>

<!-- Story 13: Chip Ref (controlled via Button) -->
<Story name="Chip Ref" asChild>
  <div style="display:flex;flex-direction:column;gap:12px">
    <ChipGroup
      selectionType="single"
      value={chipRefValue}
      accessibilityLabel="Select one business type from the options below"
    >
      <Chip value="Proprietorship">Proprietorship</Chip>
      <Chip value="Public">Public</Chip>
      <Chip value="Small Business">Small Business</Chip>
    </ChipGroup>
    <div style="max-width:400px;display:flex;gap:12px">
      <Button
        isFullWidth={true}
        onClick={() => { chipRefValue = 'Proprietorship'; }}
      >
        Select Proprietorship
      </Button>
      <Button
        isFullWidth={true}
        variant="secondary"
        onClick={() => { chipRefValue = ''; }}
      >
        Reset Selection
      </Button>
    </div>
  </div>
</Story>

<!-- Story 14: ChipGroup with Custom layout -->
<Story name="ChipGroup with Custom layout" asChild>
  {@const chipArray = [
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
  ]}
  <div style="display:flex;flex-direction:column;gap:12px">
    <ChipGroup selectionType="single" label="Select a gift card with value (with default layout)">
      {#each chipArray as chip}
        <Chip value={chip.value}>{chip.label}</Chip>
      {/each}
    </ChipGroup>
    <ChipGroup selectionType="single" label="Select a gift card with value (with custom layout)">
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);grid-template-rows:repeat(3, minmax(0, 30px));gap:8px">
        {#each chipArray as chip}
          <Chip value={chip.value} width="100%">{chip.label}</Chip>
        {/each}
      </div>
    </ChipGroup>
  </div>
</Story>
