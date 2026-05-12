<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { dropdownHeaderClass, getDropdownTemplateClasses } from '@razorpay/blade-core/styles';
  import { getDropdownContext } from './dropdownContext';
  import type { DropdownHeaderProps } from './types';

  // Reference template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getDropdownTemplateClasses();

  let {
    title,
    subtitle,
    leading,
    trailing,
    titleSuffix,
    children,
    testID,
  }: DropdownHeaderProps = $props();

  const getCtx = getDropdownContext();
  const ctx = $derived(getCtx());

  function handleMouseDown(e: MouseEvent): void {
    // We don't want focus to ever move on header because it's a static element
    // except when autocomplete is present
    if (!ctx.hasAutoCompleteInHeader) {
      e.preventDefault();
    } else {
      ctx.setShouldIgnoreBlurAnimation(false);
    }
  }

  const metaAttrs = metaAttribute({ name: MetaConstants.DropdownHeader, testID });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={dropdownHeaderClass}
  onmousedown={handleMouseDown}
  {...metaAttrs}
>
  {#if leading || title || subtitle || titleSuffix || trailing}
    <div class="blade-dropdown-header__content">
      {#if leading}
        <div class="blade-dropdown-header__leading">
          {@render leading()}
        </div>
      {/if}
      <div class="blade-dropdown-header__main">
        {#if title}
          <div class="blade-dropdown-header__title-row">
            <span class="blade-dropdown-header__title">{title}</span>
            {#if titleSuffix}
              <span class="blade-dropdown-header__title-suffix">
                {@render titleSuffix()}
              </span>
            {/if}
          </div>
        {/if}
        {#if subtitle}
          <p class="blade-dropdown-header__subtitle">{subtitle}</p>
        {/if}
      </div>
      {#if trailing}
        <div class="blade-dropdown-header__trailing">
          {@render trailing()}
        </div>
      {/if}
    </div>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</div>
