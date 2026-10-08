<script lang="ts">
  import { Icon, Link, TextInput, Tooltip } from '../../index';
  import { InfoIcon } from '../../icons';
</script>

<div class="grid max-w-96 gap-4">
  <TextInput label="Enter GSTIN" placeholder="22AAAAA0000A1Z5" necessityIndicator="required">
    {#snippet labelRow({ label })}
      {@render label()}
      <Tooltip content="Your 15-character GST number">
        <button
          type="button"
          class="flex border-none bg-transparent p-0"
          aria-label="About GSTIN"
        >
          <Icon source={InfoIcon} size="small" color="muted" />
        </button>
      </Tooltip>
      <Link href="#gstin" size="small" class="ms-auto">Learn more</Link>
    {/snippet}
  </TextInput>
</div>
