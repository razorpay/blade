<script lang="ts">
  import Button from './components/Button/Button.svelte'
  
  function handleClick(): void {
    alert('Button clicked!')
  }
</script>

<main>
  <h1>Blade Svelte Demo</h1>
  <Button on:click={handleClick}>
    Click me!
  </Button>
</main>

<style>
  main {
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    color: #333;
    margin-bottom: 2rem;
  }
</style>
