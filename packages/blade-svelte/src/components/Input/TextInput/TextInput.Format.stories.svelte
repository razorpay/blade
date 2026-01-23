<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextInput from './TextInput.svelte';
  import CardNumberFormatExample from './CardNumberFormatExample.svelte';
  import DateFormatExample from './DateFormatExample.svelte';
  import CustomFormatExample from './CustomFormatExample.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/TextInput/Format',
    component: TextInput,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: 'TextInput with format support for different input patterns like credit card numbers, phone numbers etc.',
        },
      },
    },
  });
</script>

<!-- Format Controlled - Card Number with real-time updates -->
<Story name="Format Controlled" asChild>
  {#snippet children()}
    <CardNumberFormatExample />
  {/snippet}
</Story>

<!-- Format Uncontrolled - Date Format with validation -->
<Story name="Format Uncontrolled" asChild>
  {#snippet children()}
    <DateFormatExample />
  {/snippet}
</Story>

<!-- Custom Format - Interactive pattern customization -->
<Story name="Custom Format" asChild>
  {#snippet children()}
    <CustomFormatExample />
  {/snippet}
</Story>

<!-- Format Patterns - Multiple format patterns showcase -->
<Story name="Format Patterns" asChild>
  <div class="display-flex flex-col gap-y-spacing-4">
    <TextInput
      label="Aadhaar Number"
      placeholder="Enter Aadhaar"
      format="#### #### ####"
      helpText="Format: XXXX XXXX XXXX"
    />
    
    <TextInput
      label="Time (24-hour)"
      placeholder="Enter time"
      format="##:##:##"
      helpText="Format: HH:MM:SS"
    />
    
    <TextInput
      label="Postal Code"
      placeholder="Enter postal code"
      format="### ###"
      helpText="Format: XXX XXX"
    />
    
    <TextInput
      label="PAN Number"
      placeholder="Enter PAN"
      format="##### #### #"
      helpText="Format: XXXXX XXXX X"
    />
    
    <TextInput
      label="IP Address"
      placeholder="Enter IP address"
      format="###.###.###.###"
      helpText="Format: XXX.XXX.XXX.XXX"
    />
    
    <TextInput
      label="License Plate"
      placeholder="Enter license plate"
      format="## ## ####"
      helpText="Format: AB 12 CDEF"
    />
    
    <TextInput
      label="GST Number"
      placeholder="Enter GST"
      format="## #### #### #### #"
      helpText="Format: XX XXXX XXXX XXXX X"
    />
  </div>
</Story>
