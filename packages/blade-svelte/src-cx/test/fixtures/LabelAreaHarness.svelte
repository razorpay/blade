<script lang="ts">
  import TextInput from '../../components/text-input/TextInput.svelte';
  import CounterInput from '../../components/counter-input/CounterInput.svelte';
  import InputGroup from '../../components/input-group/InputGroup.svelte';
</script>

<TextInput label="GSTIN" necessityIndicator="required" testID="gstin">
  {#snippet labelArea({ label })}
    {@render label()}
    <button type="button" aria-label="About GSTIN">i</button>
    <a href="#learn" class="ms-auto">Learn more</a>
  {/snippet}
  {#snippet helpText()}
    Forgot it? <a href="#reset" data-testid="reset">Find your GSTIN</a>
  {/snippet}
</TextInput>

<CounterInput label="Guests" testID="guests">
  {#snippet labelArea({ label })}
    {@render label()}
    <span data-testid="guests-extra">max 4</span>
  {/snippet}
</CounterInput>

<InputGroup label="Card" testID="card">
  {#snippet labelArea({ label })}
    {@render label()}
    <span data-testid="card-extra">Secure</span>
  {/snippet}
  <TextInput label="Number" testID="number" />
</InputGroup>
