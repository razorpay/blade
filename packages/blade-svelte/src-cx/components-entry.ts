// `@razorpay/blade-svelte/components`: the cx component library (`./index`)
// plus Blade's Modal and BottomSheet from `src/`, which cx
// does not export yet (see `./components/index.ts`). Drawer has no `src/`
// counterpart, so it is not here either. Blade's components read blade-core's
// prebuilt CSS; import `@razorpay/blade-core/tokens/theme.css` for their
// tokens.
export * from './index';

export { Modal, ModalHeader, ModalBody, ModalFooter } from '../src/components/Modal';
export type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from '../src/components/Modal';
export {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
} from '../src/components/BottomSheet';
export type {
  BottomSheetProps,
  BottomSheetHeaderProps,
  BottomSheetBodyProps,
  BottomSheetFooterProps,
  SnapPoints,
} from '../src/components/BottomSheet';
