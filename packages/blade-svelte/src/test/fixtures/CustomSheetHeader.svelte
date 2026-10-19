<script lang="ts">
  import { cx } from '../../cx';
  import { resolveBottomSheetHeader } from '../../components/modal-children';
  import { useModalHeader } from '../../runes/modal/header.svelte';

  // A header built from BottomSheetHeader's classes, wired by useModalHeader:
  // it names the sheet, leaves room for the close and takes the drag.
  const wiring = useModalHeader({
    hasContent: () => true,
    hasTitle: () => true,
    hasSubtitle: () => false,
  });
  const classes = $derived(resolveBottomSheetHeader({ hasHandle: wiring.hasHandle ?? true }));
</script>

<div
  class={cx(classes.root, wiring.dragZone?.className)}
  data-testid="custom-header"
  {@attach wiring.dragZone?.attach}
>
  <div class={cx(classes.row, wiring.hasClose && classes.closeClearance)}>
    <p id={wiring.titleId} class={classes.title}>My own header</p>
  </div>
</div>
