import type { SlotClassMap, StyleOverrideComponent } from '../styleOverride/styleOverrideEngine';
import {
  DEMO_CSS_VAR_DEFAULTS,
  STYLE_OVERRIDE_COMPONENTS,
  isStyleOverrideComponent,
} from '../styleOverride/styleOverrideEngine';
import type { SlotClassMap, StyleOverrideComponent } from '../styleOverride/styleOverrideEngine';
import { SIGNATURE_SLOT_CLASSES } from '../styleOverride/styleOverridePresets';

/**
 * Checkout's slice of the shared `styleOverride` engine: which components the preview wires to
 * the panel, and the seed values this surface has to differ on. Everything else — the slot
 * catalog, class parsing, generated CSS and snippets — lives in `demo/styleOverride/`.
 */

/** Every component the engine knows about is selectable; the preview applies them via provider config. */
export type CheckoutStyleComponent = StyleOverrideComponent;

export const CHECKOUT_STYLE_COMPONENTS: readonly CheckoutStyleComponent[] = STYLE_OVERRIDE_COMPONENTS;

/**
 * Slots whose checkout look belongs to the page design rather than to a preset: the promo banner
 * reads light on a dark faded strip, and the app bar title sits on the dark primary surface (the
 * standalone playground previews the same slot on light surfaces, so it keeps `--demo-text`).
 * These are seeds, not locks — the panel replaces them and `Reset` restores them.
 */
const CHECKOUT_SLOT_CLASS_SEED: Partial<Record<CheckoutStyleComponent, SlotClassMap>> = {
  AnnouncementBanner: {
    root: 'bg-transparent',
    text: 'text-(--demo-promo-text)',
  },
  AppBarLeading: { title: 'text-(--demo-appbar-title)' },
  /**
   * This checkout renders each Accordion header with a custom `children` snippet and custom body
   * content, so the `title` / `subtitle` spans never mount and `body`'s inherited text color is
   * overridden by the inner `Text`s. Seed only the slots that paint here — `body` as a background,
   * not text — and blank the rest so no dead classname is advertised.
   */
  Accordion: {
    title: '',
    subtitle: '',
    body: 'bg-(--demo-accordion-body-bg)',
  },
};

const CHECKOUT_CSS_VAR_SEED: Record<string, string> = {
  '--demo-appbar-title': '#FFFFFF',
  '--demo-promo-text': '#FFFFFF',
};

/**
 * Notes surfaced under the component picker. Accordion renders as a fixed `variant="filled"` shell
 * in this checkout, which discards `styleOverride`; while Accordion is the applied override target
 * the preview flips it to `variant="transparent"` so its seeded slot classes actually paint.
 */
export const CHECKOUT_COMPONENT_NOTES: Partial<Record<CheckoutStyleComponent, string>> = {
  Accordion:
    'This checkout renders Accordion as variant="filled". While it is the applied override target the preview switches it to variant="transparent" so these slots paint — do the same in your app.',
};

export const createCheckoutSlotClasses = (): Record<CheckoutStyleComponent, SlotClassMap> => {
  const slotClasses = Object.fromEntries(
    CHECKOUT_STYLE_COMPONENTS.map((name) => [name, { ...SIGNATURE_SLOT_CLASSES[name] }]),
  ) as Record<CheckoutStyleComponent, SlotClassMap>;
  for (const component of Object.keys(CHECKOUT_SLOT_CLASS_SEED) as CheckoutStyleComponent[]) {
    slotClasses[component] = {
      ...slotClasses[component],
      ...CHECKOUT_SLOT_CLASS_SEED[component],
    };
  }
  return slotClasses;
};

export const createCheckoutCssVars = (): Record<string, string> => ({
  ...DEMO_CSS_VAR_DEFAULTS,
  ...CHECKOUT_CSS_VAR_SEED,
});

export const isCheckoutStyleComponent = (value: string): value is CheckoutStyleComponent =>
  isStyleOverrideComponent(value);
