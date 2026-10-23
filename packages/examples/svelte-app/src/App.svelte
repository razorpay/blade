<script lang="ts">
  import {
    BladeProvider,
    Button,
    Heading,
    Link,
    Text,
    ToastContainer,
    showToast,
  } from '@razorpay/blade-svelte/components';
  import Contact from './Contact.svelte';
  import PaymentMethods from './PaymentMethods.svelte';
  import Summary from './Summary.svelte';

  // A merchant's brand reaches Blade through its token variables: the
  // standard theme is the fallback, so only what branding changes is set.
  const BRANDS = {
    blade: undefined,
    plum: 'hsla(285, 60%, 42%, 1)',
  } as const;
  let brand = $state<keyof typeof BRANDS>('blade');

  let method = $state<string | null>('upi');

  // The confirmation loads on demand: its chunk (Modal and its parts) is
  // fetched on the first Pay, not on page load. Watch the Network tab.
  let confirm = $state<typeof import('./Confirm.svelte').default>();
  let isConfirming = $state(false);
  async function pay(): Promise<void> {
    confirm ??= (await import('./Confirm.svelte')).default;
    isConfirming = true;
  }

  function paid(): void {
    isConfirming = false;
    void showToast({ content: 'Payment successful', color: 'positive' });
  }
</script>

<div
  class="relative min-h-screen bg-surface-gray-subtle"
  style:--interactive-background-primary-default={BRANDS[brand]}
>
  <BladeProvider>
    <main class="mx-auto flex max-w-[480px] flex-col gap-6 px-4 py-8">
      <header class="flex items-center justify-between">
        <Heading size="medium">Checkout</Heading>
        <Link variant="button" onClick={() => (brand = brand === 'blade' ? 'plum' : 'blade')}>
          {brand === 'blade' ? 'Try a brand colour' : 'Back to Blade blue'}
        </Link>
      </header>

      <Summary />
      <Contact />
      <PaymentMethods bind:value={method} />

      <Button class="w-full" size="large" isDisabled={!method} onClick={pay}>Pay ₹1,299</Button>
      <Text size="small" color="muted" class="text-center">Secured by Razorpay</Text>
    </main>

    {#if confirm}
      {@const Confirm = confirm}
      <Confirm bind:isOpen={isConfirming} {method} onPaid={paid} />
    {/if}

    <!-- Rendered once: it shows what showToast asks for. -->
    <ToastContainer />
  </BladeProvider>
</div>
