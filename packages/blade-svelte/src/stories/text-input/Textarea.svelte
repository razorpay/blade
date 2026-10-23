<script lang="ts">
  import { TextArea, type TextAreaStyleProps } from '../../index';

  interface Props {
    args: TextAreaStyleProps & {
      label?: string;
      placeholder?: string;
      helpText?: string;
      isDisabled?: boolean;
      showClearButton?: boolean;
      numberOfLines?: number;
      maxCharacters?: number;
    };
  }

  let { args }: Props = $props();
  let value = $state('Leave it at the door');
</script>

<div class="grid max-w-96 gap-4">
  <TextArea
    bind:value
    numberOfLines={args.numberOfLines ?? 2}
    label={args.label}
    placeholder={args.placeholder}
    helpText={args.helpText || undefined}
    isDisabled={args.isDisabled}
    showClearButton={args.showClearButton}
    size={args.size}
    maxCharacters={args.maxCharacters ?? 100}
  />
</div>
