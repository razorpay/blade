<script lang="ts">
  import { Button, ProgressBar } from '../../index';

  let spent = $state(300);
  const goal = 1200;
</script>

<div class="flex w-72 flex-col gap-4">
  <ProgressBar
    label="Towards free delivery"
    value={spent}
    max={goal}
    color="positive"
    size="medium"
  />
  <ProgressBar type="meter" label="Points used" value={spent} max={goal} />
  <div class="flex items-start gap-3">
    <ProgressBar variant="circular" size="large" value={spent} max={goal} accessibilityLabel="Large" />
    <ProgressBar variant="circular" size="medium" value={spent} max={goal} accessibilityLabel="Medium" />
    <ProgressBar variant="circular" size="small" value={spent} max={goal} accessibilityLabel="Small" />
  </div>
  <div class="flex gap-2">
    <Button type="button" size="small" onClick={() => (spent = Math.min(goal, spent + 300))}>
      Add 300
    </Button>
    <Button type="button" size="small" variant="secondary" onClick={() => (spent = 0)}>
      Reset
    </Button>
  </div>
</div>
