<script lang="ts">
  import { back, getLayers, type Layers } from '../../runes/layer/layers';

  // Hands a test the layers of the provider around it, and back.
  interface Props {
    onReady: (layers: Layers, back: () => boolean) => void;
  }

  let { onReady }: Props = $props();
  // svelte-ignore state_referenced_locally
  onReady(getLayers(), back);
</script>
