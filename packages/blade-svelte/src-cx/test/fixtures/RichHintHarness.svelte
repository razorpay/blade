<script lang="ts">
  import TextInput from '../../components/text-input/TextInput.svelte';
</script>

<TextInput label="GSTIN" necessityIndicator="required" testID="gstin">
  {#snippet helpText()}
    Forgot it? <a href="#reset" data-testid="reset">Find your GSTIN</a>
  {/snippet}
</TextInput>
