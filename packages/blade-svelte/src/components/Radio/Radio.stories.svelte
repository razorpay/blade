<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RadioGroup from './RadioGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/Radio & RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    args: {
      label: 'Radio example',
      isDisabled: false,
      isRequired: false,
      necessityIndicator: 'none',
      validationState: 'none',
      size: 'medium',
      orientation: 'vertical',
      labelPosition: 'top',
    },
    argTypes: {
      label: {
        description: 'Label for the RadioGroup.',
        control: { type: 'text' },
      },
      helpText: {
        description: 'Help text displayed below the radio group.',
        control: { type: 'text' },
      },
      errorText: {
        description: 'Error text shown when validationState is "error".',
        control: { type: 'text' },
      },
      validationState: {
        description: 'Sets the validation state of the RadioGroup.',
        options: ['error', 'none'],
        control: { type: 'select' },
      },
      necessityIndicator: {
        description: 'Renders a necessity indicator after the label.',
        options: ['required', 'optional', 'none'],
        control: { type: 'select' },
      },
      isDisabled: {
        description: 'Disables all radios in the group.',
        control: { type: 'boolean' },
      },
      isRequired: {
        description: 'Marks the radio group as required.',
        control: { type: 'boolean' },
      },
      labelPosition: {
        description: 'Position of the label relative to the group.',
        options: ['top', 'left'],
        control: { type: 'select' },
      },
      size: {
        description: 'Size of all radios in the group.',
        options: ['small', 'medium', 'large'],
        control: { type: 'radio' },
      },
      orientation: {
        description: 'Orientation of the radio group.',
        options: ['vertical', 'horizontal'],
        control: { type: 'radio' },
      },
      defaultValue: {
        description: 'Initial uncontrolled value.',
        options: ['apple', 'mango', 'orange'],
        control: { type: 'select' },
      },
      value: {
        description: 'Controlled value. Use with onChange.',
        options: ['apple', 'mango', 'orange'],
        control: { type: 'select' },
      },
      onChange: {
        description: 'Callback invoked when the selected radio changes.',
        table: { category: 'Events', type: { summary: '({ name, value, event }) => void' } },
      },
    },
  });
</script>

<script lang="ts">
  import Radio from './Radio.svelte';
  import Button from '../Button/Button.svelte';
  import type { RadioSize } from './types';

  let controlledValue = $state('apple');

  const radioSizes: RadioSize[] = ['small', 'medium', 'large'];
</script>

<!-- Story 1: Default -->
<Story name="Default" asChild>
  <RadioGroup
    label="Where do you want to collect payments?"
    helpText="Select only one"
    name="payment-collection"
    defaultValue="website"
  >
    <Radio value="website">Website</Radio>
    <Radio value="android">Android App</Radio>
    <Radio value="ios">iOS App</Radio>
    <Radio value="social-media" helpText="Like WhatsApp, Facebook, Instagram">
      Social Media
    </Radio>
    <Radio value="offline-store">Offline Store</Radio>
  </RadioGroup>
</Story>

