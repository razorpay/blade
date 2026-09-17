<script lang="ts">
  import { useTheme } from './components/BladeProvider';

  const theme = $derived(useTheme());

  function toggleTheme(): void {
    theme.setColorScheme(theme.colorScheme === 'dark' ? 'light' : 'dark');
  }
</script>

<button type="button" onclick={toggleTheme}>
  {theme.colorScheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
</button>
