import { zIndex } from '~tokens/global';

export const componentZIndices = {
  bottomSheet: zIndex.sticky,
  bottomNav: zIndex.sticky, // should be behind drawer since sidenav opens in drawer in mobile
  modal: zIndex.overlay,
  drawer: zIndex.drawer,
  dropdownOverlay: zIndex.dropdown,
  tourMask: zIndex.popover,
  popover: zIndex.popover,
  tooltip: zIndex.popover,
  topnav: zIndex.sticky,
  previewPanel: zIndex.popover,
};
