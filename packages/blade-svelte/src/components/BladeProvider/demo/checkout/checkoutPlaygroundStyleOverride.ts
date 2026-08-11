import {
  DEMO_CSS_VAR_DEFAULTS,
  STYLE_OVERRIDE_COMPONENTS,
  isStyleOverrideComponent,
  type SlotClassMap,
  type StyleOverrideComponent,
} from '../styleOverride/styleOverrideEngine';
import { SIGNATURE_SLOT_CLASSES } from '../styleOverride/styleOverridePresets';

/**
 * Checkout's slice of the shared `styleOverride` engine: which components the preview wires to
 * the panel, and the seed values this surface has to differ on. Everything else — the slot
 * catalog, class parsing, generated CSS and snippets — lives in `demo/styleOverride/`.
 */

/** Every component the engine knows about is selectable; the preview applies them via provider config. */
export type CheckoutStyleComponent = StyleOverrideComponent;

export const CHECKOUT_STYLE_COMPONENTS: readonly CheckoutStyleComponent[] =
  STYLE_OVERRIDE_COMPONENTS;

/**
 * Slots whose checkout look belongs to the page design rather than to a preset: the promo banner
 * reads light on a dark faded strip, and the app bar title sits on the dark primary surface (the
 * standalone playground previews the same slot on light surfaces, so it keeps `--demo-text`).
 * These are seeds, not locks — the panel replaces them and `Reset` restores them.
 */
const CHECKOUT_SLOT_CLASS_SEED: Partial<Record<CheckoutStyleComponent, SlotClassMap>> = {
  AnnouncementBanner: {
    root: 'checkout-promo-banner-root',
    text: 'checkout-promo-banner-text',
  },
  AppBarLeading: { title: 'text-(--demo-appbar-title)' },
};

const CHECKOUT_CSS_VAR_SEED: Record<string, string> = {
  '--demo-appbar-title': '#FFFFFF',
};

/**
 * Components this checkout renders in a mode that discards `styleOverride`. They stay selectable
 * — the slot catalog and copy-ready snippets are still worth reading — but they are seeded empty
 * so no look appears applied and the component logs no ignored-override warning.
 */
export const CHECKOUT_INERT_COMPONENT_NOTES: Partial<Record<CheckoutStyleComponent, string>> = {
  Accordion:
    'This checkout renders Accordion with variant="filled", which ignores styleOverride. Use variant="transparent" in your app to patch these slots.',
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
  for (const component of Object.keys(
    CHECKOUT_INERT_COMPONENT_NOTES,
  ) as CheckoutStyleComponent[]) {
    slotClasses[component] = {};
  }
  return slotClasses;
};

export const createCheckoutCssVars = (): Record<string, string> => ({
  ...DEMO_CSS_VAR_DEFAULTS,
  ...CHECKOUT_CSS_VAR_SEED,
});

export const isCheckoutStyleComponent = (value: string): value is CheckoutStyleComponent =>
  isStyleOverrideComponent(value);
