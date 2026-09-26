<script lang="ts">
  import { Button, type ButtonStyleProps } from '../../index';

  interface Props {
    args: ButtonStyleProps & {
      isLoading?: boolean;
      isDisabled?: boolean;
      label?: string;
    };
  }

  let { args }: Props = $props();

  let presses = $state(0);
</script>

<div class="grid max-w-96 gap-4">
  <Button
    variant={args.variant}
    color={args.color}
    size={args.size}
    isLoading={args.isLoading}
    isDisabled={args.isDisabled}
    loadingAnnouncement="Please wait"
    class="w-full"
    onClick={() => {
      presses += 1;
    }}
  >
    {args.label}
  </Button>
  <p class="text-75 leading-50 text-surface-gray-subtle">Pressed {presses} times.</p>
</div>
