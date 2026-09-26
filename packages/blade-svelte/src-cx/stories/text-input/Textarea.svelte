<script lang="ts">
  import { TextAreaInput } from '../../index';

  interface Props {
    args: { label?: string; placeholder?: string; isDisabled?: boolean };
  }

  let { args }: Props = $props();
</script>

<div class="grid max-w-96 gap-4">
  <TextAreaInput
    numberOfLines={3}
    label={args.label}
    placeholder={args.placeholder}
    isDisabled={args.isDisabled}
    maxCharacters={200}
  />
</div>
