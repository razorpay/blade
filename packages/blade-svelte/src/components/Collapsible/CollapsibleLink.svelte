<script lang="ts">
  import Link from '../Link/Link.svelte';
  import { makeAnalyticsAttribute, getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { getCollapsibleContext } from './context';
  import CollapsibleChevronIcon from './CollapsibleChevronIcon.svelte';
  import type { CollapsibleLinkProps } from './types';

  let {
    children,
    size,
    color = 'primary',
    isDisabled,
    testID,
    accessibilityLabel,
    ...rest
  }: CollapsibleLinkProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error(
      '[blade-svelte] CollapsibleLink must be used inside a <Collapsible> component.',
    );
  }

  const ctx = $derived(getCtx());
  const isExpanded = $derived(ctx.isExpanded);

  const toggleIsExpanded = () => {
    ctx.onExpandChange(!isExpanded);
  };

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Mirror React's `getStyledProps(rest)` forwarding. Styled props resolve to
  // utility classes (and inline styles for arbitrary values) applied on a thin
  // inline-block wrapper so layout flow is preserved.
  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClass = $derived((styledProps.classes ?? []).filter(Boolean).join(' '));
  const wrapperStyle = $derived(
    ['display: inline-block']
      .concat(
        Object.entries(styledProps.inlineStyles ?? {}).map(
          ([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value}`,
        ),
      )
      .join('; '),
  );
</script>

<span class={wrapperClass} style={wrapperStyle}>
  <Link
    variant="button"
    {size}
    {color}
    icon={CollapsibleChevronIcon}
    iconPosition="right"
    {isDisabled}
    {testID}
    {accessibilityLabel}
    aria-controls={ctx.collapsibleBodyId}
    aria-expanded={isExpanded}
    onClick={toggleIsExpanded}
    {...analyticsAttrs}
  >
    {#if typeof children === 'string'}
      {children}
    {:else if children}
      {@render children()}
    {/if}
  </Link>
</span>
