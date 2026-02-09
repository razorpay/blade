<script lang="ts">
  import { getDividerClasses } from '@razorpay/blade-core/styles';
  import { metaAttribute, MetaConstants, getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import type { DividerProps } from './types';

  let {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    height,
    width,
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

  // Build inline styles for height/width if provided
  const inlineStyle = $derived(() => {
    const styles: string[] = [];
    if (height) styles.push(`height: ${height}`);
    if (width) styles.push(`width: ${width}`);

    // Add inline styles from styled props
    if (styledProps.inlineStyles) {
      Object.entries(styledProps.inlineStyles).forEach(([key, value]) => {
        // Convert camelCase to kebab-case for CSS
        const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        styles.push(`${cssKey}: ${value}`);
      });
    }

    return styles.length > 0 ? styles.join('; ') : undefined;
  });
</script>

<div
  class={dividerClass()}
  role="separator"
  style={inlineStyle()}
  {...rest}
/>
