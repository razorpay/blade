<script lang="ts">
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants, getTokenCSSVariable, type AriaRoles } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import Avatar from '../../Avatar/Avatar.svelte';
  import AvatarGroup from '../../Avatar/AvatarGroup.svelte';
  import type { BaseButtonProps } from './types';
  import type { TextColors } from '../../Typography/BaseText/types';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import {
    getButtonClasses,
    getButtonTemplateClasses,
    getButtonTextColorToken,
    getButtonProgressRestColorToken,
    getButtonTextSizes,
    getButtonIconSize,
    getButtonIconOnlySize,
    type ActionStatesType as ButtonActionStatesType,
  } from '@razorpay/blade-core/styles';
  import type { IconColor } from '../../Icons/types';

  // Get template classes via function call to prevent Svelte tree-shaking
  const buttonClasses = getButtonTemplateClasses();

  let {
    children,
    icon: Icon,
    iconPosition = 'left',
    variant = 'primary',
    color = 'primary',
    size = 'medium',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    loadingType = 'indefinite',
    loadingTimer,
    onLoadingComplete,
    avatars,
    href,
    target,
    rel,
    type = 'button',
    id,
    tabIndex,
    accessibilityProps,
    testID,
    onClick,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
    ...rest
  }: BaseButtonProps = $props();

  // Validation - check if we have either icon or children
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const hasChildren = children !== undefined && children !== null;
      const hasText = typeof children === 'string' ? children.trim().length > 0 : hasChildren;
      if (!Icon && !hasText) {
        console.error('BaseButton: At least one of icon or text is required to render a button.');
      }
    }
  });

  const isLink = $derived(Boolean(href));
  const isButton = $derived(!isLink);

  // Whether the current props describe an active definite-loading configuration.
  const isDefiniteLoadingConfigured = $derived(
    loadingType === 'definite' && typeof loadingTimer === 'number' && loadingTimer > 0,
  );

  // Monotonic run counter. It increments every time the button *re-enters* a
  // definite loading configuration (transition from not-configured → configured)
  // after the first one. This lets a consumer re-trigger the loader with the
  // *same* `loadingTimer` value — e.g. toggle definite off and on again — because
  // the run identity changes even when the duration does not. The first configured
  // state (whether on mount or later) keeps run = 0 so it never causes a spurious
  // re-key; only genuine re-entries bump it.
  let definiteLoadingRun = $state(0);
  let prevDefiniteLoadingConfigured = false;
  let hasBeenConfiguredBefore = false;
  $effect(() => {
    if (isDefiniteLoadingConfigured && !prevDefiniteLoadingConfigured) {
      if (hasBeenConfiguredBefore) {
        definiteLoadingRun += 1;
      }
      hasBeenConfiguredBefore = true;
    }
    prevDefiniteLoadingConfigured = isDefiniteLoadingConfigured;
  });

  // Identifies the current definite-loading "run" by its inputs *and* the run
  // counter. When the inputs change (e.g. a new `loadingTimer`) or the loader is
  // re-triggered with the same duration, this key changes and the loader runs again.
  const definiteLoadingKey = $derived(
    isDefiniteLoadingConfigured ? `${loadingType}:${loadingTimer}:${definiteLoadingRun}` : null,
  );

  // The run key that finished animating to 100%. Set on animation end; compared
  // against `definiteLoadingKey` so completion only applies to the run that ended.
  let completedDefiniteLoadingKey = $state<string | null>(null);

  // Loading states:
  // - indefinite: 3-dot loader, driven by isLoading, replaces all content
  // - definite: left-to-right progress overlay (loadingTimer), content stays visible
  //   until the fill reaches 100%, after which the button returns to normal.
  const isIndefiniteLoading = $derived(loadingType === 'indefinite' && isLoading);
  const isDefiniteLoading = $derived(
    definiteLoadingKey !== null && definiteLoadingKey !== completedDefiniteLoadingKey,
  );
  const isAnyLoading = $derived(isIndefiniteLoading || isDefiniteLoading);

  // Button cannot be disabled when its rendered as Link
  const disabled = $derived(isAnyLoading || (isDisabled && isButton));

  // Create interaction state using $state
  let currentInteraction = $state<ButtonActionStatesType>('default');

  // Pressed state for animation
  let isPressed = $state(false);

  // Use interaction hook for managing interaction states
  const {
    onMouseEnter: handleMouseEnterInteraction,
    onMouseLeave: handleMouseLeaveInteraction,
    onFocus: handleFocusInteraction,
    onBlur: handleBlurInteraction,
  } = useInteraction(
    () => currentInteraction,
    (state: ButtonActionStatesType) => {
      currentInteraction = state;
    },
  );

  // Update interaction state when disabled prop changes
  $effect(() => {
    if (disabled) {
      currentInteraction = 'disabled';
    } else if (currentInteraction === 'disabled') {
      currentInteraction = 'default';
    }
  });

  // Get children as string for text rendering
  const childrenString = $derived(
    typeof children === 'string' ? children : undefined,
  );

  // Check if children has any content (string or Snippet)
  const hasChildren = $derived(
    (typeof children === 'string' && children.trim().length > 0) ||
    (typeof children === 'function')  // Snippet is a function
  );

  // Check if icon-only button
  const isIconOnly = $derived(
    Boolean(Icon) && !hasChildren,
  );

  // Get text sizes
  const textSizes = getButtonTextSizes();

  // During definite loading the button base is in its normal color and a
  // rest/disabled-colored cover recedes over it. The text/icon stay in the
  // *normal* color the whole run so they remain consistent and readable over
  // both the receding rest region and the revealed normal base.
  const contentColorState = $derived<ButtonActionStatesType>(
    isDefiniteLoading ? 'default' : currentInteraction,
  );

  // Compute text color token reactively
  const textColorToken = $derived.by((): TextColors => {
    return getButtonTextColorToken({
      variant,
      color,
      state: contentColorState,
      property: 'text',
    }) as TextColors;
  });

  // Compute icon color token reactively
  const iconColorToken = $derived.by((): IconColor => {
    return getButtonTextColorToken({
      variant,
      color,
      state: contentColorState,
      property: 'icon',
    }) as IconColor;
  });

  // Get icon size maps
  const buttonIconSizeMap = getButtonIconSize();
  const buttonIconOnlySizeMap = getButtonIconOnlySize();

  // Compute icon size based on button size and whether it's icon-only
  const iconSize = $derived(
    isIconOnly ? buttonIconOnlySizeMap[size] : buttonIconSizeMap[size]
  );

  // Get text sizes
  const fontSize = $derived(textSizes.fontSize[size]);
  const lineHeight = $derived(textSizes.lineHeight[size]);

  // Indefinite (3-dot) loader color. While loading the button is disabled, which
  // would otherwise resolve the icon token to its muted/disabled color and wash the
  // dots out, so we always resolve against the NORMAL state.
  //
  // Primary keeps the primary brand color (the blue accent), while every other
  // variant follows its standard icon color token (e.g. secondary → gray/black).
  const dotsColorToken = $derived.by((): IconColor => {
    if (variant === 'primary' && color === 'primary') {
      return 'interactive.icon.primary.normal' as IconColor;
    }
    return getButtonTextColorToken({
      variant,
      color,
      state: 'default',
      property: 'icon',
    }) as IconColor;
  });
  const dotsColorCSSVar = $derived(getTokenCSSVariable(dotsColorToken));

  // Definite loader color (inverted-layer model):
  // The base button stays its *normal* (default) color; only the receding cover
  // needs a color — the button's disabled/"rest" background — which shrinks away
  // to reveal the normal base beneath.
  const progressRestColorCSSVar = $derived(
    getTokenCSSVariable(getButtonProgressRestColorToken({ variant, color })),
  );

  // Avatars render only after the text and only on large buttons; they stay visible
  // during definite loading but are hidden during indefinite loading (all content is replaced).
  const shouldShowAvatars = $derived(
    Boolean(avatars && avatars.length > 0) && size === 'large' && !isIndefiniteLoading,
  );

  // Generate button props reactively
  const buttonProps = $derived.by(() => {
    return {
      // Element props
      as: isLink ? 'a' : 'button',
      elementTag: isLink ? 'a' : 'button',
      elementType: isButton ? type : undefined,
      disabled: isButton && disabled,
      role: isLink ? 'link' : 'button',
      defaultRel: target && target === '_blank' ? 'noreferrer noopener' : undefined,
    };
  });

  // Destructure buttonProps for easier access
  const {
    elementTag,
    elementType,
    disabled: isButtonDisabled,
    role: buttonRole,
    defaultRel,
  } = $derived(buttonProps);

  // Generate BaseButton classes from blade-core
  const baseButtonClasses = $derived(
    getButtonClasses({
      variant,
      color,
      size,
      isDisabled: isButtonDisabled,
      isFullWidth,
      isIconOnly,
    }),
  );

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes for button element.
  // Only the indefinite loader hides content (`loading` class); the definite overlay
  // keeps text/icon/avatars visible.
  const combinedClasses = $derived(() => {
    const classes = [
      baseButtonClasses,
      isIndefiniteLoading ? buttonClasses.loading : '',
      isDefiniteLoading ? buttonClasses.definiteLoading : '',
      'focus-ring-parent',
    ];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Animated content wrapper classes (for scale animation)
  const animatedContentClasses = $derived(() => {
    const classes = [
      buttonClasses.animatedContent,
      isPressed ? buttonClasses.pressed : '',
    ];
    return classes.filter(Boolean).join(' ');
  });

  // Accessibility attributes. The element stays a `button` (or `link`) and we expose
  // `aria-busy` while loading rather than switching to a progressbar role.
  const accessibilityAttrs = $derived(
    makeAccessible({
      role: (accessibilityProps?.role ?? buttonRole) as AriaRoles,
      disabled: isButtonDisabled,
      busy: isAnyLoading || undefined,
      label: accessibilityProps?.label,
      describedBy: accessibilityProps?.describedBy,
      controls: accessibilityProps?.controls,
      expanded: accessibilityProps?.expanded,
      hasPopup: accessibilityProps?.hasPopup,
    }),
  );

  // Polite live-region announcement when loading starts/stops (parity with React Button).
  // Covers both loaders: indefinite (driven by `isLoading`) and definite (driven by
  // `isDefiniteLoading`, which starts on trigger and ends when the fill completes).
  // The previous value is tracked via a plain (non-reactive) ref that is only ever
  // read/written inside the effect, so it stays in sync with the latest loading state.
  let loadingAnnouncement = $state('');
  let prevAnyLoading: boolean | undefined;
  $effect(() => {
    const loading = isAnyLoading;
    if (prevAnyLoading !== undefined) {
      if (loading && !prevAnyLoading) {
        loadingAnnouncement = 'Started loading';
      } else if (!loading && prevAnyLoading) {
        loadingAnnouncement = 'Stopped loading';
      }
    }
    prevAnyLoading = loading;
  });

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Button,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Once the definite progress fill reaches 100%, mark this run complete so the
  // button exits the loading state and becomes interactive, then notify the consumer.
  function handleProgressAnimationEnd(): void {
    completedDefiniteLoadingKey = definiteLoadingKey;
    onLoadingComplete?.();
  }

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (onClick && !isButtonDisabled) {
      onClick(event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (!isButtonDisabled) {
      handleFocusInteraction();
    }
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent): void {
    if (!isButtonDisabled) {
      handleBlurInteraction();
    }
    onBlur?.(event);
  }

  function handleMouseEnter(): void {
    if (!isButtonDisabled) {
      handleMouseEnterInteraction();
    }
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (!isButtonDisabled) {
      handleMouseLeaveInteraction();
    }
    onMouseLeave?.(event);
  }

  function handleMouseDown(event: MouseEvent): void {
    if (!isButtonDisabled) {
      isPressed = true;
    }
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent): void {
    if (!isButtonDisabled) {
      isPressed = false;
    }
    onMouseUp?.(event);
  }

  function handlePointerDown(event: PointerEvent): void {
    if (!isButtonDisabled) {
      isPressed = true;
    }
    onPointerDown?.(event);
  }

  function handleTouchStart(event: TouchEvent): void {
    if (!isButtonDisabled) {
      isPressed = true;
    }
    onTouchStart?.(event);
  }

  function handleTouchEnd(event: TouchEvent): void {
    if (!isButtonDisabled) {
      isPressed = false;
    }
    onTouchEnd?.(event);
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isButtonDisabled) {
      if (event.key === ' ' || event.key === 'Enter') {
        isPressed = true;
      }
    }
    onKeyDown?.(event);
  }

  function handleKeyUp(event: KeyboardEvent): void {
    if (!isButtonDisabled) {
      if (event.key === ' ' || event.key === 'Enter') {
        isPressed = false;
      }
    }
  }
</script>

<svelte:element
  this={elementTag}
  class={combinedClasses()}
  style:--btn-progress-rest-color={isDefiniteLoading ? progressRestColorCSSVar : undefined}
  data-definite-loading={isDefiniteLoading ? 'true' : undefined}
  {id}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
  onclick={handleClick}
  onfocus={handleFocus}
  onblur={handleBlur}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onmousemove={onMouseMove}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onpointerdown={handlePointerDown}
  onpointerenter={onPointerEnter}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
  type={elementType}
  disabled={isButtonDisabled || undefined}
  href={isLink ? href : undefined}
  target={isLink ? target : undefined}
  rel={isLink ? (rel ?? defaultRel) : undefined}
  {tabIndex}
>
  {#if isDefiniteLoading}
    <span class={buttonClasses.progressOverlay} aria-hidden="true">
      {#key definiteLoadingKey}
        <span
          class={buttonClasses.progressFill}
          style:--btn-progress-duration={`${loadingTimer}ms`}
          onanimationend={handleProgressAnimationEnd}
        ></span>
      {/key}
    </span>
  {/if}
  <div class={animatedContentClasses()}>
    {#if isIndefiniteLoading}
      <span class={buttonClasses.dotsLoader} style:--btn-dots-color={dotsColorCSSVar}></span>
    {/if}
    <span class={buttonClasses.content + (isIndefiniteLoading ? ' ' + buttonClasses.loading : '') + ' focus-ring-child'}>
      {#if Icon && iconPosition === 'left'}
        <span class={buttonClasses.icon}>
          <Icon size={iconSize} color={iconColorToken} />
        </span>
      {/if}
      {#if childrenString}
        <BaseText
          as="span"
          color={textColorToken}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontFamily="text"
          fontWeight="medium"
          textAlign="center"
          marginX="spacing.2"
          componentName={MetaConstants.Button}
        >
          {childrenString}
        </BaseText>
      {:else if children && typeof children === 'function'}
        <BaseText
          as="span"
          color={textColorToken}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontFamily="text"
          fontWeight="medium"
          textAlign="center"
          marginX="spacing.2"
          componentName={MetaConstants.Button}
        >
          {@render children()}
        </BaseText>
      {/if}
      {#if Icon && iconPosition === 'right'}
        <span class={buttonClasses.icon}>
          <Icon size={iconSize} color={iconColorToken} />
        </span>
      {/if}
      {#if shouldShowAvatars && avatars}
        <span class={buttonClasses.avatarGroup}>
          <AvatarGroup size="xsmall">
            <!-- Key prefers a stable identity (src/name); the index fallback is a
                 defensive guard and is effectively unreachable since ButtonAvatar
                 requires at least one of `src` or `name`. -->
            {#each avatars as avatar, index (avatar.src ?? avatar.name ?? index)}
              <Avatar name={avatar.name} src={avatar.src} alt={avatar.alt} />
            {/each}
          </AvatarGroup>
        </span>
      {/if}
    </span>
  </div>
  {#if loadingAnnouncement}
    <span class={buttonClasses.liveRegion} aria-live="polite" aria-atomic="true">
      {loadingAnnouncement}
    </span>
  {/if}
</svelte:element>
