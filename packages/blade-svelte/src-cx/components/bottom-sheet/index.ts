import type { BottomSheetComponent } from './styles';
import BottomSheetImpl from './BottomSheet.svelte';

export {
  BOTTOM_SHEET_AXES,
  type BottomSheetStyleProps,
  type BottomSheetBehaviourProps,
  type BottomSheetComponent,
} from './styles';

export const BottomSheet: BottomSheetComponent = BottomSheetImpl;
