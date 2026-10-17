<script lang="ts">
  import { Countdown, Text, type CountdownStyleProps } from '../../index';

  interface Props {
    args: CountdownStyleProps & {
      seconds?: number;
      urgentBelow?: number;
      isPaused?: boolean;
    };
  }

  let { args }: Props = $props();

  let log = $state('running');
</script>

<div class="flex flex-col items-start gap-3">
  <Countdown
    variant={args.variant}
    seconds={args.seconds ?? 20}
    urgentBelow={args.urgentBelow}
    isPaused={args.isPaused}
    accessibilityLabel="Session expires in"
    onElapsed={() => (log = 'elapsed')}
  />
  <Text size="small">
    Resend the code in
    <Countdown seconds={args.seconds ?? 20} isPaused={args.isPaused}>
      {#snippet children({ remaining })}{remaining}s{/snippet}
    </Countdown>
  </Text>
  <Text size="small" color="muted">{log}</Text>
</div>
