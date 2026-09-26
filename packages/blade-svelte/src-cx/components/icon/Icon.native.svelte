<script lang="ts">
  import { cx } from '../../cx';
  import { iconUrl } from '../../runes/icon/source';
  import {
    resolveIcon,
    type IconBehaviourProps,
    type IconStyleProps,
  } from './styles';

  // Native draws no inline svg: the glyph travels as an image, and the
  // decoder resolves currentColor from the inherited text colour.
  type Props = IconBehaviourProps & IconStyleProps;

  let {
    source,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveIcon(styleProps));
</script>

<img
  class={cx(classes.root, className)}
  src={iconUrl(source)}
  alt={accessibilityLabel ?? ''}
  data-testid={testID}
/>
