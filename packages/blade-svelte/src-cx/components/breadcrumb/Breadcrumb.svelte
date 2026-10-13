<script lang="ts">
  import { cx } from '../../cx';
  import { createBreadcrumb, provideBreadcrumb } from '../../runes/breadcrumb/breadcrumb.svelte';
  import { useComponentDefaults } from '../defaults';
  import {
    resolveBreadcrumb,
    type BreadcrumbBehaviourProps,
    type BreadcrumbShared,
    type BreadcrumbStyleProps,
  } from './styles';

  type Props = BreadcrumbBehaviourProps & BreadcrumbStyleProps;

  let {
    children,
    showLastSeparator = false,
    accessibilityLabel = 'Breadcrumb',
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Breadcrumb', () => styleProps);
  const classes = $derived(resolveBreadcrumb(style.current));

  const breadcrumb = createBreadcrumb<BreadcrumbShared>({
    shared: () => ({
      classes,
      emphasis: style.current.emphasis ?? 'subtle',
      showLastSeparator,
    }),
  });
  provideBreadcrumb(breadcrumb);
</script>

<nav class={className} aria-label={accessibilityLabel} data-testid={testID}>
  <ol class={cx(classes.list)}>
    {@render children()}
  </ol>
</nav>
