<script>
  import { Button, TextInput, Alert, Badge } from '@razorpay/blade-svelte/components';
</script>

<main>
  <h1>blade-svelte bundle size example</h1>

  <Alert
    description="This app imports a few real Blade components so `dist/stats.html` shows a real bundle breakdown."
    color="information"
    isFullWidth
  />

  <TextInput label="Name" placeholder="Enter your name" />

  <div class="row">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Badge color="positive">Active</Badge>
  </div>
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
