<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
</script>

<BladeProvider testID="outer">
  <div class="relative">
    <BladeProvider testID="inner">
      <p>Embedded</p>
    </BladeProvider>
  </div>
</BladeProvider>
