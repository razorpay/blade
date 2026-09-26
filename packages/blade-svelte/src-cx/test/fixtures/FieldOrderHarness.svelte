<script lang="ts">
  import { provideAdapters } from '../../adapters';
  import Form from '../../components/form/Form.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';

  interface Props {
    showFirst?: boolean;
    onReveal: (name: string) => void;
  }

  let { showFirst = false, onReveal }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ revealField: (_handle, name) => onReveal(name) });
</script>

<Form>
  {#if showFirst}
    <TextInput name="email" label="Email" isRequired testID="email" />
  {/if}
  <TextInput name="phone" label="Phone" isRequired testID="phone" />
  <button type="submit" data-testid="submit">Pay</button>
</Form>
