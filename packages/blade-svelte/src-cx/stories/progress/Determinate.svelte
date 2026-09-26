<script lang="ts">
  import { Button, Progress, Text } from '../../index';

  let spent = $state(300);
  const goal = 1200;
</script>

<div class="flex w-72 flex-col gap-4">
  <Text size="small">{spent} of {goal} points towards free delivery</Text>
  <Progress
    type="bar"
    value={spent}
    max={goal}
    accessibilityLabel="Towards free delivery"
    class="text-feedback-positive-intense"
  />
  <div class="flex items-center gap-3">
    <Progress type="ring" size="large" value={spent} max={goal} />
    <Progress type="ring" size="medium" value={spent} max={goal} />
    <Progress type="ring" size="small" value={spent} max={goal} />
  </div>
  <div class="flex gap-2">
    <Button
      type="button"
      size="small"
      onClick={() => (spent = Math.min(goal, spent + 300))}
    >
      Add 300
    </Button>
    <Button
      type="button"
      size="small"
      variant="secondary"
      onClick={() => (spent = 0)}
    >
      Reset
    </Button>
  </div>
</div>
