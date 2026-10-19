<script lang="ts">
  import { IconButton, Text } from '../../index';
  import { CopyIcon } from '../../icons';

  let copies = $state(0);

  function copy(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        copies += 1;
        resolve();
      }, 1200);
    });
  }
</script>

<div class="flex items-center gap-2">
  <Text>pay_Q1w2e3r4t5y6u7</Text>
  <IconButton
    icon={CopyIcon}
    accessibilityLabel="Copy payment id"
    loadingAnnouncement="Copying"
    onClick={copy}
  />
  <Text size="small" color="muted">copied {copies}×</Text>
</div>
