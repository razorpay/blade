/**
 * Machine-readable counterpart to the prose safety rules on {@link StyleOverride}.
 * Consumed by docs surfaces and playgrounds so the slot catalog is never retyped by hand.
 */
export type SlotDescriptor = {
  /** What the slot targets in the rendered DOM. */
  description: string;
  /** Properties a consumer class can set on this slot without fighting `@layer blade`. */
  safeProperties: readonly string[];
  /** Custom properties to repoint instead of painting {@link SlotDescriptor.unsafeProperties}. */
  safeTokens?: readonly string[];
  /**
   * Properties whose layered pseudo-state rules an unlayered consumer class silently kills
   * (hover / focus-visible / disabled stop repainting).
   */
  unsafeProperties?: readonly string[];
};

export type SlotMeta<Slot extends string = string> = SlotDescriptor & { name: Slot };

export type ComponentSlotMeta<Slot extends string = string> = {
  /** Name of the exported slot union, e.g. `'ButtonSlot'`. */
  slotType: string;
  slots: readonly SlotMeta<Slot>[];
};

/**
 * Keying descriptors by slot name makes metadata exhaustive against the slot union:
 * adding a slot to the union without documenting it fails to compile.
 */
export const defineComponentSlotMeta = <Slot extends string>(
  slotType: string,
  descriptors: Record<Slot, SlotDescriptor>,
): ComponentSlotMeta<Slot> => ({
  slotType,
  slots: (Object.keys(descriptors) as Slot[]).map((name) => ({ name, ...descriptors[name] })),
});
