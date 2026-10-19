<script lang="ts">
  import { BUTTON_AXES, Button, type ButtonStyleProps } from '../../index';
  import { ArrowRightIcon, CloseIcon, WalletIcon } from '../../icons';

  interface Props {
    args: ButtonStyleProps & {
      isLoading?: boolean;
      isDisabled?: boolean;
      label?: string;
      withIcon?: boolean;
      withTrailingIcon?: boolean;
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
    icon={args.withIcon ? WalletIcon : undefined}
    trailingIcon={args.withTrailingIcon ? ArrowRightIcon : undefined}
    class="w-full"
    onClick={() => {
      presses += 1;
    }}
  >
    {args.label}
  </Button>
  <p class="text-75 leading-50 text-surface-gray-subtle">Pressed {presses} times.</p>
  <!-- Icon only: a square of each size's height. -->
  <div class="flex items-center gap-2">
    {#each BUTTON_AXES.size as size (size)}
      <Button variant={args.variant} color={args.color} {size} icon={CloseIcon} accessibilityLabel="Close" />
    {/each}
  </div>
</div>
