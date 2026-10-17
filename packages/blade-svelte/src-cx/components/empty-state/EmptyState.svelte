<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import Icon from '../icon/Icon.svelte';
  import {
    type EmptyStateBehaviourProps,
    resolveEmptyState,
    type EmptyStateStyleProps,
  } from './styles';

  type Props = EmptyStateBehaviourProps & EmptyStateStyleProps;

  let {
    title,
    icon,
    description,
    asset,
    children,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('EmptyState', () => styleProps);

  const classes = $derived(resolveEmptyState(style.current));
</script>

{#snippet heading()}
  <svelte:element this={classes.headingLevel} class={classes.title}>
    {#if typeof title === 'string'}{title}{:else if title}{@render title()}{/if}
  </svelte:element>
{/snippet}

{#snippet body()}
  <p class={classes.description}>
    {#if typeof description === 'string'}{description}{:else if description}{@render description()}{/if}
  </p>
{/snippet}

<div class={cx(classes.root, className)} data-testid={testID}>
  {#if asset}
    <div class={classes.asset}>
      {@render asset()}
    </div>
  {/if}
  {#if title || description}
    <div class={classes.content}>
      {#if title}
        {#if icon}
          <div class={classes.lead}>
            <Icon source={icon} size={classes.iconSize} />{@render heading()}
          </div>
        {:else}
          {@render heading()}
        {/if}
      {/if}
      {#if description}
        {#if icon && !title}
          <div class={classes.lead}>
            <Icon source={icon} size={classes.iconSize} />{@render body()}
          </div>
        {:else}
          {@render body()}
        {/if}
      {/if}
    </div>
  {/if}
  {@render children?.()}
</div>
