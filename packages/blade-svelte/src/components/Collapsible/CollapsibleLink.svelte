<script lang="ts">
  import BaseLink from '../Link/BaseLink/BaseLink.svelte';
  import { makeAnalyticsAttribute, getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { getCollapsibleTemplateClasses } from '@razorpay/blade-core/styles';
  import { getCollapsibleContext } from './context';
  import CollapsibleChevronIcon from './CollapsibleChevronIcon.svelte';
  import { getStyledProps } from '../../utils/getStyledProps';
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
  // utility classes; arbitrary values are fed as --collapsible-link-* custom
  // properties (built via getStyledProps) consumed by the linkWrapper class in
  // collapsible.module.css, applied on a thin inline-block wrapper so layout
  // flow is preserved.
  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClass = $derived(
    [
      getCollapsibleTemplateClasses().linkWrapper,
      ...(styledProps.classes ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );
  const { collapsibleLinkStyles } = $derived(
    getStyledProps('collapsibleLink', styledProps.inlineStyles ?? {}),
  );
</script>

<span class={wrapperClass} style={collapsibleLinkStyles}>
  <BaseLink
    variant="button"
    {size}
    {color}
    icon={CollapsibleChevronIcon}
    iconPosition="right"
    {isDisabled}
    {testID}
    accessibilityProps={{
      label: accessibilityLabel,
      controls: ctx.collapsibleBodyId,
      expanded: isExpanded,
    }}
    onClick={toggleIsExpanded}
    {...analyticsAttrs}
  >
    {#if typeof children === 'string'}
      {children}
    {:else if children}
      {@render children()}
    {/if}
  </BaseLink>
</span>
