<script lang="ts">
  import { Avatar, AVATAR_AXES } from '../../index';
  import { BuildingIcon } from '../../icons';
  import trustBadge from '../../components/trust-badge/razorpay-trust.svg';
</script>

{#snippet indicator()}
  <span class="h-full w-full rounded-max bg-interactive-positive-default"></span>
{/snippet}
{#snippet trusted()}
  <img src={trustBadge} alt="" class="h-full w-full" />
{/snippet}

<div class="grid gap-6">
  {#each AVATAR_AXES.variant as variant (variant)}
    <div class="flex flex-wrap items-center gap-4">
      {#each AVATAR_AXES.size as size (size)}
        <Avatar name="Dev Shah" {size} {variant} topAddon={indicator} bottomAddon={trusted} />
      {/each}
    </div>
  {/each}
  <div class="flex flex-wrap items-center gap-4">
    {#each AVATAR_AXES.color as color (color)}
      <Avatar name={color} {color} />
    {/each}
  </div>
  <div class="flex flex-wrap items-center gap-4">
    <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" />
    <Avatar name="Nitin Kumar" />
    <Avatar />
    <Avatar variant="square" icon={BuildingIcon} color="information" alt="Business" />
    <Avatar name="Selected" isSelected onClick={() => undefined} />
  </div>
</div>
