<script lang="ts">
  import {
    Code,
    CODE_AXES,
    Display,
    DISPLAY_AXES,
    Heading,
    HEADING_AXES,
    Text,
    TEXT_AXES,
  } from '../../index';
</script>

<div class="grid gap-3">
  {#each [...DISPLAY_AXES.size].reverse() as size (size)}
    <Display as="span" {size}>Display {size}</Display>
  {/each}
  {#each [...HEADING_AXES.size].reverse() as size (size)}
    <Heading as="h3" {size}>Heading {size}</Heading>
  {/each}
  {#each [...TEXT_AXES.size].reverse() as size (size)}
    <Text {size}>Text {size}</Text>
  {/each}
  {#each [...CODE_AXES.size].reverse() as size (size)}
    <Text>Code {size}: <Code {size}>RAZORPAY_KEY_ID</Code></Text>
  {/each}
</div>
