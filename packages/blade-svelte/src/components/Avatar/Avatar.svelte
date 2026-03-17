<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getAvatarWrapperClasses,
    getAvatarTemplateClasses,
    getTopAddonClass,
    getBottomAddonClass,
    avatarToBottomAddonSize,
  } from '@razorpay/blade-core/styles';
  import AvatarButton from './AvatarButton.svelte';
  import { UserIcon } from '../Icons/UserIcon';
  import { getAvatarGroupContext } from './avatarContext';
  import type { AvatarProps, AvatarImgProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getAvatarTemplateClasses();

  let {
    name,
    color = 'neutral',
    size = 'medium',
    variant = 'circle',
    icon,
    href,
    target,
    rel,
    isSelected,
    bottomAddon: BottomAddon,
    topAddon,
    // Image props
    src,
    alt,
    srcSet,
    crossOrigin,
    referrerPolicy,
    testID,
    // Interaction props
    onClick,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  }: AvatarProps = $props();

  // Group context overrides size
  const groupProps = getAvatarGroupContext();
  const avatarSize = $derived(groupProps?.size ?? size);

  const isInteractive = $derived(Boolean(onClick || href));

  // Wrapper classes
  const wrapperClasses = $derived(
    getAvatarWrapperClasses({
      size: avatarSize,
      variant,
      isInteractive,
    }),
  );

  // Styled props
  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [wrapperClasses, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  // Meta & analytics attributes
  const metaAttrs = metaAttribute({ name: MetaConstants.Avatar, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Common button props
  const commonButtonProps = $derived({
    variant,
    color,
    size: avatarSize,
    href,
    target,
    rel,
    isSelected,
    onClick,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
  });

  // Compute image props
  const imgProps = $derived.by((): AvatarImgProps | undefined => {
    if (!src) return undefined;
    return {
      src,
      alt: alt ?? name,
      srcSet,
      crossOrigin,
      referrerPolicy,
    };
  });

  // Compute initials from name
  function getInitials(nameStr: string): string {
    const names = nameStr.trim().toUpperCase().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2);
    }
    return names[0][0] + names[names.length - 1][0];
  }

  const initials = $derived(name ? getInitials(name) : undefined);

  // Determine which icon to use (default to UserIcon if no src/name/icon)
  const resolvedIcon = $derived(
    !src && !name ? (icon ?? UserIcon) : icon,
  );

  // Addon positioning classes
  const topAddonPositionClass = $derived(
    getTopAddonClass(variant, avatarSize),
  );
  const bottomAddonPositionClass = $derived(
    getBottomAddonClass(variant),
  );
  const bottomAddonSize = $derived(avatarToBottomAddonSize[avatarSize]);
</script>

<div
  class={combinedClasses}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={templateClasses.addonWrapper}>
    {#if topAddon}
      <div class="{templateClasses.topAddon} {topAddonPositionClass}">
        {@render topAddon()}
      </div>
    {/if}

    {#if src}
      <AvatarButton
        {...commonButtonProps}
        imgProps={imgProps}
      />
    {:else if name && !src}
      <AvatarButton
        {...commonButtonProps}
        children={initials}
      />
    {:else}
      <AvatarButton
        {...commonButtonProps}
        icon={resolvedIcon}
      />
    {/if}

    {#if BottomAddon}
      <div class="{templateClasses.bottomAddon} {bottomAddonPositionClass}">
        <BottomAddon display="block" size={bottomAddonSize} />
      </div>
    {/if}
  </div>
</div>
