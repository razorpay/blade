<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  
  const { Story } = defineMeta({
    title: 'Typography/Text',
  });
</script>

<script>
  import Text from './Text.svelte';
</script>

<Story name="Text">
  <Text as="p" variant="body" size="medium" weight="regular" truncateAfterLines={2}>
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.
  </Text>
</Story>

<Story name="Text with Color">
  <Text as="p" variant="body" size="medium" weight="regular" color="surface.text.primary.normal" truncateAfterLines={2}>
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
  </Text>
</Story>

<Story name="Nested Text (As Prop)">
  <Text as="p" variant="body" size="medium" weight="regular" color="surface.text.gray.normal">
    Power your <Text as="span" color="surface.text.primary.normal" size="medium" variant="body" weight="semibold">finance</Text>, grow your <Text as="span" size="medium" variant="body" weight="semibold">business</Text>
  </Text>
</Story>