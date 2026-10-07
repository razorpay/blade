<script lang="ts">
  import { ChevronRightIcon } from '../../icons';
  import { createBreadcrumbItem, getBreadcrumb } from '../../runes/breadcrumb/breadcrumb.svelte';
  import Icon from '../icon/Icon.svelte';
  import Link from '../link/Link.svelte';
  import { resolveBreadcrumb, type BreadcrumbItemProps, type BreadcrumbShared } from './styles';

  let {
    href,
    onClick,
    isCurrentPage = false,
    children,
    icon,
    accessibilityLabel,
    testID,
  }: BreadcrumbItemProps = $props();

  const breadcrumb = getBreadcrumb<BreadcrumbShared>();
  const item = createBreadcrumbItem(breadcrumb);
  const classes = $derived(breadcrumb?.shared.classes ?? resolveBreadcrumb());
  const isIntense = $derived(breadcrumb?.shared.emphasis === 'intense');
  const hasSeparator = $derived(!item.isLast || Boolean(breadcrumb?.shared.showLastSeparator));
</script>

{#snippet label()}
  {#if icon}<Icon source={icon} size={classes.iconSize} />{/if}
  {@render children?.()}
{/snippet}

<li class={classes.item} aria-current={isCurrentPage ? 'page' : undefined} {@attach item.attach}>
  {#if isCurrentPage}
    <!-- The current page: not a link. -->
    <span class={classes.current} aria-label={children ? undefined : accessibilityLabel} data-testid={testID}>
      {@render label()}
    </span>
  {:else if isIntense}
    <a
      class={classes.pill}
      {href}
      aria-label={children ? undefined : accessibilityLabel}
      onclick={onClick}
      data-testid={testID}
    >
      {@render label()}
    </a>
  {:else}
    <Link
      {href}
      {icon}
      {accessibilityLabel}
      onClick={onClick ? (event: MouseEvent) => onClick(event) : undefined}
      color={classes.link.color}
      size={classes.link.size}
      class={classes.link.class}
      {testID}
    >
      {#if children}{@render children()}{/if}
    </Link>
  {/if}
  {#if hasSeparator}
    <span class={classes.separator} aria-hidden="true">
      {#if isIntense}<Icon source={ChevronRightIcon} size="medium" />{:else}/{/if}
    </span>
  {/if}
</li>
