<script lang="ts">
  import TextInput from '../TextInput.svelte';

  // Reproduces a controlled parent that supplies `value` only *after* the input
  // has mounted (e.g. an async data load). Before the fix, `BaseInput` froze
  // its controlled/uncontrolled detection at mount time, so a later `value`
  // was ignored and the input stayed uncontrolled.
  let value: string | undefined = $state(undefined);

  $effect(() => {
    // Supply the value right after the input mounts, mimicking a late fetch.
    value = '1234';
  });
</script>

<TextInput
  label="Card"
  accessibilityLabel="Card"
  {value}
  onChange={({ value: v }) => {
    value = v ?? '';
  }}
/>