<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getAvatarGroupClasses,
    getAvatarTemplateClasses,
    getAvatarWrapperClasses,
    getAvatarButtonClasses,
  } from '@razorpay/blade-core/styles';
  import { setAvatarGroupContext } from './avatarContext';
  import type { AvatarGroupProps, AvatarGroupRegistration } from './types';

  // Prevent tree-shaking
  const templateClasses = getAvatarTemplateClasses();

  let {
    children,
    size = 'medium',
    maxCount,
    testID,
    ...rest
  }: AvatarGroupProps = $props();

  // Children-driven registry: each Avatar calls `register()` during its setup
  // and gets back a registration whose `isHidden` flag tracks its index vs `maxCount`.
  // We keep a reactive count of mounted Avatars, and assign a stable index per
  // registration via a non-reactive monotonic counter.
  let registeredCount = $state(0);
  let nextIndex = 0;

  function register(): AvatarGroupRegistration {
    const myIndex = nextIndex;
    nextIndex += 1;
    registeredCount += 1;

    $effect(() => {
      return () => {
        registeredCount -= 1;
      };
    });

    return {
      get isHidden() {
        return maxCount !== undefined && myIndex >= maxCount;
      },
    };
  }

  setAvatarGroupContext(() => ({ size, register }));

  // Group classes
  const groupClasses = $derived(getAvatarGroupClasses({ size }));

  // Meta & analytics attributes
  const metaAttrs = metaAttribute({ name: MetaConstants.AvatarGroup, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = makeAccessible({ role: 'group' });

  // Overflow avatar styling
  const overflowWrapperClasses = $derived(
    getAvatarWrapperClasses({ size, variant: 'circle', isInteractive: false }),
  );
  const overflowBtnClasses = $derived(
    getAvatarButtonClasses({
      size,
      variant: 'circle',
      color: 'neutral',
      isInteractive: false,
      isSelected: false,
    }),
  );

  const overflowCount = $derived(
    maxCount !== undefined && registeredCount > maxCount ? registeredCount - maxCount : 0,
  );
  const showOverflow = $derived(overflowCount > 0);
</script>

<div class={groupClasses} {...metaAttrs} {...analyticsAttrs} {...a11yAttrs}>
  {@render children()}
  {#if showOverflow}
    <div class={overflowWrapperClasses}>
      <div class={overflowBtnClasses}>
        <div class={templateClasses.btnContent}>
          +{overflowCount}
        </div>
      </div>
    </div>
  {/if}
</div>
