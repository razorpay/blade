<script lang="ts">
  import { cx } from '../../cx';
  import { UserIcon } from '../../icons';
  import { createAvatar, getAvatarGroup, initialsOf } from '../../runes/avatar/group.svelte';
  import { useComponentDefaults } from '../defaults';
  import Icon from '../icon/Icon.svelte';
  import {
    resolveAvatar,
    type AvatarBehaviourProps,
    type AvatarGroupShared,
    type AvatarStyleProps,
  } from './styles';

  type Props = AvatarBehaviourProps & AvatarStyleProps;

  let {
    name,
    src,
    alt,
    srcSet,
    crossOrigin,
    referrerPolicy,
    icon,
    onClick,
    href,
    target,
    rel,
    topAddon,
    bottomAddon,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const group = getAvatarGroup<AvatarGroupShared>();
  const avatar = createAvatar(group, { src: () => src });

  const style = useComponentDefaults('Avatar', () => styleProps);
  // In a group the group's size wins, as in Blade.
  const classes = $derived(
    resolveAvatar({ ...style.current, size: group?.shared.size ?? style.current.size })
  );
  const initials = $derived(name ? initialsOf(name) : '');
  const label = $derived(alt ?? name);
</script>

{#snippet face()}
  {#if avatar.showsImage}
    <img
      class={classes.image}
      {src}
      srcset={srcSet}
      alt={label ?? ''}
      crossorigin={crossOrigin}
      referrerpolicy={referrerPolicy}
      onerror={avatar.handleImageError}
    />
  {:else if initials}
    <span class={classes.initials} aria-hidden={label ? 'true' : undefined}>{initials}</span>
  {:else}
    <Icon source={icon ?? UserIcon} size={classes.iconSize} />
  {/if}
{/snippet}

<span
  class={cx(classes.root, avatar.isOverlapping && group?.shared.overlap, avatar.isHidden && 'hidden', className)}
  data-testid={testID}
  hidden={avatar.isHidden || undefined}
  {@attach avatar.attach}
>
  {#if href}
    <a
      class={cx(classes.face, classes.interactive)}
      {href}
      {target}
      {rel}
      aria-label={avatar.showsImage ? undefined : label}
      onclick={onClick}
    >
      {@render face()}
    </a>
  {:else if onClick}
    <button
      type="button"
      class={cx(classes.face, classes.interactive)}
      aria-label={avatar.showsImage ? undefined : label}
      onclick={onClick}
    >
      {@render face()}
    </button>
  {:else}
    <!-- Not interactive: an image, named by `name` (or `alt`). -->
    <span class={classes.face} role="img" aria-label={label}>
      {@render face()}
    </span>
  {/if}
  {#if topAddon}
    <span class={classes.topAddon}>{@render topAddon()}</span>
  {/if}
  {#if bottomAddon}
    <span class={classes.bottomAddon}>{@render bottomAddon()}</span>
  {/if}
</span>
