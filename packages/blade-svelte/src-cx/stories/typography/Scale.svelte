<script lang="ts">
  import { Heading, HEADING_AXES, Text, TEXT_AXES } from '../../index';
</script>

<div class="grid gap-3">
  {#each [...HEADING_AXES.size].reverse() as size (size)}
    <Heading as="h3" {size}>Heading {size}</Heading>
  {/each}
  {#each [...TEXT_AXES.size].reverse() as size (size)}
    <Text {size}>Text {size}</Text>
  {/each}
</div>
