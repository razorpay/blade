<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import ToastContainer from '../../components/toast/ToastContainer.svelte';
</script>

<!-- The page's queue: tests show toasts with `showToast`. -->
<BladeProvider testID="host">
  <main data-testid="page">Checkout</main>
  <ToastContainer testID="host-toasts" />
</BladeProvider>
