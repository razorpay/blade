<script lang="ts">
  import { getDividerClasses } from '@razorpay/blade-core/styles';
  import { metaAttribute, MetaConstants, getStyledPropsClasses, cx } from '@razorpay/blade-core/utils';
  import { resolveComponentStyleOverride } from '../../utils/resolveComponentStyleOverride';
  import { getBladeThemeContextGetter } from '../BladeProvider/bladeThemeContext';
  import type { DividerProps } from './types';

  const themeContextGetter = getBladeThemeContextGetter();

  let {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    testID,
    class: className,
    styleOverride,
    ...rest
  }: DividerProps = $props();

  const resolvedStyleOverride = $derived(
    resolveComponentStyleOverride('Divider', styleOverride, themeContextGetter),
  );

  // Extract styled props classes
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Generate classes using CVA
  const dividerClass = $derived(() => {
    const classes = [
      getDividerClasses({
        orientation,
        dividerStyle,
        variant,
        thickness,
        className,
      }),
    ];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return cx(...classes.filter(Boolean), resolvedStyleOverride?.root);
  });

  // Build meta attributes for testing
  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Divider, testID }));
</script>

<div
  class={dividerClass()}
  role="separator"
  {...metaAttrs}
  {...rest}
></div>
