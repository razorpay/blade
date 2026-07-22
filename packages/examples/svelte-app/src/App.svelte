<script>
  import { Text, Button } from '@razorpay/blade-svelte/components';

  const avatars = [
    { name: 'Divya Sharma' },
    { name: 'Rahul Verma' },
    { name: 'Ananya Iyer' },
  ];

  // Gate the avatar button behind a click so the Avatar chunk is NOT loaded on
  // initial paint. Open the Network tab, load the page (no Avatar-*.js request),
  // then click "Show avatar button" and watch the Avatar chunk fetch on demand.
  let showAvatarButton = $state(false);
</script>

<main>
  <h1>blade-svelte bundle size example</h1>

  <Text>Hello, world!</Text>
  <Button>Click me</Button>

  <Button variant="secondary" onClick={() => (showAvatarButton = true)}>
    Show avatar button
  </Button>

  {#if showAvatarButton}
    <div class="row">
      <Button size="large" {avatars}>Shared with</Button>
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 480px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
