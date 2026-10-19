<script lang="ts">
  import { getAdapters } from '../../adapters';

  const adapters = getAdapters();
</script>

<button type="button" data-testid="probe" onclick={() => adapters.track?.('probe')}>probe</button>
