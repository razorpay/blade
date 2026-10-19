<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { resolveCardBody, type BodyClasses } from './styles';

  // Blade's CardBody: the content between the header and the footer.
  interface Props extends Partial<AnalyticsAttributes> {
    /** The look, in place of Card's. @default resolveCardBody() */
    classes?: BodyClasses;
    testID?: string;
    class?: string;
    children: Snippet;
  }

  let { classes: given, testID, class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(given ?? resolveCardBody());
  const analytics = $derived(analyticsAttributes(rest));
</script>

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  {@render children()}
</div>
