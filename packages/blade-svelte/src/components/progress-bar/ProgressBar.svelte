<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { getProgressBarValue } from '../../runes/progress-bar/progress-bar';
  import Text from '../text/Text.svelte';
  import {
    type ProgressBarBehaviourProps,
    resolveProgressBar,
    type ProgressBarStyleProps,
  } from './styles';

  type Props = ProgressBarBehaviourProps & ProgressBarStyleProps;

  let {
    label,
    accessibilityLabel,
    value = 0,
    min = 0,
    max = 100,
    type = 'progress',
    isIndeterminate = false,
    showPercentage = true,
    testID,
    class: className = '',
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('ProgressBar', () => rest);
  const analytics = $derived(analyticsAttributes(rest));

  const isCircular = $derived(style.current.variant === 'circular');
  const size = $derived(style.current.size ?? 'small');
  // Blade draws a circular bar determinate whatever `isIndeterminate` says.
  const indeterminate = $derived(isIndeterminate && !isCircular);
  const progress = $derived(
    getProgressBarValue({ value, min, max, type, isIndeterminate: indeterminate }),
  );
  const hasLabel = $derived(Boolean(label?.trim()));
  const classes = $derived(
    resolveProgressBar(style.current, {
      type,
      isIndeterminate: indeterminate,
      percent: progress.percent,
      hasLabel,
    }),
  );
  const percentShown = $derived(showPercentage && type !== 'meter' && !indeterminate);
</script>

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  {#if isCircular}
    {@const ring = classes.ring}
    <svg
      width={ring.box}
      height={ring.box}
      viewBox="0 0 {ring.box} {ring.box}"
      role={progress.role}
      aria-label={accessibilityLabel ?? label}
      aria-valuenow={progress.valueNow}
      aria-valuetext={progress.valueText}
      aria-valuemin={progress.valueMin}
      aria-valuemax={progress.valueMax}
      style:--progress={progress.percent}
    >
      <circle
        class={classes.ringTrack}
        cx={ring.box / 2}
        cy={ring.box / 2}
        r={ring.radius}
        stroke-width={ring.stroke}
      />
      <!-- The arc starts at 12 o'clock. -->
      <circle
        class={classes.ringFill}
        cx={ring.box / 2}
        cy={ring.box / 2}
        r={ring.radius}
        stroke-width={ring.stroke}
        transform="rotate(-90 {ring.box / 2} {ring.box / 2})"
        pathLength="100"
        stroke-dasharray="100"
      />
      {#if percentShown && size !== 'small'}
        <text class={classes.ringPercent} x="50%" y="50%" text-anchor="middle" dy=".4em"
          >{progress.percent}%</text
        >
      {/if}
    </svg>
    {#if hasLabel}
      <Text size="small" class={classes.caption}>{label}</Text>
    {/if}
    {#if percentShown && size === 'small'}
      <Text size="small" weight="semibold" class={hasLabel ? '' : classes.caption}>
        {progress.percent}%
      </Text>
    {/if}
  {:else}
    {#if hasLabel || percentShown}
      <div class={classes.header}>
        {#if hasLabel}<Text as="span" size="small" color="subtle">{label}</Text>{/if}
        {#if percentShown}
          <div class={classes.percentBox}>
            <Text as="span" size="small" color="subtle">{progress.percent}%</Text>
          </div>
        {/if}
      </div>
    {/if}
    <div
      class={classes.track}
      role={progress.role}
      aria-label={accessibilityLabel ?? label}
      aria-valuenow={progress.valueNow}
      aria-valuetext={progress.valueText}
      aria-valuemin={progress.valueMin}
      aria-valuemax={progress.valueMax}
      style:--progress={progress.percent}
    >
      <div class={classes.fill}>
        {#if classes.pulse}<div class={classes.pulse}></div>{/if}
      </div>
    </div>
  {/if}
</div>
