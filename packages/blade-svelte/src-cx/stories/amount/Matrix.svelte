<script lang="ts">
  import { Amount, Heading, Text } from '../../index';

  const texts = ['xsmall', 'small', 'medium', 'large'] as const;
  const headings = ['small', 'medium', 'large', 'xlarge'] as const;
</script>

<!-- One Amount, sized and coloured by the text around it. -->
<div class="flex flex-col gap-2">
  {#each texts as size (size)}
    <Text {size} weight="semibold">
      <Amount value={4999.5} currency="INR" locale="en-IN" />
      <Amount value={4999.5} currency="INR" locale="en-IN" isAffixSubtle={false} />
    </Text>
  {/each}
  {#each headings as size (size)}
    <Heading {size}>
      <Amount value={4999.5} currency="INR" locale="en-IN" />
      <Amount value={4999.5} currency="INR" locale="en-IN" isAffixSubtle={false} />
    </Heading>
  {/each}
  <Text color="muted">
    <Amount value={129900} currency="INR" unit="minor" locale="en-IN" isStrikethrough />
  </Text>
</div>
