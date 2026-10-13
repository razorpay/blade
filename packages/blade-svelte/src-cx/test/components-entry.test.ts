import { describe, it, expect } from 'vitest';
import * as components from '../components-entry';
import * as cx from '../index';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../src/components/Modal';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
} from '../../src/components/BottomSheet';

describe('@razorpay/blade-svelte/components', () => {
  it('is the cx set (src-cx/index.ts)', () => {
    for (const [name, value] of Object.entries(cx)) {
      expect(components[name as keyof typeof components], name).toBe(value);
    }
  });

  it("adds Blade's Modal and BottomSheet from src/, which the cx set does not export", () => {
    expect(components.Modal).toBe(Modal);
    expect(components.ModalHeader).toBe(ModalHeader);
    expect(components.ModalBody).toBe(ModalBody);
    expect(components.ModalFooter).toBe(ModalFooter);
    expect(components.BottomSheet).toBe(BottomSheet);
    expect(components.BottomSheetHeader).toBe(BottomSheetHeader);
    expect(components.BottomSheetBody).toBe(BottomSheetBody);
    expect(components.BottomSheetFooter).toBe(BottomSheetFooter);
    expect('Modal' in cx).toBe(false);
    expect('BottomSheet' in cx).toBe(false);
    expect('Drawer' in components).toBe(false);
  });
});
