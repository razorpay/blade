<script lang="ts">
  import type { DividerProps } from './types';
  import {
    makeAccessible,
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';

  let {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    height,
    width,
    testID,
    // Styled props
    ...rest
  }: DividerProps = $props();

  // Ref for DOM access
  let dividerRef = $state<HTMLDivElement | null>(null);

  // Border width mapping
  const thicknessMap = {
    thinner: 'var(--border-width-thinner, 0.5px)',
    thin: 'var(--border-width-thin, 1px)',
    thick: 'var(--border-width-thick, 2px)',
    thicker: 'var(--border-width-thicker, 3px)',
  };

  // Border color based on variant
  const borderColorMap = {
    normal: 'var(--surface-border-gray-normal)',
    subtle: 'var(--surface-border-gray-subtle)',
    muted: 'var(--surface-border-gray-muted)',
  };

  // Computed styles
  const isHorizontal = $derived(orientation === 'horizontal');
  const borderWidth = $derived(thicknessMap[thickness]);
  const borderColor = $derived(borderColorMap[variant]);

  // Styled props (margin, padding, display, etc.)
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Accessibility props
  const accessibilityProps = makeAccessible({
    role: 'separator',
  });

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Divider,
    testID,
  });

  // Build inline styles
  const inlineStyles = $derived(() => {
    const styles: string[] = [
      `--border-width: ${borderWidth}`,
      `--border-color: ${borderColor}`,
      `--border-style: ${dividerStyle}`,
    ];

    if (height) styles.push(`height: ${height}`);
    if (width) styles.push(`width: ${width}`);

    // Add styled props inline styles
    for (const [key, value] of Object.entries(styledProps.inlineStyles)) {
      // Convert camelCase to kebab-case for CSS
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      styles.push(`${cssKey}: ${value}`);
    }

    return styles.join('; ');
  });

  // Export ref for parent access
  export function getElement(): HTMLDivElement | null {
    return dividerRef;
  }
</script>

<div
  bind:this={dividerRef}
  class="divider {styledProps.classes.join(' ')}"
  class:divider--horizontal={isHorizontal}
  class:divider--vertical={!isHorizontal}
  style={inlineStyles()}
  {...accessibilityProps}
  {...metaAttrs}
></div>

<style>
  .divider {
    border-width: 0;
    flex-shrink: 0;
  }

  .divider--horizontal {
    flex-grow: 1;
    border-bottom-style: var(--border-style);
    border-bottom-width: var(--border-width);
    border-bottom-color: var(--border-color);
  }

  .divider--vertical {
    align-self: stretch;
    border-left-style: var(--border-style);
    border-left-width: var(--border-width);
    border-left-color: var(--border-color);
  }
</style>
