// The parts of Modal, BottomSheet and Drawer, as Blade React spells them:
// each its own component over its own classes, exported apart
// (`resolveModalHeader`, …) for a consumer building a part of their own.
export * from './styles';
export { default as ModalHeader } from './ModalHeader.svelte';
export { default as ModalBody } from './ModalBody.svelte';
export { default as ModalFooter } from './ModalFooter.svelte';
export { default as BottomSheetHeader } from './BottomSheetHeader.svelte';
export { default as BottomSheetBody } from './BottomSheetBody.svelte';
export { default as BottomSheetFooter } from './BottomSheetFooter.svelte';
export { default as DrawerHeader } from './DrawerHeader.svelte';
export { default as DrawerBody } from './DrawerBody.svelte';
export { default as DrawerFooter } from './DrawerFooter.svelte';
