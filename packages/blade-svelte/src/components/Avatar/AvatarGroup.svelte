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
  import type { AvatarGroupProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getAvatarTemplateClasses();

  let {
    children,
    size = 'medium',
    maxCount,
    testID,
    ...rest
  }: AvatarGroupProps = $props();

  // Set context for child Avatars (reactive getter pattern)
  setAvatarGroupContext(() => ({ size }));

  // Group classes
  const groupClasses = $derived(
    getAvatarGroupClasses({ size }),
  );

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

  // DOM-based maxCount management
  let groupEl: HTMLDivElement | undefined = $state(undefined);
  let overflowCount = $state(0);
  let showOverflow = $state(false);

  $effect(() => {
    if (!groupEl || !maxCount) {
      showOverflow = false;
      overflowCount = 0;
      return;
    }

    // Get direct children (Avatar wrappers)
    const childElements = Array.from(groupEl.children).filter(
      (el) => !el.hasAttribute('data-avatar-overflow'),
    );
    const totalChildren = childElements.length;

    if (maxCount >= totalChildren) {
      // No overflow needed
      showOverflow = false;
      overflowCount = 0;
      childElements.forEach((el) => {
        (el as HTMLElement).style.display = '';
      });
      return;
    }

    // Hide children beyond maxCount
    childElements.forEach((el, index) => {
      if (index >= maxCount) {
        (el as HTMLElement).style.display = 'none';
      } else {
        (el as HTMLElement).style.display = '';
      }
    });

    overflowCount = totalChildren - maxCount;
    showOverflow = true;
  });
</script>

<div
  bind:this={groupEl}
  class={groupClasses}
  {...metaAttrs}
  {...analyticsAttrs}
  {...a11yAttrs}
>
  {@render children()}
  {#if showOverflow && overflowCount > 0}
    <div class={overflowWrapperClasses} data-avatar-overflow>
      <div class={overflowBtnClasses}>
        <div class={templateClasses.btnContent}>
          +{overflowCount}
        </div>
      </div>
    </div>
  {/if}
</div>
