<script lang="ts">
  import { getDividerClasses } from '@razorpay/blade-core/styles';
  import { metaAttribute, MetaConstants, getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import type { DividerProps } from './types';

  let {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    testID,
    class: className,
    ...rest
  }: DividerProps = $props();

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
    return classes.filter(Boolean).join(' ');
  });

  // Build meta attributes for testing
  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Divider, testID }));
</script>

<div
  class={dividerClass()}
  role="separator"
  {...metaAttrs}
  {...rest}
/>
