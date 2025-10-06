<script lang="ts">
  import Button from './components/Button/Button.svelte'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  
  function handleClick(): void {
    alert('Button clicked!')
  }
</script>

<main>
  <ThemeSwitcher />
  <div class="component-container">
    <Button on:click={handleClick}>
      Click me!
    </Button>
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
  }
</style>
