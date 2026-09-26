<script lang="ts">
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
</script>

{#if resolveProgress(styleProps).fill}
  <span
    class={cx(resolveProgress(styleProps).root, className)}
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
    {#if resolveProgress(styleProps).fill?.kind === 'ring'}
      <svg viewBox="0 0 36 36" class="w-full h-full" aria-hidden="true">
        <circle
          class={resolveProgress(styleProps).fill?.track}
          cx="18"
          cy="18"
          r="16"
          stroke-width="4"
        />
        <circle
          class={resolveProgress(styleProps).fill?.value}
          cx="18"
          cy="18"
          r="16"
          stroke-width="4"
          pathLength="1"
          stroke-dasharray="1"
        />
      </svg>
    {:else}
      <span class={resolveProgress(styleProps).fill?.value}></span>
    {/if}
  </span>
{:else}
  <span
    class={cx(resolveProgress(styleProps).root, className)}
    role={accessibilityLabel ? 'status' : undefined}
    aria-label={accessibilityLabel}
    aria-hidden={accessibilityLabel ? undefined : 'true'}
    data-testid={testID}
  >
    {#each resolveProgress(styleProps).dots as dot, i (i)}
      <span class={dot}></span>
    {/each}
  </span>
{/if}
