<script lang="ts">
  import { useBreakpoint } from '../breakpointContext';

  const breakpoint = useBreakpoint();
</script>

<span data-testid="breakpoint">{breakpoint.matchedBreakpoint ?? 'none'}</span>
<span data-testid="device">{breakpoint.matchedDeviceType}</span>
