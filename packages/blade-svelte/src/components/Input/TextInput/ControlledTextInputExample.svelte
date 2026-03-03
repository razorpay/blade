<script lang="ts">
  import TextInput from './TextInput.svelte';

  let inputValue = $state('');
</script>

<TextInput
  label="First Name"
  placeholder="Enter your first and last name"
  bind:value={inputValue}
  name="fullName"
  onChange={({ name, value }) => {
    console.log(`sending ${name}:${value} to analytics service`);
  }}
/>

