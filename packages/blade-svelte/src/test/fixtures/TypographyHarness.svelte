<script lang="ts">
  import { Heading } from '../../components/heading';
  import { Text } from '../../components/text';
</script>

<Heading as="h1" size="large" textAlign="center" testID="heading"
  >Card details</Heading
>
<Text testID="plain">Plain</Text>
<Text color="white" testID="on-dark">On dark</Text>
<Text color="subtle" testID="subtle">Subtle</Text>
<Text
  as="span"
  size="small"
  weight="medium"
  color="muted"
  class="clamp-2 mt-2"
  testID="styled"
>
  Styled
</Text>
<Text truncateAfterLines={3} data-analytics-name="note" testID="clamped">Clamped</Text>
<Text color="negative" testID="negative">Failed</Text>
<Heading color="primary" data-analytics-name="title" testID="tracked-heading">Tracked</Heading>
