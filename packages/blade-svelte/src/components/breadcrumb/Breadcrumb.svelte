<script lang="ts">
  import { createBreadcrumb, provideBreadcrumb } from '../../runes/breadcrumb/breadcrumb.svelte';
  import { analyticsAttributes } from '../../runes/dom/analytics';
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
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('Breadcrumb', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
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

<nav class={className} aria-label={accessibilityLabel} data-testid={testID} {...analytics}>
  <ol class={classes.list}>
    {@render children()}
  </ol>
</nav>
