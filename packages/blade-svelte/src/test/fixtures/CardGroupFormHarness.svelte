<script lang="ts">
  import type { FormAdapter } from '../../runes/form/types';
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import CardGroupHarness from './CardGroupHarness.svelte';

  // CardGroupHarness under an app's form.
  let { form }: { form: FormAdapter } = $props();
</script>

<BladeProvider adapters={{ form }}>
  <CardGroupHarness name="bank" />
</BladeProvider>
