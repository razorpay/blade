<script lang="ts">
  import Button from './components/Button/Button.svelte'
  import Link from './components/Link/Link.svelte'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  
  function handleClick(): void {
    alert('Button clicked!')
  }

  function handleLinkClick(event: MouseEvent): void {
    console.log('Link clicked!', event)
  }
</script>

<main>
  <ThemeSwitcher />
  <div class="component-container">
    <h2>Button Component</h2>
    <Button on:click={handleClick}>
      Click me!
    </Button>

    <h2>Link Component - Anchor Variant</h2>
    <div class="link-examples">
      <Link variant="anchor" href="https://razorpay.com" target="_blank">
        External Link
      </Link>
      <Link variant="anchor" href="/internal" color="primary">
        Primary Link
      </Link>
      <Link variant="anchor" href="#neutral" color="neutral">
        Neutral Link
      </Link>
      <Link variant="anchor" href="#positive" color="positive">
        Positive Link
      </Link>
      <Link variant="anchor" href="#negative" color="negative">
        Negative Link
      </Link>
    </div>

    <h2>Link Component - Button Variant</h2>
    <div class="link-examples">
      <Link variant="button" onClick={handleLinkClick}>
        Button Link
      </Link>
      <Link variant="button" onClick={handleLinkClick} isDisabled={true}>
        Disabled Button Link
      </Link>
      <Link variant="button" onClick={handleLinkClick} color="neutral">
        Neutral Button Link
      </Link>
    </div>

    <h2>Link Component - Sizes</h2>
    <div class="link-examples">
      <Link variant="anchor" href="#xsmall" size="xsmall">XSmall Link</Link>
      <Link variant="anchor" href="#small" size="small">Small Link</Link>
      <Link variant="anchor" href="#medium" size="medium">Medium Link</Link>
      <Link variant="anchor" href="#large" size="large">Large Link</Link>
    </div>
  </div>
</main>

<style>
  main {
    padding: 2rem;
    text-align: center;
    background-color: var(--surface-background-gray-intense);
    min-height: 100%;
  }

  .component-container {
    padding: var(--spacing-4);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    align-items: flex-start;
  }

  h2 {
    margin: 0;
    margin-bottom: var(--spacing-3);
    font-size: var(--font-size-200);
    font-weight: var(--font-weight-semibold);
  }

  .link-examples {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    align-items: flex-start;
  }
</style>
