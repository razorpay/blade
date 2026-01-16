<script lang="ts">
  import { onMount } from 'svelte'
  
  let isDarkTheme = false
  
  function toggleTheme(): void {
    isDarkTheme = !isDarkTheme
    if (isDarkTheme) {
      document.body.setAttribute('data-theme', 'dark')
    } else {
      document.body.removeAttribute('data-theme')
    }
  }
  
  onMount(() => {
    // Check if dark theme is already set on mount
    isDarkTheme = document.body.hasAttribute('data-theme') && document.body.getAttribute('data-theme') === 'dark'
  })
</script>

<button on:click={toggleTheme}>
  {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
</button>
