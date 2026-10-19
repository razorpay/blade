<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import {
    type DotLoaderBehaviourProps,
    resolveDotLoader,
    type DotLoaderStyleProps,
  } from './styles';

  type Props = DotLoaderBehaviourProps & DotLoaderStyleProps;

  let { accessibilityLabel, testID, class: className = '', ...rest }: Props = $props();

  const style = useComponentDefaults('DotLoader', () => rest);
  const analytics = $derived(analyticsAttributes(rest));

  const classes = $derived(resolveDotLoader(style.current));
</script>

<span
  class={cx(classes.root, className)}
  role={accessibilityLabel ? 'status' : undefined}
  aria-label={accessibilityLabel}
  aria-hidden={accessibilityLabel ? undefined : 'true'}
  data-testid={testID}
  {...analytics}
>
  {#each classes.dots as dot, index (index)}
    <span class={dot}></span>
  {/each}
</span>
