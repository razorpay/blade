<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { isGlyph } from '../../runes/icon/source';
  import {
    resolveIcon,
    type IconBehaviourProps,
    type IconStyleProps,
  } from './styles';

  type Props = IconBehaviourProps & IconStyleProps;

  let {
    source,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Icon', () => styleProps);

  const classes = $derived(resolveIcon(style.current));
  // Without a font plugin the icon is its SVG's URL, drawn as a mask.
  const mask = $derived(isGlyph(source) ? undefined : `url(${JSON.stringify(source)})`);
</script>

<!-- A glyph is one private-use character of the blade-icons font; a URL is a
     mask over the text colour. -->
<span
  class={cx(classes.root, mask && classes.mask, className)}
  style:mask-image={mask}
  style:-webkit-mask-image={mask}
  role={accessibilityLabel ? 'img' : undefined}
  aria-label={accessibilityLabel}
  aria-hidden={accessibilityLabel ? undefined : 'true'}
  data-icon={isGlyph(source) ? source.name : undefined}
  data-testid={testID}>{isGlyph(source) ? source.code : ''}</span>
