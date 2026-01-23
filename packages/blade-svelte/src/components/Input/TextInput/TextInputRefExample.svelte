<script lang="ts">
  import TextInput from './TextInput.svelte';
  import Button from '../../Button/BaseButton/BaseButton.svelte';

  // Reference to TextInput component
  let textInputRef: TextInput | undefined = $state();

  function handleFocus() {
    textInputRef?.focus();
  }

  function handleBlur() {
    textInputRef?.blur();
  }

  function handleClear() {
    textInputRef?.clear();
  }
</script>

<div style="display: flex; flex-direction: column; gap: 16px;">
  <TextInput
    bind:this={textInputRef}
    label="First Name"
    placeholder="Enter your name"
    defaultValue="John Ives"
    name="fullName"
  />

  <div style="display: flex; gap: 8px;">
    <Button variant="secondary" size="medium" onClick={handleFocus}>
      Focus Input
    </Button>
    <Button variant="secondary" size="medium" onClick={handleBlur}>
      Blur Input
    </Button>
    <Button variant="secondary" size="medium" onClick={handleClear}>
      Clear Input
    </Button>
  </div>

  <p style="color: var(--surface-text-gray-muted); font-size: 14px;">
    Click the buttons above to programmatically control the input using refs.
  </p>
</div>

