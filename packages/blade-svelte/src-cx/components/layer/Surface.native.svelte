<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createNativeSurface } from '../../runes/layer/surface.svelte';
  import type { SurfaceClasses } from './styles';

  interface Props {
    isOpen: boolean;
    isTop: boolean;
    role: 'dialog' | 'alertdialog';
    labelledBy?: string;
    describedBy?: string;
    accessibilityLabel?: string;
    classes: SurfaceClasses;
    /** The platform does not say how the user left: reported as `blur`. */
    onDismissRequest: (source: 'blur' | 'drag') => void;
    onClosed?: () => void;
    testID?: string;
    class?: string;
    /** The platform sheet owns its drag: the header is plain content. */
    header?: Snippet;
    /**
     * The chrome box on the sheet's top edge. The platform draws its own
     * handle, and may clip what hangs above the sheet.
     */
    chrome?: Snippet;
    children: Snippet;
  }

  let {
    isOpen,
    role,
    labelledBy,
    describedBy,
    accessibilityLabel,
    classes,
    onDismissRequest,
    onClosed,
    testID,
    class: className = '',
    header,
    chrome,
    children,
  }: Props = $props();

  createNativeSurface({
    isOpen: () => isOpen,
    onClosed: () => onClosed?.(),
  });

  // The native half of an overlay surface. The platform's sheet host
  // (packages/native DragSheetHost) reparents this element into its own
  // in-window overlay and owns everything Surface.svelte does by hand: the
  // scrim, enter/exit, stacking by present order, focus, the keyboard lift
  // and hardware BACK. A user dismissal arrives as a *request* — the sheet
  // only goes away when this element unmounts — so the owner's model still
  // decides, exactly as on web.
</script>

{#if isOpen}
  <native-bottom-sheet
    {role}
    aria-labelledby={labelledBy}
      aria-describedby={describedBy}
    aria-label={labelledBy ? undefined : accessibilityLabel}
    class={cx(classes.panel, className)}
    data-testid={testID}
    ondismiss={() => onDismissRequest('blur')}
    {...classes.nativeSheet}
  >
    <div class="relative h-0">
      <div class={classes.chrome}>{@render chrome?.()}</div>
    </div>
    {@render header?.()}
    {@render children()}
  </native-bottom-sheet>
{/if}
