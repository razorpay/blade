import type { BottomSheetComponent } from './styles';
import BottomSheetImpl from './BottomSheet.svelte';

export { BOTTOM_SHEET_AXES } from './styles';
export type {
  BottomSheetStyleProps,
  BottomSheetBehaviourProps,
  BottomSheetComponent,
} from './styles';

export const BottomSheet: BottomSheetComponent = BottomSheetImpl;
