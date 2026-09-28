<script lang="ts">
  import { Button, Text, type ButtonStyleProps } from '../../index';

  interface Props {
    args: ButtonStyleProps;
  }

  let { args }: Props = $props();

  let round = $state(0);
  let log = $state('waiting');
</script>

<div class="flex w-64 flex-col gap-3">
  {#key round}
    <Button
      variant={args.variant}
      type="button"
      autoPressAfter={5}
      class="w-full"
      onClick={() => (log = `pressed in round ${round + 1}`)}
    >
      Continue to bank
    </Button>
  {/key}
  <Text size="small" color="muted">{log}</Text>
  <Button
    variant="tertiary"
    type="button"
    onClick={() => {
      round += 1;
      log = 'waiting';
    }}
  >
    Start over
  </Button>
</div>
