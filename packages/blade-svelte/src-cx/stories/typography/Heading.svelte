<script lang="ts">
  import { Heading, type HeadingStyleProps } from '../../index';

  interface Props {
    args: HeadingStyleProps & { content?: string };
  }

  let { args }: Props = $props();
</script>

<Heading
  as="h3"
  size={args.size}
  weight={args.weight}
  color={args.color}
  textAlign={args.textAlign}
>
  {args.content}
</Heading>
