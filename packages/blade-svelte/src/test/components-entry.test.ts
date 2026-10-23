import { describe, it, expect } from 'vitest';
import * as components from '../components-entry';
import * as cx from '../index';
import { Modal } from '../components/modal';
import { BottomSheet } from '../components/bottom-sheet';
import { Drawer } from '../components/drawer';
import { Popover } from '../components/popover';
import { Menu } from '../components/menu';

describe('@razorpay/blade-svelte/components', () => {
  it('is the cx set (src/index.ts), and nothing else', () => {
    expect(Object.keys(components).sort()).toEqual(Object.keys(cx).sort());
    for (const [name, value] of Object.entries(cx)) {
      expect(components[name as keyof typeof components], name).toBe(value);
    }
  });

  it("exports cx's overlays", () => {
    expect(components.Modal).toBe(Modal);
    expect(components.BottomSheet).toBe(BottomSheet);
    expect(components.Drawer).toBe(Drawer);
    expect(components.Popover).toBe(Popover);
    expect(components.Menu).toBe(Menu);
  });

  it('leaves the headless hosts and the extras to the app', () => {
    for (const name of [
      'Form',
      'OverlayHost',
      'openModal',
      'Async',
      'NavStack',
      'ResponsiveModal',
      'SearchableCardGroup',
      'VirtualWindow',
      // Kept internal: an app passes adapters through BladeProvider, and
      // brings its own class joiner and field parts.
      'provideAdapters',
      'cx',
      'FieldLabel',
      'FieldHint',
      'resolveSkeleton',
      // The form is an adapter (`adapters.form`), not a context of its own.
      'provideForm',
      'getForm',
      // Layers are internal: an app asks back (`back`).
      'getBack',
      'getLayers',
      'createLayers',
      'globalLayers',
      'resolvePhoneCountryInset',
      // App compositions: libui's.
      'Countdown',
      'COUNTDOWN_AXES',
      'Image',
      'IMAGE_AXES',
    ]) {
      expect(name in components, name).toBe(false);
    }
    // The seams those hosts plug into stay.
    for (const name of ['back', 'showToast']) {
      expect(name in components, name).toBe(true);
    }
  });

  it("exports cx's overlay parts and their classes apart", () => {
    for (const name of [
      'ModalHeader',
      'ModalBody',
      'ModalFooter',
      'BottomSheetHeader',
      'BottomSheetBody',
      'BottomSheetFooter',
      'DrawerHeader',
      'DrawerBody',
      'DrawerFooter',
      'resolveModalHeader',
      'resolveBottomSheetHeader',
      'resolveDrawerHeader',
      'useModalHeader',
    ]) {
      expect(name in components, name).toBe(true);
    }
  });
});
