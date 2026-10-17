<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import {
    type ProgressBehaviourProps,
    resolveProgress,
    type ProgressStyleProps,
  } from './styles';

  type Props = ProgressBehaviourProps & ProgressStyleProps;

  let {
    value = 0,
    min = 0,
    max = 100,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Progress', () => styleProps);
</script>

{#if resolveProgress(style.current).fill}
  <span
    class={cx(resolveProgress(style.current).root, className)}
    role="progressbar"
    aria-label={accessibilityLabel}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={Math.min(max, Math.max(min, value))}
    style:--progress={max > min
      ? (Math.min(max, Math.max(min, value)) - min) / (max - min)
      : 0}
    data-testid={testID}
  >
    {#if resolveProgress(style.current).fill?.kind === 'ring'}
      <svg viewBox="0 0 36 36" class="w-full h-full" aria-hidden="true">
        <circle
          class={resolveProgress(style.current).fill?.track}
          cx="18"
          cy="18"
          r={resolveProgress(style.current).ring?.r}
          stroke-width={resolveProgress(style.current).ring?.stroke}
        />
        <circle
          class={resolveProgress(style.current).fill?.value}
          cx="18"
          cy="18"
          r={resolveProgress(style.current).ring?.r}
          stroke-width={resolveProgress(style.current).ring?.stroke}
          pathLength="1"
          stroke-dasharray="1"
        />
      </svg>
    {:else}
      <span class={resolveProgress(style.current).fill?.value}></span>
    {/if}
  </span>
{:else}
  <span
    class={cx(resolveProgress(style.current).root, className)}
    role={accessibilityLabel ? 'status' : undefined}
    aria-label={accessibilityLabel}
    aria-hidden={accessibilityLabel ? undefined : 'true'}
    data-testid={testID}
  >
    {#each resolveProgress(style.current).dots as dot, i (i)}
      <span class={dot}></span>
    {/each}
  </span>
{/if}
