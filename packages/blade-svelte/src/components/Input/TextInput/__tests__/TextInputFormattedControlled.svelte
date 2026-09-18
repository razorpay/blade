<script lang="ts">
  import TextInput from '../TextInput.svelte';

  // Reproduces a controlled card-number parent that sanitises input in its
  // change handler (strips non-digits) and feeds the cleaned value back via
  // `value`. Before the fix, `format` mode ignored `value` after mount, so the
  // stripped letters stayed on screen even though the store held digits only.
  const onlyDigits = (v: string): string => v.replace(/\D/g, '');

  let value: string | undefined = $state(undefined);
</script>

<button type="button" onclick={() => (value = '378282246310005')}>prefill</button>
<button type="button" onclick={() => (value = '')}>reset</button>

<TextInput
  label="Card"
  accessibilityLabel="Card"
  format="#### #### #### ####"
  {value}
  onChange={({ rawValue }) => {
    value = onlyDigits(rawValue ?? '');
  }}
/>
