<script lang="ts">
  import { getBreakpoint } from '../breakpointContext';

  const breakpoint = getBreakpoint();
</script>

<span data-testid="breakpoint">{breakpoint.matchedBreakpoint ?? 'none'}</span>
<span data-testid="device">{breakpoint.matchedDeviceType}</span>