<!-- Story 2: Sizes -->
<Story name="Sizes" asChild>
  <div style="display:flex;flex-direction:column;gap:32px">
    {#each radioSizes as radioSize}
      <RadioGroup label="Size: {radioSize}" size={radioSize} defaultValue="apple">
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>
    {/each}
  </div>
</Story>

<!-- Story 3: Horizontal Orientation -->
<Story name="Horizontal Orientation" asChild>
  <RadioGroup
    label="Pick a fruit"
    orientation="horizontal"
    defaultValue="apple"
  >
    <Radio value="apple">Apple</Radio>
    <Radio value="mango">Mango</Radio>
    <Radio value="orange">Orange</Radio>
  </RadioGroup>
</Story>

<!-- Story 4: Help Text -->
<Story name="Help Text" asChild>
  <RadioGroup
    label="Pick a fruit"
    helpText="RadioGroup help text"
    defaultValue="apple"
  >
    <Radio value="apple">Apple</Radio>
    <Radio value="mango">Mango</Radio>
    <Radio value="orange">Orange</Radio>
  </RadioGroup>
</Story>

<!-- Story 5: Error State -->
<Story name="Error State" asChild>
  <RadioGroup
    label="Pick a fruit"
    validationState="error"
    errorText="Please select one option"
    defaultValue="apple"
  >
    <Radio value="apple">Apple</Radio>
    <Radio value="mango">Mango</Radio>
    <Radio value="orange">Orange</Radio>
  </RadioGroup>
</Story>

<!-- Story 6: Disabled -->
<Story name="Disabled" asChild>
  <RadioGroup
    label="Pick a fruit (disabled)"
    isDisabled={true}
    defaultValue="apple"
  >
    <Radio value="apple">Apple</Radio>
    <Radio value="mango">Mango</Radio>
    <Radio value="orange">Orange</Radio>
  </RadioGroup>
</Story>

<!-- Story 7: With Help Text per Radio -->
<Story name="With Help Text per Radio" asChild>
  <RadioGroup
    label="Where do you want to collect payments?"
    defaultValue="website"
  >
    <Radio value="website" helpText="Payments via your website">Website</Radio>
    <Radio value="android" helpText="Payments via Android app">Android App</Radio>
    <Radio value="social-media" helpText="Like WhatsApp, Facebook, Instagram">
      Social Media
    </Radio>
  </RadioGroup>
</Story>

<!-- Story 8: Label Position Left -->
<Story name="Label Position Left" asChild>
  <RadioGroup
    label="Pick a fruit"
    labelPosition="left"
    defaultValue="apple"
  >
    <Radio value="apple">Apple</Radio>
    <Radio value="mango">Mango</Radio>
    <Radio value="orange">Orange</Radio>
  </RadioGroup>
</Story>

<!-- Story 9: Necessity Indicator -->
<Story name="Necessity Indicator" asChild>
  <div style="display:flex;flex-direction:column;gap:24px">
    <RadioGroup
      label="Pick a fruit (required)"
      necessityIndicator="required"
      isRequired={true}
      defaultValue="apple"
    >
      <Radio value="apple">Apple</Radio>
      <Radio value="mango">Mango</Radio>
      <Radio value="orange">Orange</Radio>
    </RadioGroup>
    <RadioGroup
      label="Pick a fruit (optional)"
      necessityIndicator="optional"
      defaultValue="apple"
    >
      <Radio value="apple">Apple</Radio>
      <Radio value="mango">Mango</Radio>
      <Radio value="orange">Orange</Radio>
    </RadioGroup>
  </div>
</Story>

<!-- Story 10: Controlled -->
<Story name="Controlled" asChild>
  <div style="display:flex;flex-direction:column;gap:16px">
    <RadioGroup
      label="Pick a fruit (controlled)"
      value={controlledValue}
      onChange={({ value }) => { controlledValue = value; }}
    >
      <Radio value="apple">Apple</Radio>
      <Radio value="mango">Mango</Radio>
      <Radio value="orange">Orange</Radio>
    </RadioGroup>
    <p style="font-family:sans-serif;font-size:14px">Selected: {controlledValue}</p>
    <div style="display:flex;gap:8px">
      <Button onClick={() => { controlledValue = 'apple'; }} size="small">Select Apple</Button>
      <Button onClick={() => { controlledValue = 'mango'; }} size="small" variant="secondary">Select Mango</Button>
      <Button onClick={() => { controlledValue = 'orange'; }} size="small" variant="tertiary">Select Orange</Button>
    </div>
  </div>
</Story>

<!-- Story 11: Horizontal with Error Text -->
<Story name="Horizontal with Error Text" asChild>
  <RadioGroup
    label="Pick a fruit"
    orientation="horizontal"
    validationState="error"
    errorText="Please select at least one option"
    defaultValue="apple"
  >
    <Radio value="apple">Apple</Radio>
    <Radio value="mango">Mango</Radio>
    <Radio value="orange">Orange</Radio>
  </RadioGroup>
</Story>
