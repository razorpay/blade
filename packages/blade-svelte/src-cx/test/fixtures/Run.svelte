<script lang="ts" generics="T">
  // Runs a rune during component init, so it may read context and register
  // lifetimes, and hands back what it returned.
  interface Props {
    setup: () => T;
    onReady: (value: T) => void;
  }

  let { setup, onReady }: Props = $props();

  onReady(setup());
</script>
