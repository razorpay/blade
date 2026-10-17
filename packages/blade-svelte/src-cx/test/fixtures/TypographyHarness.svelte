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
  truncate="2"
  class="mt-2"
  testID="styled"
>
  Styled
</Text>
