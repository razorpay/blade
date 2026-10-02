<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import {
    type EmptyStateBehaviourProps,
    resolveEmptyState,
    type EmptyStateStyleProps,
  } from './styles';

  type Props = EmptyStateBehaviourProps & EmptyStateStyleProps;

  let {
    title,
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

<div class={cx(classes.root, className)} data-testid={testID}>
  {#if asset}
    <div class={classes.asset}>
      {@render asset()}
    </div>
  {/if}
  {#if title || description}
    <div class={classes.content}>
      {#if title}
        <svelte:element this={classes.headingLevel} class={classes.title}>
          {#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
        </svelte:element>
      {/if}
      {#if description}
        <p class={classes.description}>
          {#if typeof description === 'string'}{description}{:else}{@render description()}{/if}
        </p>
      {/if}
    </div>
  {/if}
  {@render children?.()}
</div>
