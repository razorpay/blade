<script lang="ts">
  import {
    Icon,
    icons,
    TextInput,
    type TextInputStyleProps,
  } from '../../index';

  interface Props {
    args: TextInputStyleProps & { leading?: string; trailing?: string };
  }

  let { args }: Props = $props();
</script>

<div class="grid max-w-96 gap-4">
  <TextInput
    label="UPI ID"
    placeholder="handle"
    leading={args.leading || undefined}
    trailing={args.trailing || undefined}
  />

  <TextInput label="Search" placeholder="Bank name">
    {#snippet leading()}
      <Icon source={icons.search} />
    {/snippet}
    {#snippet trailing()}
      <span class="text-25 leading-50">⌘K</span>
    {/snippet}
  </TextInput>
</div>
