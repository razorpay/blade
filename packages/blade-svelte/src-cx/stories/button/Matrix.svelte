<script lang="ts">
  import { BUTTON_AXES, Button, type ButtonStyleProps } from '../../index';

  interface Props {
    args: {
      color?: ButtonStyleProps['color'];
      isLoading?: boolean;
      isDisabled?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<table class="[border-collapse:separate] [border-spacing:0.75rem] text-75 leading-50">
  <thead>
    <tr>
      <th class="text-left font-medium text-surface-gray-subtle">variant \ size</th>
      {#each BUTTON_AXES.size as size (size)}
        <th class="text-left font-medium text-surface-gray-subtle">{size}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each BUTTON_AXES.variant as variant (variant)}
      <tr>
        <th class="text-left font-medium text-surface-gray-subtle">{variant}</th>
        {#each BUTTON_AXES.size as size (size)}
          <td>
            <Button
              {variant}
              {size}
              color={args.color}
              isLoading={args.isLoading}
              isDisabled={args.isDisabled}
              loadingAnnouncement="Please wait"
              class="w-40"
            >
              Pay now
            </Button>
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
