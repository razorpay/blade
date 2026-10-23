/** The parts of a VirtualWindow. */
export interface VirtualWindowClasses {
  /**
   * The scroll viewport. Scroll anchoring is off: the window corrects the
   * scroll itself as rows are measured (Safari has no anchoring).
   */
  viewport: string;
}

export function resolveVirtualWindow(): VirtualWindowClasses {
  return { viewport: 'overflow-y-auto [overflow-anchor:none]' };
}
