<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    cx,
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
  import { resolveComponentStyleOverride } from '../../utils/resolveComponentStyleOverride';
  import { getBladeThemeContextGetter } from '../BladeProvider/bladeThemeContext';
  import type { AvatarProps, AvatarImgProps } from './types';

  const templateClasses = getAvatarTemplateClasses();
  const themeContextGetter = getBladeThemeContextGetter();

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
    styleOverride,
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

  const resolvedStyleOverride = $derived(
    resolveComponentStyleOverride('Avatar', styleOverride, themeContextGetter),
  );

  // Group context overrides size and tracks whether this avatar is hidden by `maxCount`.
  const groupProps = getAvatarGroupContext();
  const groupRegistration = groupProps?.register();
  const avatarSize = $derived(groupProps?.size ?? size);
  const isHiddenByGroup = $derived(groupRegistration?.isHidden ?? false);

  const isInteractive = $derived(Boolean(onClick || href));

  // Body (visual avatar box) classes — `styleOverride.root` targets this element
  // so bg/border/radius overrides are clipped by its `overflow: hidden`.
  const bodyClasses = $derived(
    cx(
      getAvatarWrapperClasses({
        size: avatarSize,
        variant,
        isInteractive,
      }),
      resolvedStyleOverride?.root,
    ),
  );

  // Root (non-clipping positioning context) carries layout styled props so the
  // addons, which are siblings of the body, are never clipped.
  const styledProps = $derived(getStyledPropsClasses(rest));
  const rootClasses = $derived(
    cx(templateClasses.avatarRoot, ...(styledProps.classes || [])),
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
  class={rootClasses}
  style:display={isHiddenByGroup ? 'none' : null}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={bodyClasses}>
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
  </div>

  {#if topAddon}
    <div class="{templateClasses.topAddon} {topAddonPositionClass}">
      {@render topAddon()}
    </div>
  {/if}

  {#if BottomAddon}
    <div class="{templateClasses.bottomAddon} {bottomAddonPositionClass}">
      <BottomAddon display="block" size={bottomAddonSize} />
    </div>
  {/if}
</div>
