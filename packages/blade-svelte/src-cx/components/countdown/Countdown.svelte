<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { CountdownState } from '../../runes/base/countdown.svelte';
  import { createCountdown } from '../../runes/countdown/countdown.svelte';
  import { resolveCountdown, type CountdownStyleProps } from './styles';

  type Props = CountdownStyleProps & {
    /** How long to count; a new number starts over. */
    seconds: number;
    /** Holds the clock; the time left is kept. */
    isPaused?: boolean;
    /** At or under this many seconds the urgent look applies. */
    urgentBelow?: number;
    /** Fires once, at zero. */
    onElapsed?: () => void;
    /** Names the timer: "Session expires in". */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** Replaces the `mm:ss` figure. */
    children?: Snippet<[CountdownState]>;
  };

  let {
    seconds,
    isPaused = false,
    urgentBelow = 0,
    onElapsed,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Countdown', () => styleProps);

  const classes = $derived(resolveCountdown(style.current));

  const countdown = createCountdown({
    seconds: () => seconds,
    isPaused: () => isPaused,
    onElapsed: () => onElapsed?.(),
  });
  const current = $derived(countdown.current);

  const pad = (part: number) => String(part).padStart(2, '0');
  const minutes = $derived(Math.floor(current.remaining / 60));
  const rest = $derived(current.remaining % 60);
  const isUrgent = $derived(current.remaining <= urgentBelow);
</script>

<!-- A timer is not live: a screen reader asked for it reads the time left. -->
<time
  class={cx(
    classes.root,
    classes.tone[isUrgent ? 'urgent' : 'calm'],
    className
  )}
  role="timer"
  aria-label={accessibilityLabel}
  datetime={`PT${current.remaining}S`}
  data-testid={testID}
>
  {#if children}
    {@render children(current)}
  {:else}
    {pad(minutes)}:{pad(rest)}
  {/if}
</time>
