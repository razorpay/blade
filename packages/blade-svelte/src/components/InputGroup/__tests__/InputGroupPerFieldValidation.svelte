<script lang="ts">
  import InputGroup from '../InputGroup.svelte';
  import InputRow from '../InputRow.svelte';
  import TextInput from '../../Input/TextInput/TextInput.svelte';
</script>

<InputGroup label="Card Details" validationState="error" errorText="Fix the highlighted field">
  <InputRow gridTemplateColumns="1fr 1fr">
    <TextInput placeholder="Card Number" accessibilityLabel="Card Number" validationState="error" />
    <TextInput placeholder="CVV" accessibilityLabel="CVV" validationState="none" />
  </InputRow>
</InputGroup>
