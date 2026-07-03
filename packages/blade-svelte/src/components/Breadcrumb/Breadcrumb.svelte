<script lang="ts">
  import { setContext } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getBreadcrumbTemplateClasses,
    breadcrumbNavClass,
    breadcrumbListClass,
    showLastSeparatorClass,
  } from '@razorpay/blade-core/styles';
  import type { BreadcrumbProps, BreadcrumbContextValue } from './types';
  import { BREADCRUMB_CONTEXT_KEY } from './constants';

  // Prevent tree-shaking of CSS classes used only in templates
  void getBreadcrumbTemplateClasses();

  let {
    children,
    size = 'medium',
    color = 'primary',
    showLastSeparator = false,
    accessibilityLabel = 'Breadcrumb',
    testID,
    ...rest
  }: BreadcrumbProps = $props();

  // Provide context using getter function for reactivity
  setContext(BREADCRUMB_CONTEXT_KEY, (): BreadcrumbContextValue => ({
    size,
    color,
  }));

  // Meta attributes
  const metaAttrs = metaAttribute({ name: MetaConstants.Breadcrumb, testID });

  // Accessibility attributes for the <ol>
  const a11yAttrs = $derived(makeAccessible({ label: accessibilityLabel }));

  // Analytics attributes
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Styled props
  const styledProps = $derived(getStyledPropsClasses(rest));
  const navClasses = $derived(
    [breadcrumbNavClass, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  // List classes - include showLastSeparator class when needed
  const listClasses = $derived(
    [breadcrumbListClass, showLastSeparator ? showLastSeparatorClass : '']
      .filter(Boolean)
      .join(' '),
  );
</script>

<nav
  class={navClasses}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <ol
    class={listClasses}
    {...a11yAttrs}
  >
    {@render children()}
  </ol>
</nav>
