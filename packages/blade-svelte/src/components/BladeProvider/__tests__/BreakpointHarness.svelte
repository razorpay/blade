<script lang="ts">
  import { bladeTheme } from '@razorpay/blade-core/tokens';
  import BladeProvider from '../BladeProvider.svelte';
  import BreakpointConsumer from './BreakpointConsumer.svelte';
</script>

<BladeProvider themeTokens={bladeTheme}>
  <BreakpointConsumer />
</BladeProvider>
