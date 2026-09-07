/**
 * Runtime slot catalog for components that accept `styleOverride`. Docs surfaces and playgrounds
 * iterate this instead of retyping slot names by hand, so it cannot drift from the slot unions.
 */
export type SlotMeta<Slot extends string = string> = { name: Slot };

export type ComponentSlotMeta<Slot extends string = string> = {
  /** Name of the exported slot union, e.g. `'ButtonSlot'`. */
  slotType: string;
  slots: readonly SlotMeta<Slot>[];
};

/**
 * Keying by slot name makes the catalog exhaustive against the slot union: adding a slot to the
 * union without listing it here fails to compile, and a typo'd name is rejected too.
 */
export const defineComponentSlots = <Slot extends string>(
  slotType: string,
  slots: Record<Slot, true>,
): ComponentSlotMeta<Slot> => ({
  slotType,
  slots: (Object.keys(slots) as Slot[]).map((name) => ({ name })),
});
