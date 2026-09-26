<script lang="ts">
  import { cx } from '../../cx';
  import {
    type EmptyStateBehaviourProps,
    resolveEmptyState,
    type EmptyStateStyleProps,
  } from './styles';

  type Props = EmptyStateBehaviourProps & EmptyStateStyleProps;

  let {
    title,
    message,
    media,
    children,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();
</script>

<div
  class={cx(resolveEmptyState(styleProps).root, className)}
  data-testid={testID}
>
  {#if media}
    <div class={resolveEmptyState(styleProps).media} aria-hidden="true">
      {@render media()}
    </div>
  {/if}
  <h2 class={resolveEmptyState(styleProps).title}>{title}</h2>
  {#if message}
    <p class={resolveEmptyState(styleProps).message}>{message}</p>
  {/if}
  {#if children}
    <div class={resolveEmptyState(styleProps).actions}>
      {@render children()}
    </div>
  {/if}
</div>
