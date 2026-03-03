<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextInput from './TextInput.svelte';
  import Text from '../../Typography/Text/Text.svelte'
  import Link from '../../Link/Link.svelte';
  import { InfoIcon, SearchIcon, CheckIcon, CreditCardIcon } from '../../Icons';
  import ControlledTextInputExample from './ControlledTextInputExample.svelte';
  import TextInputRefExample from './TextInputRefExample.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/TextInput',
    component: TextInput,
    tags: ['autodocs'],
    args: {
      label: 'Label',
      placeholder: 'Enter text',
      size: 'medium',
      validationState: 'none',
      necessityIndicator: 'none',
      labelPosition: 'top',
      isDisabled: false,
    },
    argTypes: {
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large'],
      },
      type: {
        control: 'select',
        options: ['text', 'email', 'telephone', 'url', 'number', 'search'],
      },
      validationState: {
        control: 'select',
        options: ['none', 'error', 'success'],
      },
      necessityIndicator: {
        control: 'select',
        options: ['none', 'required', 'optional'],
      },
      labelPosition: {
        control: 'select',
        options: ['top', 'left'],
      },
      textAlign: {
        control: 'select',
        options: ['left', 'center', 'right'],
      },
    },
  });
</script>

<!-- Playground story - auto-renders with args -->
<Story name="Playground" />


<Story name="Text Input with type Number" args={{ label: 'Enter Number', type: 'number', placeholder: '42' }} />

<Story name="Text Input with help text" args={{ 
  label: 'Email Address', 
  placeholder: 'Enter your email',
  helpText: "We'll never share your email"
}} />

<!-- Validation States -->
<Story name="Text Input with error" args={{
  label: 'Enter Name',
  placeholder: 'Enter first name',
  validationState: 'error',
  errorText: 'name is not valid'
}} />

<Story name="Text Input with Success" args={{
  label: 'Enter Name',
  placeholder: 'Enter first name',
  validationState: 'success',
  successText: 'Name validated'
}} />

<Story name="Text Input without label" args={{ 
  placeholder: 'Enter your email',
  label: ''
}} />

<!-- Trailing Button -->
<Story name="Text Input with Trailing Button" asChild>
  {#snippet children()}
    {#snippet applyButton()}
      <Link variant="button" size="medium">Apply</Link>
    {/snippet}
    <TextInput
      label="Discount Code"
      placeholder="Enter discount code"
      defaultValue="SAVE20"
      showClearButton={false}
      trailingButton={applyButton}
    />
  {/snippet}
</Story>

<!-- Character Counter -->
<Story name="Text Input with Max Characters" args={{
  label: 'Enter Name',
  placeholder: 'Enter first name',
  maxCharacters: 10,
  defaultValue: "John",
}} />

<Story name="Text Input with Sizes" asChild>
  <div class="display-flex flex-col gap-y-spacing-4">
    <div>
      <Text size="large">Size Xsmall</Text>
      <TextInput
        label="Enter name"
        placeholder="Enter first name"
        size="xsmall"
      />
    </div>
    <div>
      <Text size="large">Size small</Text>
      <TextInput
        label="Enter name"
        placeholder="Enter first name"
        size="small"
      />
    </div>
    <div>
      <Text size="large">Size medium</Text>
      <TextInput
        label="Enter name"
        placeholder="Enter first name"
        size="medium"
      />
    </div>
    <div>
      <Text size="large">Size large</Text>
      <TextInput
        label="Enter name"
        placeholder="Enter first name"
        size="large"
      />
    </div>
  </div>
</Story>



<!-- Disabled State -->
<Story name="Text Input with Disabled state" args={{
  label: 'Enter name',
  placeholder: "Enter name",
  isDisabled: true,
  helpText: 'This input is disabled'
}} />

<!-- Ref Example (using bind:this to access component methods) -->
<Story name="TextInput with Ref" asChild>
  {#snippet children()}
    <TextInputRefExample />
  {/snippet}
</Story>

<!-- Prefix & Suffix -->
<Story name="TextInput with Prefix" args={{
  label: 'Website',
  placeholder: 'example.com',
  prefix: 'https://'
}} />

<Story name="TextInput with Suffix" args={{
  label: 'Price',
  placeholder: '100',
  suffix: '.00'
}} />

<Story name="TextInput with Prefix and Suffix" args={{
  label: 'Domain',
  placeholder: 'mysite',
  prefix: 'https://',
  suffix: '.com'
}} />

<!-- Clear Button -->
<Story name="TextInput with Clear Button" args={{
  label: 'Search with Clear',
  placeholder: 'Type something to see clear button',
  showClearButton: true,
  defaultValue: 'Clear me!'
}} />

<!-- Label Suffix & Trailing -->
<Story name="Text Input with Label Suffix & Trailing" asChild>
  {#snippet children()}
    {#snippet labelSuffixContent()}
      <InfoIcon size="small" color="surface.icon.gray.muted" />
    {/snippet}
    {#snippet labelTrailingContent()}
      <Link size="small">Learn more</Link>
    {/snippet}
    <TextInput
      label="Enter GSTIN"
      placeholder="Enter GSTIN"
      labelSuffix={labelSuffixContent}
      labelTrailing={labelTrailingContent}
    />
  {/snippet}
</Story>


<!-- Leading & Trailing Icons -->
<Story name="TextInput with Leading Icon" asChild>
  {#snippet children()}
    <TextInput
      label="Search"
      placeholder="Search..."
      leadingIcon={SearchIcon}
    />
  {/snippet}
</Story>

<Story name="TextInput with Trailing Icon" asChild>
  {#snippet children()}
    <TextInput
      label="Card Number"
      placeholder="Enter card number"
      trailingIcon={CreditCardIcon}
    />
  {/snippet}
</Story>


<!-- Input Formatting - See TextInput/Format stories for more examples -->


