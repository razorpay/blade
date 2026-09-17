<script lang="ts">
  import { setBottomSheetContext } from '../../BottomSheet/bottomSheetContext';
  import ActionList from '../ActionList.svelte';
  import ActionListItem from '../ActionListItem.svelte';

  setBottomSheetContext(() => ({
    isInBottomSheet: true,
    isOpen: true,
    close: () => {},
    isHeaderFloating: false,
    isDismissible: true,
    setContentHeight: () => {},
    setHeaderHeight: () => {},
    setFooterHeight: () => {},
    setHasBodyPadding: () => {},
    setIsHeaderEmpty: () => {},
    setScrollElement: () => {},
    setDefaultFocusElement: () => {},
  }));
</script>

<ActionList testID="action-list-in-sheet">
  {#snippet children()}
    <ActionListItem title="Item 1" value="item1" />
  {/snippet}
</ActionList>
